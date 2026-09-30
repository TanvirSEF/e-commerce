"use client"

import React from "react"
import { Search } from "lucide-react"

interface ReviewsFilterBarProps {
  sellers: { id: string; name: string }[]
  sellerId: string
  onSellerChange: (id: string) => void
  ratingSort: string
  onRatingSortChange: (sort: string) => void
  search: string
  onSearchChange: (search: string) => void
}

export function ReviewsFilterBar({
  sellers,
  sellerId,
  onSellerChange,
  ratingSort,
  onRatingSortChange,
  search,
  onSearchChange,
}: ReviewsFilterBarProps) {
  return (
    <div className="p-4 border-b border-slate-100 bg-slate-50/40">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Card Title */}
        <h5 className="text-sm font-bold text-slate-800 tracking-tight whitespace-nowrap">
          Product Review &amp; Ratings
        </h5>

        {/* Filters Group */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
          {/* Seller Dropdown */}
          <div className="w-full sm:w-44">
            <select
              value={sellerId}
              onChange={(e) => onSellerChange(e.target.value)}
              className="w-full h-8 px-2.5 text-xs font-normal text-slate-700 bg-white border border-slate-200 rounded focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="all">All</option>
              <option value="inhouse">In House</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Dropdown */}
          <div className="w-full sm:w-44">
            <select
              value={ratingSort}
              onChange={(e) => onRatingSortChange(e.target.value)}
              className="w-full h-8 px-2.5 text-xs font-normal text-slate-700 bg-white border border-slate-200 rounded focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="">Filter by Rating</option>
              <option value="desc">Rating (High &gt; Low)</option>
              <option value="asc">Rating (Low &gt; High)</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Type Product Name & Hit Enter"
              className="w-full h-8 pl-3 pr-8 text-xs font-normal text-slate-700 bg-white border border-slate-200 rounded focus:outline-none focus:border-blue-600 placeholder:text-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
