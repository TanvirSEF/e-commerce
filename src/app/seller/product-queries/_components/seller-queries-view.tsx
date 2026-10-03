"use client"

import React, { useState } from "react"
import { Eye, Search } from "lucide-react"
import { SellerQueryReplyModal } from "./seller-query-reply-modal"
import type { SellerProductQueryRow } from "@/services/seller-panel-service"

interface SellerQueriesViewProps {
  initialQueries: SellerProductQueryRow[]
}

export function SellerQueriesView({ initialQueries }: SellerQueriesViewProps) {
  const [queries, setQueries] = useState<SellerProductQueryRow[]>(initialQueries)
  const [search, setSearch] = useState("")
  const [activeQuery, setActiveQuery] = useState<SellerProductQueryRow | null>(null)

  const filteredQueries = queries.filter(
    (q) =>
      q.userName.toLowerCase().includes(search.toLowerCase().trim()) ||
      q.productName.toLowerCase().includes(search.toLowerCase().trim()) ||
      q.question.toLowerCase().includes(search.toLowerCase().trim())
  )

  const handleReplySuccess = (updatedReply: string) => {
    if (!activeQuery) return
    setQueries((prev) =>
      prev.map((q) =>
        q.id === activeQuery.id
          ? { ...q, reply: updatedReply, status: "approved" }
          : q
      )
    )
  }

  return (
    <div className="card bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
      {/* Card Header matching Laravel aiz-table header */}
      <div className="card-header p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <h5 className="mb-0 text-sm font-semibold text-gray-800">Product Queries</h5>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type and hit enter..."
            className="w-full text-xs pl-3 pr-8 py-1.5 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Card Body matching index.blade.php */}
      <div className="card-body p-0">
        {filteredQueries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#f9fafb] text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4 w-1/4">Question</th>
                  <th className="py-3 px-4 w-1/4">Reply</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredQueries.map((query, idx) => (
                  <tr key={query.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 text-center text-gray-400 font-medium">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{query.userName}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium line-clamp-2">
                      {query.productName}
                    </td>
                    <td className="py-3 px-4 text-gray-600 line-clamp-2">{query.question}</td>
                    <td className="py-3 px-4 text-gray-600 line-clamp-2">
                      {query.reply || <span className="text-gray-300 italic">No reply yet</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {query.reply ? (
                        <span className="inline-block px-2 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
                          Replied
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 rounded border border-amber-200">
                          Not Replied
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveQuery(query)}
                        title="View / Reply"
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400 text-xs">
            No product queries found.
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {activeQuery && (
        <SellerQueryReplyModal
          query={activeQuery}
          onClose={() => setActiveQuery(null)}
          onSuccess={handleReplySuccess}
        />
      )}
    </div>
  )
}
