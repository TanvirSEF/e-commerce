"use client"

import React from "react"
import { Search } from "lucide-react"

interface AuctionProductsFilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  onSearchSubmit: () => void
  status: string
  onStatusChange: (val: string) => void
  bulkAction: string
  onBulkActionChange: (val: string) => void
  onBulkActionApply: () => void
  selectedCount: number
}

export function AuctionProductsFilterBar({
  search,
  onSearchChange,
  onSearchSubmit,
  status,
  onStatusChange,
  bulkAction,
  onBulkActionChange,
  onBulkActionApply,
  selectedCount,
}: AuctionProductsFilterBarProps) {
  return (
    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#f8f9fb]">
      {/* Left: Search input */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
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

      {/* Right: Bulk Action & Status Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={bulkAction}
          onChange={(e) => onBulkActionChange(e.target.value)}
          className="px-3 py-1.5 text-xs rounded border border-gray-200 bg-white text-gray-700 focus:outline-hidden"
        >
          <option value="">Bulk Action</option>
          <option value="publish">Publish</option>
          <option value="featured">Mark Featured</option>
          <option value="delete">Delete ({selectedCount})</option>
        </select>
        <button
          type="button"
          onClick={onBulkActionApply}
          disabled={selectedCount === 0 || !bulkAction}
          className="px-3 py-1.5 rounded text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors"
        >
          Apply
        </button>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-1.5 text-xs rounded border border-gray-200 bg-white text-gray-700 focus:outline-hidden"
        >
          <option value="all">Filter: All</option>
          <option value="active">Active Auctions</option>
          <option value="ended">Ended Auctions</option>
          <option value="published">All Published</option>
        </select>
      </div>
    </div>
  )
}
