"use client"

import React, { useState } from "react"
import { Barcode, Search, PackageX, CheckCircle } from "lucide-react"
import type { PosProductItem } from "@/services/pos-service"
import type { SeedCategory } from "@/db/seed/data"

interface PosProductCatalogProps {
  products: PosProductItem[]
  categories: SeedCategory[]
  onAddToCart: (product: PosProductItem) => void
  onBarcodeScan: (barcode: string) => void
}

export function PosProductCatalog({
  products,
  categories,
  onAddToCart,
  onBarcodeScan,
}: PosProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [search, setSearch] = useState("")
  const [barcodeInput, setBarcodeInput] = useState("")

  const filteredProducts = products.filter((p) => {
    const matchCat = !selectedCategory || p.categorySlug === selectedCategory
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcodeInput.trim()) return
    onBarcodeScan(barcodeInput.trim())
    setBarcodeInput("")
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Top Box */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs space-y-3">
        {/* Barcode Form */}
        <form onSubmit={handleBarcodeSubmit} className="relative">
          <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Scan Barcode / Enter SKU and press Enter..."
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            className="w-full pl-9 pr-24 py-2 text-xs rounded-lg border border-gray-200 focus:border-[#d43533] focus:outline-hidden font-mono"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-md hover:bg-black transition"
          >
            Scan Add
          </button>
        </form>

        {/* Category & Text Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter products by category"
            className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 focus:border-[#d43533] focus:outline-hidden"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search seller products by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 max-h-[580px] overflow-y-auto pr-1">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 space-y-2">
            <PackageX className="w-8 h-8 mx-auto text-gray-300" />
            <div className="text-xs font-semibold">No products found matching criteria</div>
            <div className="text-[11px] text-gray-400">Try adjusting your category or search term</div>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isOutOfStock = p.currentStock <= 0
            return (
              <div
                key={p.id}
                onClick={() => !isOutOfStock && onAddToCart(p)}
                className={`group rounded-xl border bg-white p-2.5 shadow-2xs transition flex flex-col justify-between ${
                  isOutOfStock
                    ? "opacity-60 cursor-not-allowed border-gray-200"
                    : "cursor-pointer hover:border-[#d43533] hover:shadow-sm"
                }`}
              >
                <div>
                  <div className="relative h-28 w-full rounded-lg bg-gray-50 overflow-hidden mb-2">
                    <img
                      src={p.thumbnailImg}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 right-1.5">
                      {isOutOfStock ? (
                        <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                          Stock: {p.currentStock}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="font-semibold text-xs text-gray-800 line-clamp-2 leading-tight">
                    {p.name}
                  </h4>
                  {p.sku && (
                    <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                      SKU: {p.sku}
                    </div>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-xs text-[#d43533]">
                    ৳{p.unitPrice.toLocaleString("en-BD")}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium group-hover:text-[#d43533]">
                    + Add
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
