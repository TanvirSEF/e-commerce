"use client"

import React from "react"
import { Search } from "lucide-react"

interface AdminProductsFilterBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  selectedSeller: string
  onSellerChange: (value: string) => void
  selectedSort: string
  onSortChange: (value: string) => void
  categories: { id: number | string; name: string; slug: string }[]
  totalResults: number
}

export function AdminProductsFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSeller,
  onSellerChange,
  selectedSort,
  onSortChange,
  categories,
  totalResults,
}: AdminProductsFilterBarProps) {
  return (
    <div>
      {/* Product Type Tabs (Active eCommerce 1:1) */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-4 rounded-t-lg shadow-2xs">
        <button
          type="button"
          onClick={() => onSellerChange("all")}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            selectedSeller === "all"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          All Products
        </button>
        <button
          type="button"
          onClick={() => onSellerChange("inhouse")}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            selectedSeller === "inhouse"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          In House Products
        </button>
        <button
          type="button"
          onClick={() => onSellerChange("sellers")}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            selectedSeller === "sellers"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Seller Products
        </button>
      </div>

      {/* 1:1 Active eCommerce Filter Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-b-lg shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Type name & Enter..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 focus:outline-hidden focus:border-[#d43533]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Dynamic Categories */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:border-[#d43533]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Seller / Added By */}
          <select
            value={selectedSeller}
            onChange={(e) => onSellerChange(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:border-[#d43533]"
          >
            <option value="all">All Sellers</option>
            <option value="inhouse">Inhouse (Admin)</option>
            <option value="sellers">Vendor Sellers</option>
          </select>

          {/* Sort By */}
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden focus:border-[#d43533]"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="sales">Most Sold</option>
            <option value="stock">High Stock</option>
          </select>

          <span className="text-slate-500 font-medium pl-1">
            Total: <strong>{totalResults}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
