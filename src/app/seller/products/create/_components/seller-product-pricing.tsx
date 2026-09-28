"use client"

import React from "react"
import { DollarSign } from "lucide-react"

export interface ProductPricingProps {
  unitPrice: string
  purchasePrice: string
  currentStock: string
  discount: string
  discountType: "percent" | "amount"
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function SellerProductPricing({
  unitPrice,
  purchasePrice,
  currentStock,
  discount,
  discountType,
  onChange,
}: ProductPricingProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
      <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
        <DollarSign className="w-4 h-4 text-[#d43533]" />
        Pricing & Inventory
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Unit Price (৳) <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="number"
            name="unitPrice"
            value={unitPrice}
            onChange={onChange}
            min="0"
            step="0.01"
            placeholder="e.g. 1299"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Purchase Price (৳)
          </label>
          <input
            type="number"
            name="purchasePrice"
            value={purchasePrice}
            onChange={onChange}
            min="0"
            step="0.01"
            placeholder="Your cost"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Current Stock <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="number"
            name="currentStock"
            value={currentStock}
            onChange={onChange}
            min="0"
            placeholder="Available quantity"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Discount</label>
          <input
            type="number"
            name="discount"
            value={discount}
            onChange={onChange}
            min="0"
            max="100"
            placeholder="0"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Discount Type</label>
          <select
            name="discountType"
            value={discountType}
            onChange={onChange}
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
          >
            <option value="percent">Percentage (%)</option>
            <option value="amount">Flat Amount (৳)</option>
          </select>
        </div>
      </div>
    </div>
  )
}
