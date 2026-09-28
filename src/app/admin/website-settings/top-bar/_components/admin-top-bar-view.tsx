"use client"

import React, { useState } from "react"
import { Megaphone, Plus, Edit2, Trash2, Settings2, CheckCircle2 } from "lucide-react"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { EditBannerModal, type Banner } from "./edit-banner-modal"

interface TopBarConfig {
  backgroundColor: string
  textColor: "white" | "dark"
  height: number
  link: string
}

interface AdminTopBarViewProps {
  initialBanners: Banner[]
  initialConfig: TopBarConfig
}

export function AdminTopBarView({ initialBanners, initialConfig }: AdminTopBarViewProps) {
  const [activeTab, setActiveTab] = useState<"list" | "settings">("list")
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [config, setConfig] = useState<TopBarConfig>(initialConfig)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Add/Edit State
  const [newText, setNewText] = useState("")
  const [newLink, setNewLink] = useState("")
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggleStatus = (id: number) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: !b.status } : b))
    )
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newText.trim()) return

    const newBanner: Banner = {
      id: Date.now(),
      text: newText.trim(),
      link: newLink.trim() || "#",
      status: true,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setBanners([newBanner, ...banners])
    setNewText("")
    setNewLink("")
  }

  const openEditModal = (b: Banner) => {
    setEditingBanner(b)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (id: number, text: string, link: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, text, link } : b))
    )
    setIsEditModalOpen(false)
    setEditingBanner(null)
  }

  const handleDeleteClick = (id: number) => {
    setBannerToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!bannerToDelete) return
    setIsDeleting(true)
    try {
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete))
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setBannerToDelete(null)
    }
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#d43533]" />
            Top Bar & Announcement Banner Settings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage top notification tickers, announcement bars, colors, and layout appearance
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Top Bars ({banners.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "settings"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Appearance Settings
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Settings updated successfully!
        </div>
      )}

      {activeTab === "list" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-800">
                Active Top Bars
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4 w-10">#</th>
                    <th className="py-3 px-4">Banner Text</th>
                    <th className="py-3 px-4">Link</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {banners.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 text-gray-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-800 max-w-xs truncate">
                        {b.text}
                      </td>
                      <td className="py-3 px-4 text-blue-600 truncate max-w-[120px]">
                        {b.link}
                      </td>
                      <td className="py-3 px-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={b.status}
                            onChange={() => handleToggleStatus(b.id)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
                        </label>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(b)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(b.id)}
                            disabled={isDeleting && bannerToDelete === b.id}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Form */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-800 pb-3 border-b border-gray-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#d43533]" />
              Add Top Bar Announcement
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g. Free shipping on orders over ৳1,500!"
                  required
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Redirect Link
                </label>
                <input
                  type="text"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="e.g. /flash-deals"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Save Announcement
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Appearance Settings */
        <div className="max-w-xl bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-gray-600" />
                Global Top Bar Styling
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.backgroundColor}
                  onChange={(e) =>
                    setConfig({ ...config, backgroundColor: e.target.value })
                  }
                  className="w-10 h-10 border-0 p-0 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={config.backgroundColor}
                  onChange={(e) =>
                    setConfig({ ...config, backgroundColor: e.target.value })
                  }
                  className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d43533]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Text Color Scheme
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="textColor"
                    checked={config.textColor === "white"}
                    onChange={() => setConfig({ ...config, textColor: "white" })}
                    className="text-[#d43533]"
                  />
                  Light (White)
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="textColor"
                    checked={config.textColor === "dark"}
                    onChange={() => setConfig({ ...config, textColor: "dark" })}
                    className="text-[#d43533]"
                  />
                  Dark (Black)
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      <EditBannerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingBanner(null)
        }}
        banner={editingBanner}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setBannerToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Announcement"
        description="Are you sure you want to delete this Top Bar message? This will immediately remove it from the store header."
      />
    </div>
  )
}
