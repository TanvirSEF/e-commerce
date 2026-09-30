"use client"

import React, { useState } from "react"
import { Search, ChevronDown, Trash2 } from "lucide-react"

interface PromotionalFilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  sortType: string
  onSortChange: (val: string) => void
  selectedFilters: string[]
  onFilterToggle: (filterName: string) => void
  selectedCount: number
  onBulkRemoveClick: () => void
}

export function PromotionalFilterBar({
  search,
  onSearchChange,
  sortType,
  onSortChange,
  selectedFilters,
  onFilterToggle,
  selectedCount,
  onBulkRemoveClick,
}: PromotionalFilterBarProps) {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [bulkDropdownOpen, setBulkDropdownOpen] = useState(false)

  return (
    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products…"
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-600 font-medium text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Bulk Action Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setBulkDropdownOpen(!bulkDropdownOpen)}
            className="h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Bulk Action {selectedCount > 0 ? `(${selectedCount})` : ""}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {bulkDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setBulkDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-20 py-1">
                <button
                  type="button"
                  onClick={() => {
                    setBulkDropdownOpen(false)
                    onBulkRemoveClick()
                  }}
                  className="flex items-center w-full px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove From Promotional</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            className="h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Filter</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {filterDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setFilterDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-20 py-2 px-3 space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-blue-600">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes("all")}
                    onChange={() => onFilterToggle("all")}
                    className="rounded text-blue-600 border-slate-300 w-3.5 h-3.5"
                  />
                  <span>All</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-blue-600">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes("all-discount")}
                    onChange={() => onFilterToggle("all-discount")}
                    className="rounded text-blue-600 border-slate-300 w-3.5 h-3.5"
                  />
                  <span>All Discounted</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-blue-600">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes("low-stock")}
                    onChange={() => onFilterToggle("low-stock")}
                    className="rounded text-blue-600 border-slate-300 w-3.5 h-3.5"
                  />
                  <span>Low Stock</span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Sort Select */}
        <div className="w-full md:w-48">
          <select
            value={sortType}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="">Sort</option>
            <option value="rating,desc">Rating (High &gt; Low)</option>
            <option value="rating,asc">Rating (Low &gt; High)</option>
            <option value="unit_price,desc">Base Price (High &gt; Low)</option>
            <option value="unit_price,asc">Base Price (Low &gt; High)</option>
          </select>
        </div>
      </div>
    </div>
  )
}
