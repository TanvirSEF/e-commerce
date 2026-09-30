"use client"

import React from "react"
import Link from "next/link"
import { Eye, Frown, ChevronLeft, ChevronRight } from "lucide-react"
import type { ProductQueryItem } from "@/services/product-query-service"

interface ProductQueriesTableProps {
  queries: ProductQueryItem[]
  totalCount: number
  currentPage: number
  totalPages: number
  perPage: number
  onPageChange: (page: number) => void
}

export function ProductQueriesTable({
  queries,
  totalCount,
  currentPage,
  totalPages,
  perPage,
  onPageChange,
}: ProductQueriesTableProps) {
  return (
    <div className="overflow-x-auto min-h-[350px]">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-slate-200 bg-white">
          <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-3 px-4 w-12 text-slate-400">#</th>
            <th className="py-3 px-3 min-w-[140px]">User Name</th>
            <th className="py-3 px-3 min-w-[180px]">Product Name</th>
            <th className="py-3 px-3 min-w-[220px]">Question</th>
            <th className="py-3 px-3 min-w-[220px]">Reply</th>
            <th className="py-3 px-3 min-w-[110px]">status</th>
            <th className="py-3 px-4 w-20 text-right">Options</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white text-xs text-slate-700">
          {queries.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center">
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Frown className="w-12 h-12 text-slate-300 mb-2 stroke-[1.5]" />
                  <h4 className="text-base font-semibold text-slate-600">Nothing found</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    No product customer queries found.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            queries.map((item, idx) => {
              const rowNumber = (currentPage - 1) * perPage + idx + 1
              const isReplied = Boolean(item.reply && item.reply.trim())

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* # */}
                  <td className="py-3.5 px-4 align-middle text-slate-400 font-medium">
                    {rowNumber}
                  </td>

                  {/* User Name */}
                  <td className="py-3.5 px-3 align-middle font-medium text-slate-800">
                    {item.userName || "Customer Not Found"}
                  </td>

                  {/* Product Name */}
                  <td className="py-3.5 px-3 align-middle font-medium text-slate-700">
                    <span className="line-clamp-2 leading-snug">
                      {item.productName || "Product Not Found"}
                    </span>
                  </td>

                  {/* Question */}
                  <td className="py-3.5 px-3 align-middle text-slate-600 leading-snug">
                    <span className="line-clamp-2">
                      {item.question}
                    </span>
                  </td>

                  {/* Reply */}
                  <td className="py-3.5 px-3 align-middle text-slate-500 leading-snug">
                    {isReplied ? (
                      <span className="line-clamp-2">{item.reply}</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3 align-middle">
                    {isReplied ? (
                      <span className="inline-block px-2 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded">
                        Replied
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded">
                        Not Replied
                      </span>
                    )}
                  </td>

                  {/* Options */}
                  <td className="py-3.5 px-4 align-middle text-right">
                    <Link
                      href={`/admin/product-queries/${item.id}`}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                      title="View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white text-xs text-slate-500">
          <div>
            Showing Page <span className="font-bold text-slate-700">{currentPage}</span> of{" "}
            <span className="font-bold text-slate-700">{totalPages}</span> ({totalCount} items)
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
