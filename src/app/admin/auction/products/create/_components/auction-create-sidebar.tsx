"use client"

import React from "react"

interface OptionItem {
  id: string | number
  name: string
  slug?: string
}

interface AuctionCreateSidebarProps {
  categories?: OptionItem[]
  selectedCategoryId: string
  setSelectedCategoryId: (v: string) => void
  brands?: OptionItem[]
  selectedBrandId: string
  setSelectedBrandId: (v: string) => void
  isPublished: boolean
  setIsPublished: (v: boolean) => void
  isFeatured: boolean
  setIsFeatured: (v: boolean) => void
}

export function AuctionCreateSidebar({
  categories = [],
  selectedCategoryId,
  setSelectedCategoryId,
  brands = [],
  selectedBrandId,
  setSelectedBrandId,
  isPublished,
  setIsPublished,
  isFeatured,
  setIsFeatured,
}: AuctionCreateSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Category Card */}
      <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
          <h5 className="mb-0 text-sm font-semibold text-gray-800">Product Category</h5>
        </div>
        <div className="card-body p-4">
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 bg-white focus:outline-hidden"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Brand Card */}
      <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
          <h5 className="mb-0 text-sm font-semibold text-gray-800">Product Brand</h5>
        </div>
        <div className="card-body p-4">
          <select
            value={selectedBrandId}
            onChange={(e) => setSelectedBrandId(e.target.value)}
            className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 bg-white focus:outline-hidden"
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={String(b.id)}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Settings Card */}
      <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
          <h5 className="mb-0 text-sm font-semibold text-gray-800">Auction Settings</h5>
        </div>
        <div className="card-body p-4 space-y-4">
          {/* Published */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Published</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Featured */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Featured</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
