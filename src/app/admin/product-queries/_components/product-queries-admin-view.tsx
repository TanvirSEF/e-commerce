"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  HelpCircle,
  Search,
  MessageSquare,
  CheckCircle,
  Clock,
  Trash2,
  Send,
  Eye,
  ExternalLink,
} from "lucide-react"
import {
  replyProductQueryAction,
  deleteProductQueryAction,
} from "@/app/actions/ecommerce-actions"
import type { ProductQueryItem } from "@/services/product-query-service"

interface ProductQueriesAdminViewProps {
  initialQueries: ProductQueryItem[]
}

export function ProductQueriesAdminView({
  initialQueries,
}: ProductQueriesAdminViewProps) {
  const [queries, setQueries] = useState<ProductQueryItem[]>(initialQueries)
  const [search, setSearch] = useState("")
  const [selectedQuery, setSelectedQuery] = useState<ProductQueryItem | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filtered = queries.filter(
    (q) =>
      q.userName.toLowerCase().includes(search.toLowerCase()) ||
      q.productName.toLowerCase().includes(search.toLowerCase()) ||
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      (q.reply && q.reply.toLowerCase().includes(search.toLowerCase()))
  )

  const pendingCount = queries.filter((q) => !q.reply).length
  const repliedCount = queries.filter((q) => !!q.reply).length

  const handleOpenReply = (item: ProductQueryItem) => {
    setSelectedQuery(item)
    setReplyText(item.reply || "")
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedQuery || !replyText.trim()) return

    setIsSubmitting(true)
    try {
      await replyProductQueryAction({
        id: selectedQuery.id,
        reply: replyText.trim(),
        repliedBy: "Super Admin",
      })

      setQueries((prev) =>
        prev.map((q) =>
          q.id === selectedQuery.id
            ? { ...q, reply: replyText.trim(), repliedBy: "Super Admin", status: "approved" }
            : q
        )
      )
      setSelectedQuery(null)
      setReplyText("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer question?")) return
    await deleteProductQueryAction(id)
    setQueries((prev) => prev.filter((q) => q.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#d43533]" />
          Product Queries & Customer Q&A Desk
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review buyer pre-sales questions, provide verified store answers, and publish product FAQs
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Questions</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{queries.length}</div>
        </div>
        <div className="bg-white border border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-amber-600 uppercase">Awaiting Reply</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
        </div>
        <div className="bg-white border border-emerald-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600 uppercase">Answered & Published</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{repliedCount}</div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">All Questions ({queries.length})</h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, product, question..."
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
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Product Name</th>
                <th className="px-5 py-3">Question</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-xs text-slate-400">
                    No product queries found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 text-slate-400 font-medium">{idx + 1}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800 whitespace-nowrap">
                      {item.userName}
                    </td>
                    <td className="px-5 py-3.5 max-w-[200px]">
                      <Link
                        href={`/product/${item.productSlug}`}
                        target="_blank"
                        className="font-medium text-slate-900 hover:text-[#d43533] truncate block"
                      >
                        {item.productName}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 max-w-[260px]">
                      <div className="font-semibold text-slate-800 truncate">{item.question}</div>
                      {item.reply && (
                        <div className="text-[11px] text-emerald-700 mt-0.5 truncate flex items-center gap-1">
                          <span className="font-bold">Reply:</span> {item.reply}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.reply
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.reply ? "Replied" : "Not Replied"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenReply(item)}
                          className="p-1.5 rounded text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="View & Reply"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete Query"
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

      {/* Reply Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#d43533]" />
                Reply to Product Query
              </h3>
              <button
                type="button"
                onClick={() => setSelectedQuery(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendReply} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Product</div>
                <div className="font-bold text-slate-900">{selectedQuery.productName}</div>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded">
                <div className="text-[10px] uppercase font-bold text-amber-700 mb-0.5">
                  Question by {selectedQuery.userName}
                </div>
                <div className="text-slate-800 font-medium">{selectedQuery.question}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Official Answer / Reply <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type clear and accurate response for the customer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedQuery(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? "Publishing..." : "Publish Answer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
