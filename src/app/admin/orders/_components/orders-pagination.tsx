"use client"

import React from "react"

interface OrdersPaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  perPage: number
  currentCount: number
  onPageChange: (page: number) => void
}

export function OrdersPagination({
  currentPage,
  totalPages,
  totalCount,
  perPage,
  currentCount,
  onPageChange,
}: OrdersPaginationProps) {
  if (totalPages <= 1) return null

  const startRecord = currentCount > 0 ? (currentPage - 1) * perPage + 1 : 0
  const endRecord = Math.min(currentPage * perPage, totalCount)

  return (
    <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50/50">
      <div>
        Showing <strong>{startRecord}</strong> to <strong>{endRecord}</strong> of{" "}
        <strong>{totalCount}</strong> entries
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1.5 border border-slate-300 rounded bg-white font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 rounded text-xs font-semibold ${
              currentPage === pageNum
                ? "bg-[#d43533] text-white"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {pageNum}
          </button>
        ))}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1.5 border border-slate-300 rounded bg-white font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
