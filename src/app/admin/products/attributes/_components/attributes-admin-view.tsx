"use client"

import React, { useState } from "react"
import {
  Layers,
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Tag,
} from "lucide-react"
import {
  createAttributeAction,
  deleteAttributeAction,
} from "@/app/actions/ecommerce-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { EditAttributeModal } from "./edit-attribute-modal"
import type { AttributeItem } from "@/services/attribute-service"

interface AttributesAdminViewProps {
  initialAttributes: AttributeItem[]
}

export function AttributesAdminView({
  initialAttributes,
}: AttributesAdminViewProps) {
  const [attributes, setAttributes] = useState<AttributeItem[]>(initialAttributes)
  const [search, setSearch] = useState("")

  // New Attribute Form
  const [newName, setNewName] = useState("")
  const [newValuesStr, setNewValuesStr] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Edit Attribute Modal & Delete Modal
  const [editingAttr, setEditingAttr] = useState<AttributeItem | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [attrToDelete, setAttrToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = attributes.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.values.some((v) => v.toLowerCase().includes(search.toLowerCase()))
  )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const values = newValuesStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    setIsSubmitting(true)
    try {
      const res = await createAttributeAction({
        name: newName.trim(),
        values,
      })

      const newItem: AttributeItem = {
        id: (res.item as any)?.id || Date.now(),
        name: newName.trim(),
        values,
      }
      setAttributes((prev) => [newItem, ...prev])
      setNewName("")
      setNewValuesStr("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (id: number) => {
    setAttrToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!attrToDelete) return
    setIsDeleting(true)
    try {
      await deleteAttributeAction(attrToDelete)
      setAttributes((prev) => prev.filter((a) => a.id !== attrToDelete))
    } catch (err) {
      console.error("Error deleting attribute:", err)
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setAttrToDelete(null)
    }
  }

  const handleSavedAttribute = (updated: AttributeItem) => {
    setAttributes((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    )
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#d43533]" />
          Product Attributes & Variations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage product variation attributes (e.g. Size, Color, Fabric, Storage) for product options
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attributes List (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900">
                Attributes List ({attributes.length})
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter attributes or values..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 w-12">#</th>
                    <th className="px-5 py-3">Attribute Name</th>
                    <th className="px-5 py-3">Values</th>
                    <th className="px-5 py-3 text-right">Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-xs text-slate-400">
                        No attributes found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3.5 text-slate-400 font-medium">{idx + 1}</td>
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          {item.name}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap gap-1.5 max-w-md">
                            {item.values.map((v) => (
                              <span
                                key={v}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingAttr(item)}
                              className="p-1.5 rounded text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="Edit Attribute & Values"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(item.id)}
                              className="p-1.5 rounded text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                              title="Delete Attribute"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add New Attribute Card (1 Column) */}
        <div>
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden sticky top-6">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#d43533]" />
                Add New Attribute
              </h3>
            </div>

            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attribute Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sleeve Length, Screen Size"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Values (Comma Separated)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Short Sleeve, Long Sleeve, Sleeveless"
                  value={newValuesStr}
                  onChange={(e) => setNewValuesStr(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded focus:border-[#d43533] focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Separate each option with a comma. You can also edit values later.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Attribute"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <EditAttributeModal
        attr={editingAttr}
        onClose={() => setEditingAttr(null)}
        onSave={handleSavedAttribute}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false)
            setAttrToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Confirmation"
        description="Are you sure you want to delete this product attribute and all its option values? Products configured with these variants may lose option mapping."
      />
    </div>
  )
}
