"use client"

import React from "react"

export interface CategoryOption {
  id: string | number
  name: string
  slug: string
}

export interface BrandOption {
  id: string | number
  name: string
  slug: string
}

interface ProductGeneralInfoProps {
  categories: CategoryOption[]
  brands: BrandOption[]
  name: string
  categoryId: string | number
  brandId: string | number
  unit: string
  sku: string
  weight: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function ProductGeneralInfo({
  categories,
  brands,
  name,
  categoryId,
  brandId,
  unit,
  sku,
  weight,
  onChange,
}: ProductGeneralInfoProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-6 space-y-4">
      <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
        <span>Product Information (Active eCommerce 1:1)</span>
        <span className="text-[11px] font-normal text-slate-400">Required fields marked with *</span>
      </h2>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          value={name}
          onChange={onChange}
          placeholder="e.g. Slim Fit Cotton Formal Shirt"
          className="w-full px-3.5 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            value={categoryId}
            onChange={onChange}
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#d43533]"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
          <select
            name="brandId"
            value={brandId}
            onChange={onChange}
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#d43533]"
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
          <input
            type="text"
            name="unit"
            value={unit}
            onChange={onChange}
            placeholder="e.g. pc, kg, pack"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Base SKU / Barcode</label>
          <input
            type="text"
            name="sku"
            value={sku}
            onChange={onChange}
            placeholder="e.g. PROD-SKU-001"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 font-mono focus:outline-hidden focus:border-[#d43533]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Weight (In Kg)</label>
          <input
            type="number"
            step="0.01"
            name="weight"
            value={weight}
            onChange={onChange}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533]"
          />
        </div>
      </div>
    </div>
  )
}
