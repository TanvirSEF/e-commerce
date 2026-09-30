"use client"

import React from "react"
import { Search, X } from "lucide-react"

interface RefundRequestsFilterBarProps {
  search: string
  statusFilter: string
  stats: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  onSearchChange: (val: string) => void
  onStatusChange: (status: string) => void
}

export function RefundRequestsFilterBar({
  search,
  statusFilter,
  stats,
  onSearchChange,
  onStatusChange,
}: RefundRequestsFilterBarProps) {
  return (
    <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
      {/* Status Filter Tabs (Active eCommerce Style) */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onStatusChange("all")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            statusFilter === "all"
              ? "bg-slate-800 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All ({stats.total})
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("pending")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
            statusFilter === "pending"
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          Pending ({stats.pending})
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("approved")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
            statusFilter === "approved"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Approved / Paid ({stats.approved})
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("rejected")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
            statusFilter === "rejected"
              ? "bg-red-600 text-white shadow-sm"
              : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/50"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
          Rejected ({stats.rejected})
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full md:w-80">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search order code, customer, product..."
          className="w-full text-xs pl-8 pr-8 py-1.5 border border-slate-200 rounded-md focus:border-[#d43533] focus:ring-1 focus:ring-[#d43533]/20 focus:outline-none placeholder:text-slate-400"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
