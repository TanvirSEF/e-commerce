"use client"

import React, { useState, useTransition } from "react"
import { Search, Plus, Trash2, Edit, Eye, X, CheckCircle2, AlertCircle } from "lucide-react"
import type { OrderNote } from "@/db/schema"
import {
  createSellerNoteAction,
  updateSellerNoteAction,
  deleteSellerNoteAction,
} from "@/app/actions/ecommerce-actions"

interface SellerNotesViewProps {
  initialNotes: OrderNote[]
  shopName: string
}

export function SellerNotesView({ initialNotes, shopName }: SellerNotesViewProps) {
  const [notes, setNotes] = useState<OrderNote[]>(initialNotes)
  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<OrderNote | null>(null)
  const [viewTarget, setViewTarget] = useState<OrderNote | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

  // Form state
  const [formTitle, setFormTitle] = useState("")
  const [formContent, setFormContent] = useState("")
  const [formType, setFormType] = useState("shipping")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3000)
  }

  const openCreateModal = () => {
    setFormTitle("")
    setFormContent("")
    setFormType("shipping")
    setEditTarget(null)
    setCreateModalOpen(true)
  }

  const openEditModal = (note: OrderNote) => {
    setEditTarget(note)
    setFormTitle(note.title)
    setFormContent(note.content)
    setFormType(note.type || "shipping")
    setCreateModalOpen(true)
  }

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formContent.trim()) return

    startTransition(async () => {
      if (editTarget) {
        const res = await updateSellerNoteAction({
          id: editTarget.id,
          title: formTitle.trim() || formContent.slice(0, 40),
          content: formContent.trim(),
          type: formType,
        })
        if (res.success) {
          setNotes((prev) =>
            prev.map((n) =>
              n.id === editTarget.id
                ? {
                    ...n,
                    title: formTitle.trim() || formContent.slice(0, 40),
                    content: formContent.trim(),
                    type: formType,
                  }
                : n
            )
          )
          showToast("success", "Note updated successfully!")
          setCreateModalOpen(false)
        } else {
          showToast("error", "Failed to update note.")
        }
      } else {
        const res = await createSellerNoteAction({
          title: formTitle.trim() || formContent.slice(0, 40),
          content: formContent.trim(),
          type: formType,
        })
        if (res.success && res.note) {
          setNotes((prev) => [res.note!, ...prev])
          showToast("success", "Note created successfully!")
          setCreateModalOpen(false)
        } else {
          showToast("error", "Failed to create note.")
        }
      }
    })
  }

  const handleDelete = () => {
    if (!deleteTargetId) return
    startTransition(async () => {
      const res = await deleteSellerNoteAction(deleteTargetId)
      if (res.success) {
        setNotes((prev) => prev.filter((n) => n.id !== deleteTargetId))
        showToast("success", "Note deleted successfully!")
        setDeleteTargetId(null)
      } else {
        showToast("error", "Failed to delete note.")
      }
    })
  }

  const filtered = notes.filter((n) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      n.title?.toLowerCase().includes(q) ||
      n.content?.toLowerCase().includes(q) ||
      n.type?.toLowerCase().includes(q)
    )
  })

  const typeBadgeColors: Record<string, string> = {
    refund: "bg-red-50 text-red-600 border-red-200",
    warranty: "bg-purple-50 text-purple-600 border-purple-200",
    shipping: "bg-blue-50 text-blue-600 border-blue-200",
    delivery: "bg-emerald-50 text-emerald-600 border-emerald-200",
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-sm rounded border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {feedback.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">All Notes</h1>
        </div>
        <div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#17a2b8] hover:bg-[#138496] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add New Note
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="rounded border border-gray-200 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 capitalize">notes</h2>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Type name & Enter"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 w-1/2">Description</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No notes found
                  </td>
                </tr>
              ) : (
                filtered.map((note, idx) => (
                  <tr key={note.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 text-gray-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{shopName}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold uppercase ${
                          typeBadgeColors[note.type?.toLowerCase() || "shipping"] ||
                          "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {note.type || "shipping"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <p className="line-clamp-2">{note.content}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewTarget(note)}
                          title="Note Description"
                          className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(note)}
                          title="Edit"
                          className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(note.id)}
                          title="Delete"
                          className="w-7 h-7 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Note Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">
                {editTarget ? "Edit Note" : "Add New Note"}
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveNote} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
                >
                  <option value="refund">Refund</option>
                  <option value="warranty">Warranty</option>
                  <option value="shipping">Shipping</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter note description..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#d43533] hover:bg-[#b82a28] rounded shadow-xs disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Note Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">Note Description</h3>
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <span
                className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold uppercase ${
                  typeBadgeColors[viewTarget.type?.toLowerCase() || "shipping"] ||
                  "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {viewTarget.type || "shipping"}
              </span>
              <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
                {viewTarget.content}
              </p>
            </div>
            <div className="flex justify-end p-3 bg-gray-50 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
            <h4 className="text-sm font-bold text-gray-900">Delete Confirmation</h4>
            <p className="text-xs text-gray-500 mt-2">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
