"use client"

import React, { useState } from "react"
import { Search, Plus, Trash2, Edit3, X, CheckCircle } from "lucide-react"

interface NoteItem {
  id: string
  title: string
  content: string
  createdAt: string
}

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: "note-1",
    title: "Fragile Delivery Handling",
    content: "Please ensure double bubble wrap is used for all glass and ceramics orders before shipping.",
    createdAt: "2026-09-22",
  },
  {
    id: "note-2",
    title: "Holiday Courier Pickup Notice",
    content: "Pathao and Steadfast couriers will operate on limited hours next weekend. Dispatch before 3 PM.",
    createdAt: "2026-09-18",
  },
  {
    id: "note-3",
    title: "Invoice Serial Tracking",
    content: "Add customer phone number on top of carton label for faster delivery verification.",
    createdAt: "2026-09-10",
  },
]

export function SellerNotesView() {
  const [notes, setNotes] = useState<NoteItem[]>(DEFAULT_NOTES)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title,
      content,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setNotes([newNote, ...notes])
    setTitle("")
    setContent("")
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      setModalOpen(false)
    }, 1000)
  }

  const handleDelete = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id))
  }

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Title & Add Note Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Order & Staff Notes</h1>
          <p className="text-xs text-gray-500">
            Keep quick operational reminders, packaging instructions, and courier guidelines
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#b82a28] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Note
        </button>
      </div>

      {/* Notes Container */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">All Saved Notes ({filtered.length})</h2>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-gray-300 pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
            />
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-[10px] border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Note Content</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-xs text-gray-400">
                    No notes found. Click &quot;Add New Note&quot; to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((note, idx) => (
                  <tr key={note.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-5 py-3.5 font-bold text-gray-800 whitespace-nowrap">
                      {note.title}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 max-w-md">
                      {note.content}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">
                      {note.createdAt}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        className="rounded p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Note Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
              <h3 className="text-sm font-bold text-gray-900">Add New Order Note</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Note Title <span className="text-[#d43533]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Packing Guideline for Electronics"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Note Details <span className="text-[#d43533]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write clear instructions for order packaging, handling, or courier delivery..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-4 py-2 text-xs font-bold text-white hover:bg-[#b82a28] shadow-sm transition-colors"
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5" />
                      Created!
                    </>
                  ) : (
                    "Save Note"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
