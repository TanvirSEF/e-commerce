"use client"

import React from "react"
import { Package } from "lucide-react"
import type { SeedCategory, SeedBrand } from "@/db/seed/data"

export interface ProductBasicInfoProps {
  categories: SeedCategory[]
  brands: SeedBrand[]
  name: string
  sku: string
  unit: string
  categoryId: string
  brandId: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function SellerProductBasicInfo({
  categories,
  brands,
  name,
  sku,
  unit,
  categoryId,
  brandId,
  onChange,
}: ProductBasicInfoProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
      <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
        <Package className="w-4 h-4 text-[#d43533]" />
        Basic Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="e.g. Premium Cotton T-Shirt"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">SKU</label>
          <input
            type="text"
            name="sku"
            value={sku}
            onChange={onChange}
            placeholder="e.g. TSHT-RED-L-001"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
          <select
            name="unit"
            value={unit}
            onChange={onChange}
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
          >
            <option value="pc">Piece (pc)</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="litre">Litre</option>
            <option value="pair">Pair</option>
            <option value="set">Set</option>
            <option value="box">Box</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Category
          </label>
          <select
            name="categoryId"
            value={categoryId}
            onChange={onChange}
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Brand</label>
          <select
            name="brandId"
            value={brandId}
            onChange={onChange}
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
