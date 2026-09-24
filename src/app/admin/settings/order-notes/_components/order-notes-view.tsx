"use client"

import React, { useState, useTransition } from "react"
import {
  StickyNote,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldCheck,
  Search,
} from "lucide-react"
import {
  createOrderNoteAction,
  deleteOrderNoteAction,
} from "@/app/actions/ecommerce-actions"
import type { OrderNote } from "@/db/schema"

interface OrderNotesViewProps {
  initialNotes: OrderNote[]
}

export function OrderNotesView({ initialNotes }: OrderNotesViewProps) {
  const [notes, setNotes] = useState<OrderNote[]>(initialNotes)
  const [search, setSearch] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  // New Note State
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState<string>("shipping")

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) {
      setFeedback({ type: "error", text: "Title and content are required" })
      return
    }

    startTransition(async () => {
      const created = await createOrderNoteAction({ title, content, type })
      if (created) {
        setNotes((prev) => [created, ...prev])
        setTitle("")
        setContent("")
        setFeedback({ type: "success", text: "Pre-set order note created successfully!" })
      } else {
        setFeedback({ type: "error", text: "Failed to create order note" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this preset order note?")) return
    startTransition(async () => {
      const success = await deleteOrderNoteAction(id)
      if (success) {
        setNotes((prev) => prev.filter((n) => n.id !== id))
        setFeedback({ type: "success", text: "Order note removed" })
      } else {
        setFeedback({ type: "error", text: "Failed to delete order note" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <StickyNote className="h-6 w-6 text-[#d43533]" />
          Pre-Set Order Notes & Instructions
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Create predefined shipping labels, warehouse handling notices, and customer delivery disclaimers
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: 7 cols List */}
        <div className="lg:col-span-7 rounded-xl border border-gray-200 bg-white shadow-xs">
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">
              Configured Notes ({filteredNotes.length})
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#d43533]"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No preset order notes found.
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 hover:bg-gray-50/50 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">{note.title}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 uppercase tracking-wide">
                        {note.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-md">
                      {note.content}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(note.id)}
                    disabled={isPending}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition shrink-0"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: 5 cols Form */}
        <div className="lg:col-span-5 rounded-xl border border-gray-200 bg-white p-5 shadow-xs h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Tag className="w-4 h-4 text-[#d43533]" />
            <h2 className="text-sm font-bold text-gray-900">Add Pre-Set Note</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Note Heading / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Fragile Glassware Packaging"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Note Scope / Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-hidden"
              >
                <option value="shipping">Shipping & Handling</option>
                <option value="fulfillment">Warehouse Fulfillment</option>
                <option value="customer">Customer Facing</option>
                <option value="internal">Internal Billing</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Instructions / Content <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Type detailed note or handling instructions..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#d43533] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition"
              >
                <Plus className="w-4 h-4" />
                {isPending ? "Creating..." : "Save Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
