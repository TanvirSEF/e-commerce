"use client"

import React from "react"
import { Search } from "lucide-react"

interface PreorderCounts {
  all: number
  requested: number
  acceptedRequests: number
  prepaymentRequests: number
  confirmedPrepayments: number
  finalPreorders: number
  inShipping: number
  delivered: number
  refund: number
}

interface PreorderOrdersFilterBarProps {
  currentStatus: string
  onStatusChange: (status: string) => void
  counts?: Partial<PreorderCounts>
  search: string
  onSearchChange: (search: string) => void
  onSearchSubmit: () => void
  bulkAction: string
  onBulkActionChange: (action: string) => void
  onBulkActionApply: () => void
  selectedCount: number
}

export function PreorderOrdersFilterBar({
  currentStatus,
  onStatusChange,
  counts,
  search,
  onSearchChange,
  onSearchSubmit,
  bulkAction,
  onBulkActionChange,
  onBulkActionApply,
  selectedCount,
}: PreorderOrdersFilterBarProps) {
  const statusTabs = [
    { id: "all", label: "All", count: counts?.all ?? 0 },
    { id: "requested", label: "Requests", count: counts?.requested ?? 0 },
    { id: "accepted_requests", label: "Accepted Requests", count: counts?.acceptedRequests ?? 0 },
    { id: "prepayment_requests", label: "Prepayment Requests", count: counts?.prepaymentRequests ?? 0 },
    { id: "confirmed_prepayments", label: "Confirmed Prepayments", count: counts?.confirmedPrepayments ?? 0 },
    { id: "final_preorders", label: "Final Preorders", count: counts?.finalPreorders ?? 0 },
    { id: "in_shipping", label: "In Shipping", count: counts?.inShipping ?? 0 },
    { id: "delivered", label: "Delivered", count: counts?.delivered ?? 0 },
    { id: "refund", label: "Refund", count: counts?.refund ?? 0 },
  ]

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce Top Badges */}
      <div className="flex flex-wrap gap-2 items-center">
        {statusTabs.map((tab) => {
          const isActive = currentStatus === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusChange(tab.id)}
              className={`text-xs px-3.5 py-2 rounded-md font-semibold transition-all ${
                isActive
                  ? "bg-[#232733] text-white shadow-xs"
                  : "border border-dashed border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          )
        })}
      </div>

      {/* Filter and Bulk Action row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        {/* Left search */}
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Orders (Code, Customer, Product)"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-gray-200 bg-white focus:border-[#d43533] focus:outline-hidden"
            />
          </div>
          <button
            type="button"
            onClick={onSearchSubmit}
            className="px-3 py-1.5 rounded text-xs font-semibold text-[#d43533] bg-red-50 hover:bg-red-100 transition-colors"
          >
            Filter
          </button>
        </div>

        {/* Right Bulk Action */}
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => onBulkActionChange(e.target.value)}
            className="px-3 py-1.5 text-xs rounded border border-gray-200 bg-white text-gray-700 focus:outline-hidden"
          >
            <option value="">Bulk Action</option>
            <option value="bulk_delete">Bulk Delete ({selectedCount})</option>
          </select>
          <button
            type="button"
            onClick={onBulkActionApply}
            disabled={selectedCount === 0 || !bulkAction}
            className="px-3 py-1.5 rounded text-xs font-semibold text-[#d43533] bg-red-50 hover:bg-red-100 disabled:opacity-40 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
