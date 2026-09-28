"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Truck, Plus, Edit2, Trash2, X, CheckCircle, Search } from "lucide-react"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"

import {
  createCarrierAction,
  updateCarrierAction,
  toggleCarrierStatusAction,
  deleteCarrierAction,
} from "@/app/actions/carrier-actions"

interface Carrier {
  id: number
  name: string
  transitTime: string
  logo: string
  status: boolean
  freeShipping: boolean
}

interface AdminCarriersViewProps {
  initialCarriers: Carrier[]
}

export function AdminCarriersView({ initialCarriers }: AdminCarriersViewProps) {
  const [carriers, setCarriers] = useState<Carrier[]>(initialCarriers)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCarrier, setEditingCarrier] = useState<Carrier | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [carrierToDelete, setCarrierToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form State
  const [formName, setFormName] = useState("")
  const [formTransit, setFormTransit] = useState("")
  const [formLogo, setFormLogo] = useState("")
  const [formStatus, setFormStatus] = useState(true)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const openAddModal = () => {
    setEditingCarrier(null)
    setFormName("")
    setFormTransit("2-3 Business Days")
    setFormLogo("")
    setFormStatus(true)
    setIsModalOpen(true)
  }

  const openEditModal = (c: Carrier) => {
    setEditingCarrier(c)
    setFormName(c.name)
    setFormTransit(c.transitTime)
    setFormLogo(c.logo)
    setFormStatus(c.status)
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (id: number) => {
    const target = carriers.find((c) => c.id === id)
    if (!target) return
    const newStatus = !target.status
    setCarriers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    )
    await toggleCarrierStatusAction(id, newStatus)
  }

  const handleDeleteClick = (id: number) => {
    setCarrierToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!carrierToDelete) return
    setIsDeleting(true)
    try {
      await deleteCarrierAction(carrierToDelete)
      setCarriers((prev) => prev.filter((c) => c.id !== carrierToDelete))
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setCarrierToDelete(null)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return
    setIsSaving(true)

    try {
      if (editingCarrier) {
        await updateCarrierAction(editingCarrier.id, {
          name: formName,
          transitTime: formTransit,
          logo: formLogo,
          status: formStatus,
        })
        setCarriers((prev) =>
          prev.map((c) =>
            c.id === editingCarrier.id
              ? { ...c, name: formName, transitTime: formTransit, logo: formLogo, status: formStatus }
              : c
          )
        )
      } else {
        const res = await createCarrierAction({
          name: formName,
          transitTime: formTransit,
          logo: formLogo,
          status: formStatus,
          freeShipping: false,
        })
        const newId = res.data?.id || Date.now()
        const newCarrier: Carrier = {
          id: newId,
          name: formName,
          transitTime: formTransit,
          logo: formLogo,
          status: formStatus,
          freeShipping: false,
        }
        setCarriers((prev) => [newCarrier, ...prev])
      }
      setIsModalOpen(false)
    } finally {
      setIsSaving(false)
    }
  }

  const filtered = carriers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Carriers</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage courier companies and shipping carrier services
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Carrier
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-gray-800">Carriers List ({filtered.length})</h3>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search carrier name..."
              className="text-xs pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg outline-none w-56 focus:border-[#d43533]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 text-gray-500 font-semibold border-b border-gray-100 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Logo</th>
                <th className="py-3 px-4">Carrier Name</th>
                <th className="py-3 px-4">Transit Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filtered.map((carrier, idx) => (
                <tr key={carrier.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <img
                      src={carrier.logo}
                      alt={carrier.name}
                      className="w-12 h-8 object-contain rounded border border-gray-100 bg-white p-0.5"
                    />
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">{carrier.name}</td>
                  <td className="py-3 px-4 text-gray-600">{carrier.transitTime}</td>
                  <td className="py-3 px-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={carrier.status}
                        onChange={() => handleToggleStatus(carrier.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(carrier)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(carrier.id)}
                        disabled={isDeleting && carrierToDelete === carrier.id}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-800">
                {editingCarrier ? "Edit Carrier" : "Add New Carrier"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Carrier Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. DHL Express"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Transit Time</label>
                <input
                  type="text"
                  value={formTransit}
                  onChange={(e) => setFormTransit(e.target.value)}
                  placeholder="e.g. 1-3 Business Days"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Logo <span className="text-gray-400 font-normal">(120x80)</span>
                </label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(true)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 font-medium border-r border-gray-300 transition-colors shrink-0 cursor-pointer"
                  >
                    Browse
                  </button>
                  <div
                    onClick={() => setIsPickerOpen(true)}
                    className="px-3 py-2 text-gray-500 bg-white flex-1 cursor-pointer truncate flex items-center"
                  >
                    {formLogo ? (
                      <span className="text-gray-800 font-medium truncate">1 File selected</span>
                    ) : (
                      <span className="text-gray-400">Choose File</span>
                    )}
                  </div>
                </div>
                {formLogo && (
                  <div className="mt-2 relative w-16 h-12 rounded border border-gray-200 overflow-hidden bg-gray-50">
                    <Image
                      src={formLogo}
                      alt="Carrier Logo"
                      fill
                      className="object-contain p-1"
                    />
                    <button
                      type="button"
                      onClick={() => setFormLogo("")}
                      className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black text-white rounded-full p-0.5"
                      title="Remove"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-gray-700">Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formStatus}
                    onChange={(e) => setFormStatus(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#d43533] text-white text-xs font-semibold rounded-lg hover:bg-[#b82d2b]"
              >
                {editingCarrier ? "Update Carrier" : "Create Carrier"}
              </button>
            </div>
          </form>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setCarrierToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Shipping Carrier"
        description="Are you sure you want to delete this shipping carrier? This action cannot be undone."
      />

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(urls) => {
          if (urls.length > 0) {
            setFormLogo(urls[0])
          }
          setIsPickerOpen(false)
        }}
        title="Select Carrier Logo"
      />
    </div>
  )
}
