"use client"

import React, { useState } from "react"
import Link from "next/link"
import { HelpCircle, Search, MessageSquare, Send } from "lucide-react"
import { replyProductQueryAction } from "@/app/actions/ecommerce-actions"
import type { ProductQueryItem } from "@/services/product-query-service"

interface SellerQueriesViewProps {
  initialQueries: ProductQueryItem[]
}

export function SellerQueriesView({ initialQueries }: SellerQueriesViewProps) {
  const [queries, setQueries] = useState<ProductQueryItem[]>(initialQueries)
  const [search, setSearch] = useState("")
  const [selectedQuery, setSelectedQuery] = useState<ProductQueryItem | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filtered = queries.filter(
    (q) =>
      q.userName.toLowerCase().includes(search.toLowerCase()) ||
      q.productName.toLowerCase().includes(search.toLowerCase()) ||
      q.question.toLowerCase().includes(search.toLowerCase())
  )

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
        repliedBy: "Merchant Seller",
      })

      setQueries((prev) =>
        prev.map((q) =>
          q.id === selectedQuery.id
            ? { ...q, reply: replyText.trim(), repliedBy: "Merchant Seller", status: "approved" }
            : q
        )
      )
      setSelectedQuery(null)
      setReplyText("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#d43533]" />
          Customer Product Inquiries
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Respond directly to buyer questions about your listed products and specs
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">Questions on Your Products</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
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
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Customer Question</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-xs text-slate-400">
                    No customer questions found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{item.userName}</td>
                    <td className="px-5 py-3.5 max-w-[200px] truncate font-medium text-slate-900">
                      {item.productName}
                    </td>
                    <td className="px-5 py-3.5 max-w-[260px]">
                      <div className="truncate font-semibold text-slate-800">{item.question}</div>
                      {item.reply && (
                        <div className="text-[11px] text-emerald-700 truncate mt-0.5">
                          ✓ {item.reply}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.reply
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.reply ? "Answered" : "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenReply(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28]"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Reply
                      </button>
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
                Reply to Customer Inquiry
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
                <div className="font-bold text-slate-900">{selectedQuery.productName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Buyer: {selectedQuery.userName}</div>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded text-slate-800">
                <span className="font-bold">Question:</span> {selectedQuery.question}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide detailed specs and information..."
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
                  {isSubmitting ? "Submitting..." : "Submit Answer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
