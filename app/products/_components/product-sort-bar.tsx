"use client"

import React from "react"
import { Grid, List, ChevronDown } from "lucide-react"

interface ProductSortBarProps {
  totalCount: number
  sortBy: string
  onSortChange: (sort: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  onToggleMobileFilter: () => void
}

const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Best Selling", value: "popular" },
]

export function ProductSortBar({
  totalCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onToggleMobileFilter,
}: ProductSortBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-gray-100 bg-white p-3 shadow-sm">
      {/* Left: Total Found Count & Mobile Filter Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileFilter}
          className="flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#d43533] hover:text-[#d43533] xl:hidden"
        >
          <span>Filters</span>
        </button>
        <span className="text-xs text-gray-500">
          Showing <span className="font-bold text-gray-800">{totalCount}</span> Products
        </span>
      </div>

      {/* Right: Sort By Dropdown & View Mode */}
      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <div className="relative flex items-center gap-2">
          <span className="hidden text-xs text-gray-500 sm:inline">Sort By:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-8 appearance-none rounded border border-gray-200 bg-white pr-7 pl-3 text-xs font-medium text-gray-700 transition-colors focus:border-[#d43533] focus:outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Grid / List View Toggle */}
        <div className="hidden items-center rounded border border-gray-200 p-0.5 sm:flex">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`rounded p-1 text-gray-500 transition-colors ${
              viewMode === "grid" ? "bg-red-50 text-[#d43533]" : "hover:text-gray-900"
            }`}
            title="Grid View"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`rounded p-1 text-gray-500 transition-colors ${
              viewMode === "list" ? "bg-red-50 text-[#d43533]" : "hover:text-gray-900"
            }`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductSortBar
