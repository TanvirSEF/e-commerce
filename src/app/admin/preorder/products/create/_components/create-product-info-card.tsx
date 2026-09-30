"use client"

import React from "react"

interface BrandOption {
  id: string | number
  name: string
  slug?: string
}

interface CreateProductInfoCardProps {
  name: string
  setName: (v: string) => void
  brandId: string
  setBrandId: (v: string) => void
  brands: BrandOption[]
  unit: string
  setUnit: (v: string) => void
  minQty: number
  setMinQty: (v: number) => void
  tags: string
  setTags: (v: string) => void
  barcode: string
  setBarcode: (v: string) => void
}

export function CreateProductInfoCard({
  name,
  setName,
  brandId,
  setBrandId,
  brands,
  unit,
  setUnit,
  minQty,
  setMinQty,
  tags,
  setTags,
  barcode,
  setBarcode,
}: CreateProductInfoCardProps) {
  return (
    <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
      <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
        <h5 className="mb-0 text-sm font-semibold text-gray-800">Product Information</h5>
      </div>
      <div className="card-body p-4 space-y-4">
        {/* Product Name */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-9 space-y-1">
            <input
              type="text"
              name="product_name"
              required
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden focus:ring-1 focus:ring-[#d43533]"
            />
            <p className="text-[11px] text-gray-400">
              Enter a descriptive name for the product. [e.g. &quot;Wireless Bluetooth Headphones&quot;]
            </p>
          </div>
        </div>

        {/* Brand */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
            Brand <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-9 space-y-1">
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 bg-white focus:border-[#d43533] focus:outline-hidden"
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={String(b.id)}>
                  {b.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400">
              Choose the product&apos;s brand from the list. [e.g. &quot;Sony&quot;]
            </p>
          </div>
        </div>

        {/* Unit */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
            Unit <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-9 space-y-1">
            <input
              type="text"
              required
              placeholder="Unit (e.g. KG, Pc etc)"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
            <p className="text-[11px] text-gray-400">
              Specify the unit of measurement for the product. [e.g. &quot;Piece&quot; or &quot;kg&quot;]
            </p>
          </div>
        </div>

        {/* Minimum Purchase Qty */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
            Minimum Purchase Qty <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-9 space-y-1">
            <input
              type="number"
              min="1"
              step="1"
              required
              value={minQty}
              onChange={(e) => setMinQty(Math.max(1, Number(e.target.value)))}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
            <p className="text-[11px] text-gray-400">
              Set the minimum quantity a customer must buy. [e.g. &quot;1&quot;]
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">Tags</label>
          <div className="md:col-span-9 space-y-1">
            <input
              type="text"
              placeholder="Type keywords separated by comma"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
            <p className="text-[11px] text-gray-400">
              Add keywords to help customers find this product. [e.g. &quot;wireless, headphones, audio&quot;]
            </p>
          </div>
        </div>

        {/* Barcode / SKU */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">Barcode / SKU</label>
          <div className="md:col-span-9 space-y-1">
            <input
              type="text"
              placeholder="e.g. PO-SNY-2026"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs font-mono text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
            <p className="text-[11px] text-gray-400">
              Enter the product’s barcode or SKU for inventory tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
