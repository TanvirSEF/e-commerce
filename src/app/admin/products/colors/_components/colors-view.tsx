"use client"

import React, { useState } from "react"
import { Palette, Plus, Trash2, Search, CheckCircle2, Sliders } from "lucide-react"
import { createColorAction, deleteColorAction } from "@/app/actions/ecommerce-actions"
import type { ColorData } from "@/services/color-service"

interface ColorsViewProps {
  initialColors: ColorData[]
}

export function ColorsView({ initialColors }: ColorsViewProps) {
  const [colorsList, setColorsList] = useState<ColorData[]>(initialColors)
  const [search, setSearch] = useState("")
  const [colorFilterActive, setColorFilterActive] = useState(true)

  // Form states
  const [newName, setNewName] = useState("")
  const [newCode, setNewCode] = useState("#000000")
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [successMsg, setSuccessMsg] = useState("")

  const filtered = colorsList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newCode) return

    setSaving(true)
    const res = await createColorAction({ name: newName, code: newCode })
    if (res.color) {
      setColorsList([res.color, ...colorsList])
      setSuccessMsg(`Color "${newName}" added successfully!`)
      setNewName("")
      setNewCode("#000000")
      setTimeout(() => setSuccessMsg(""), 3000)
    }
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this color?")) return
    setDeletingId(id)
    await deleteColorAction(id)
    setColorsList((prev) => prev.filter((c) => c.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#d43533]" />
          Product Colors Management
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure product color attributes, hex codes, and filter swatches for catalog variation selectors.
        </p>
      </div>

      {/* Info Notice matching Laravel color_filter_activation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-blue-900">
            Activate Color Filter for Storefront Product Listing Pages
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={colorFilterActive}
            onChange={(e) => setColorFilterActive(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
        </label>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colors Table (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-gray-900">Colors List ({colorsList.length})</h2>
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search colors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-y border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Swatch</th>
                  <th className="py-2.5 px-3">Color Name</th>
                  <th className="py-2.5 px-3">Hex Code</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-gray-400 font-semibold">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-2.5 px-3">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300 shadow-xs"
                        style={{ backgroundColor: c.code }}
                        title={c.code}
                      />
                    </td>
                    <td className="py-2.5 px-3 font-bold text-gray-900">{c.name}</td>
                    <td className="py-2.5 px-3 font-mono text-gray-600 uppercase">{c.code}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                        className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                        title="Delete color"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Color Form (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#d43533]" />
            Add New Color
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Color Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Midnight Blue"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Color Code (Hex) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  required
                  placeholder="#000000"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full text-xs font-mono uppercase border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d43533]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {saving ? "Saving Color..." : "Save Color"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
