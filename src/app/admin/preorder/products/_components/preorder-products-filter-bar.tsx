"use client"

import React, { useState } from "react"
import { ChevronDown, Trash2 } from "lucide-react"

interface PreorderProductsFilterBarProps {
  userType: string
  statusFilter: string
  sortPrice: string
  search: string
  selectedCount: number
  counts?: {
    all?: number
    inHouse?: number
    seller?: number
    published?: number
    unpublished?: number
    discounted?: number
  }
  onUserTypeChange: (val: string) => void
  onStatusFilterChange: (val: string) => void
  onSortChange: (val: string) => void
  onSearchChange: (val: string) => void
  onTriggerBulkDelete: () => void
}

export function PreorderProductsFilterBar({
  userType,
  statusFilter,
  sortPrice,
  search,
  selectedCount,
  counts = { all: 0, inHouse: 0, seller: 0, published: 0, unpublished: 0, discounted: 0 },
  onUserTypeChange,
  onStatusFilterChange,
  onSortChange,
  onSearchChange,
  onTriggerBulkDelete,
}: PreorderProductsFilterBarProps) {
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false)

  return (
    <div className="card-header p-4 border-b border-slate-200 bg-white space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h5 className="font-semibold text-slate-700 text-sm mb-0">All Preorder Products</h5>
      </div>

      {/* Badges Bar (Active eCommerce 1:1) */}
      <div className="flex flex-wrap items-center gap-3">
        {/* User Type Group */}
        <div className="inline-flex bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => onUserTypeChange("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              userType === "all"
                ? "bg-slate-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onUserTypeChange("in_house")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              userType === "in_house"
                ? "bg-slate-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            In-house ({counts?.inHouse ?? 0})
          </button>
          <button
            type="button"
            onClick={() => onUserTypeChange("seller")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              userType === "seller"
                ? "bg-slate-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Seller&apos;s ({counts?.seller ?? 0})
          </button>
        </div>

        {/* Dashed Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onStatusFilterChange(statusFilter === "published" ? "all" : "published")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border border-dashed transition-all ${
              statusFilter === "published"
                ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                : "border-slate-300 text-slate-600 hover:border-slate-400 bg-white"
            }`}
          >
            Published ({counts?.published ?? 0})
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange(statusFilter === "unpublished" ? "all" : "unpublished")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border border-dashed transition-all ${
              statusFilter === "unpublished"
                ? "bg-amber-50 border-amber-500 text-amber-700"
                : "border-slate-300 text-slate-600 hover:border-slate-400 bg-white"
            }`}
          >
            Unpublished ({counts?.unpublished ?? 0})
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange(statusFilter === "discounted" ? "all" : "discounted")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border border-dashed transition-all ${
              statusFilter === "discounted"
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "border-slate-300 text-slate-600 hover:border-slate-400 bg-white"
            }`}
          >
            Discounted ({counts?.discounted ?? 0})
          </button>
        </div>
      </div>

      {/* Action Row: Bulk Action + Filter By + Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
        {/* Bulk Action Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setBulkMenuOpen(!bulkMenuOpen)}
            className="w-full sm:w-auto inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <span>Bulk Action {selectedCount > 0 ? `(${selectedCount})` : ""}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {bulkMenuOpen && (
            <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 rounded-md shadow-lg z-20 py-1 text-xs">
              <button
                type="button"
                disabled={selectedCount === 0}
                onClick={() => {
                  setBulkMenuOpen(false)
                  onTriggerBulkDelete()
                }}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete selection</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter by Price */}
        <div className="w-full sm:w-56">
          <select
            value={sortPrice}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:border-[#d43533]"
          >
            <option value="">Filter by</option>
            <option value="unit_price,desc">Base Price (High &gt; Low)</option>
            <option value="unit_price,asc">Base Price (Low &gt; High)</option>
          </select>
        </div>

        {/* Search bar */}
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Products"
            className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#d43533]"
          />
          <button
            type="button"
            className="px-4 py-1.5 rounded text-xs font-bold bg-[#e8f0fe] text-[#1a73e8] hover:bg-[#d2e3fc] transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  )
}
