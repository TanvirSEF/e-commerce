"use client"

import React from "react"

interface CategoryOption {
  id: string | number
  name: string
  slug?: string
}

interface CreateProductSidebarProps {
  categories?: CategoryOption[]
  selectedCategoryId: string
  setSelectedCategoryId: (v: string) => void
  isPublished: boolean
  setIsPublished: (v: boolean) => void
  isFeatured: boolean
  setIsFeatured: (v: boolean) => void
  isAvailable: boolean
  setIsAvailable: (v: boolean) => void
  availableDate: string
  setAvailableDate: (v: string) => void
  isRefundable: boolean
  setIsRefundable: (v: boolean) => void
  shippingType: "free" | "flat"
  setShippingType: (v: "free" | "flat") => void
  isCod: boolean
  setIsCod: (v: boolean) => void
}

export function CreateProductSidebar({
  categories = [],
  selectedCategoryId,
  setSelectedCategoryId,
  isPublished,
  setIsPublished,
  isFeatured,
  setIsFeatured,
  isAvailable,
  setIsAvailable,
  availableDate,
  setAvailableDate,
  isRefundable,
  setIsRefundable,
  shippingType,
  setShippingType,
  isCod,
  setIsCod,
}: CreateProductSidebarProps) {
  return (
    <div className="space-y-5">
      {/* Card 1: Product Category */}
      <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb] flex items-center justify-between">
          <h5 className="mb-0 text-sm font-semibold text-gray-800">Product Category</h5>
          <span className="text-[11px] font-medium text-gray-500">Select Main</span>
        </div>
        <div className="card-body p-4">
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {categories.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-2.5 p-1.5 rounded hover:bg-gray-50 cursor-pointer text-xs text-gray-700"
              >
                <input
                  type="radio"
                  name="product_category"
                  value={String(c.id)}
                  checked={selectedCategoryId === String(c.id)}
                  onChange={() => setSelectedCategoryId(String(c.id))}
                  className="w-3.5 h-3.5 text-[#d43533] focus:ring-[#d43533]"
                />
                <span className="truncate">{c.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Card 2: Product Settings */}
      <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
          <h5 className="mb-0 text-sm font-semibold text-gray-800">Product Settings</h5>
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

          {/* Available Now */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Available Now</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Available From (Date) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Available From</label>
            <input
              type="date"
              value={availableDate}
              onChange={(e) => setAvailableDate(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
            <p className="text-[11px] text-gray-400">
              Set expected release / launch date for pre-order shipments.
            </p>
          </div>
        </div>
      </div>

      {/* Card 3: Refund */}
      <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
          <h5 className="mb-0 text-sm font-semibold text-gray-800">Refund</h5>
        </div>
        <div className="card-body p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Refundable</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isRefundable}
                onChange={(e) => setIsRefundable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Card 4: Shipping */}
      <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
          <h5 className="mb-0 text-sm font-semibold text-gray-800">Shipping</h5>
        </div>
        <div className="card-body p-4 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
            <input
              type="radio"
              name="shipping_type"
              checked={shippingType === "free"}
              onChange={() => setShippingType("free")}
              className="text-[#d43533] focus:ring-[#d43533]"
            />
            <span>Free Shipping</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
            <input
              type="radio"
              name="shipping_type"
              checked={shippingType === "flat"}
              onChange={() => setShippingType("flat")}
              className="text-[#d43533] focus:ring-[#d43533]"
            />
            <span>Flat Rate</span>
          </label>
        </div>
      </div>

      {/* Card 5: Cash on Delivery */}
      <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
          <h5 className="mb-0 text-sm font-semibold text-gray-800">Cash on Delivery</h5>
        </div>
        <div className="card-body p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Cash on delivery available</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isCod}
                onChange={(e) => setIsCod(e.target.checked)}
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
