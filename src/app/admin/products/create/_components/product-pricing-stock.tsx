"use client"

import React from "react"

interface ProductPricingStockProps {
  unitPrice: string
  purchasePrice: string
  discount: string
  discountType: "percent" | "amount"
  stock: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function ProductPricingStock({
  unitPrice,
  purchasePrice,
  discount,
  discountType,
  stock,
  onChange,
}: ProductPricingStockProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-6 space-y-4">
      <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
        <span>Product Price & Stock</span>
        <span className="text-[11px] font-normal text-slate-400">Inventory & pricing policy</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Unit Price (৳) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="unitPrice"
            required
            min="0"
            step="0.01"
            value={unitPrice}
            onChange={onChange}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 font-mono focus:outline-hidden focus:border-[#d43533]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Purchase Price (৳)</label>
          <input
            type="number"
            name="purchasePrice"
            min="0"
            step="0.01"
            value={purchasePrice}
            onChange={onChange}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 font-mono focus:outline-hidden focus:border-[#d43533]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Discount</label>
          <input
            type="number"
            name="discount"
            min="0"
            step="0.01"
            value={discount}
            onChange={onChange}
            placeholder="0"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 font-mono focus:outline-hidden focus:border-[#d43533]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Discount Type</label>
          <select
            name="discountType"
            value={discountType}
            onChange={onChange}
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#d43533]"
          >
            <option value="percent">Percent (%)</option>
            <option value="amount">Flat (৳)</option>
          </select>
        </div>
      </div>

      <div className="pt-1 max-w-xs">
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Total Stock Quantity <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="stock"
          required
          min="0"
          value={stock}
          onChange={onChange}
          placeholder="e.g. 25"
          className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 font-mono focus:outline-hidden focus:border-[#d43533]"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          For physical products with no variations, this is the main stock count.
        </p>
      </div>
    </div>
  )
}
