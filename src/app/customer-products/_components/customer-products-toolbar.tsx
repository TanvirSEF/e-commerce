"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter } from "lucide-react"
import type { SeedBrand } from "@/db/seed/data"

interface CustomerProductsToolbarProps {
  brands: SeedBrand[]
  onOpenMobileSidebar?: () => void
}

export function CustomerProductsToolbar({
  brands = [],
  onOpenMobileSidebar,
}: CustomerProductsToolbarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get("sort_by") || ""
  const currentCondition = searchParams.get("condition") || ""
  const currentBrand = searchParams.get("brand") || ""

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page") // Reset to page 1 on filter change
    router.push(`/customer-products?${params.toString()}`)
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Sort by */}
        <div className="w-[160px] sm:w-[180px]">
          <select
            value={currentSort}
            onChange={(e) => updateFilter("sort_by", e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-none px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-[#d43533]"
          >
            <option value="">Sort by</option>
            <option value="1">Newest</option>
            <option value="2">Oldest</option>
            <option value="3">Price low to high</option>
            <option value="4">Price high to low</option>
          </select>
        </div>

        {/* Type / Condition */}
        <div className="w-[140px] sm:w-[160px] hidden sm:block sm:ml-auto">
          <select
            value={currentCondition}
            onChange={(e) => updateFilter("condition", e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-none px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-[#d43533]"
          >
            <option value="">Type</option>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </div>

        {/* Brands */}
        <div className="w-[140px] sm:w-[160px] hidden sm:block">
          <select
            value={currentBrand}
            onChange={(e) => updateFilter("brand", e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-none px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-[#d43533]"
          >
            <option value="">Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Filter Button */}
        <div className="xl:hidden ml-auto">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="p-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Filter className="w-4 h-4 text-[#d43533]" />
            <span>Filters</span>
          </button>
        </div>
      </div>
    </div>
  )
}
