"use client"

import React, { useState, useEffect } from "react"
import { X, Star, RotateCcw } from "lucide-react"
import { CategoryTreeItem } from "./category-tree-item"
import type { CatalogFilterCategory } from "@/services/product-service"

export interface FilterState {
  category: string
  minPrice: string
  maxPrice: string
  brand: string
  color: string
  rating: number
}

export type FilterCategoryItem = CatalogFilterCategory

export interface FilterBrandItem {
  id?: number
  name: string
  slug: string
  count: number
}

export interface FilterColorItem {
  id?: number
  name: string
  hex: string
}

interface ProductFilterSidebarProps {
  filters: FilterState
  onFilterChange: (newFilters: FilterState) => void
  onClearFilters: () => void
  isMobileOpen: boolean
  onCloseMobile: () => void
  categories?: FilterCategoryItem[]
  brands?: FilterBrandItem[]
  colors?: FilterColorItem[]
  totalProductCount?: number
}

export function ProductFilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  isMobileOpen,
  onCloseMobile,
  categories = [],
  brands = [],
  colors = [],
  totalProductCount = 0,
}: ProductFilterSidebarProps) {
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice)
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice)

  useEffect(() => {
    setMinPriceInput(filters.minPrice)
    setMaxPriceInput(filters.maxPrice)
  }, [filters.minPrice, filters.maxPrice])

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({
      ...filters,
      minPrice: minPriceInput,
      maxPrice: maxPriceInput,
    })
  }

  const sidebarContent = (
    <div className="flex flex-col gap-5 p-4 text-xs">
      {/* Header: Title & Clear */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-sm font-bold text-gray-900">Filters</h3>
        <button
          type="button"
          onClick={() => {
            setMinPriceInput("")
            setMaxPriceInput("")
            onClearFilters()
          }}
          className="flex items-center gap-1 text-[11px] font-semibold text-[#d43533] hover:underline"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Category Facet with Expandable Subcategories */}
      <div className="border-b border-gray-100 pb-4">
        <h4 className="mb-2.5 font-bold text-gray-800 uppercase">Categories</h4>
        <div className="flex max-h-[380px] flex-col gap-1 overflow-y-auto pr-1">
          {/* All Categories Option */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, category: "" })}
            className={`flex items-center justify-between rounded px-2 py-1 text-left text-xs transition-colors ${
              !filters.category
                ? "bg-red-50 font-bold text-[#d43533]"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="truncate pr-1">All Categories</span>
            <span className="text-[10px] text-gray-400 shrink-0">({totalProductCount})</span>
          </button>

          {/* Expandable Category Tree */}
          {categories.map((cat) => (
            <CategoryTreeItem
              key={cat.slug}
              category={cat}
              activeCategory={filters.category}
              onSelectCategory={(slug) => onFilterChange({ ...filters, category: slug })}
            />
          ))}
        </div>
      </div>

      {/* 2. Price Range Facet */}
      <div className="border-b border-gray-100 pb-4">
        <h4 className="mb-2.5 font-bold text-gray-800 uppercase">Price Range</h4>
        <form onSubmit={handlePriceApply} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min ৳"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="h-8 w-full rounded border border-gray-200 px-2 text-xs focus:border-[#d43533] focus:outline-none"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max ৳"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="h-8 w-full rounded border border-gray-200 px-2 text-xs focus:border-[#d43533] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-[#292933] py-1.5 font-semibold text-white transition-colors hover:bg-black"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* 3. Brands Facet */}
      {brands.length > 0 && (
        <div className="border-b border-gray-100 pb-4">
          <h4 className="mb-2.5 font-bold text-gray-800 uppercase">Brands</h4>
          <div className="flex max-h-52 flex-col gap-2 overflow-y-auto pr-1">
            {brands.map((b) => (
              <label
                key={b.slug}
                className="flex cursor-pointer items-center justify-between text-gray-600 hover:text-gray-900"
              >
                <div className="flex items-center gap-2 truncate pr-1">
                  <input
                    type="radio"
                    name="brand_filter"
                    checked={filters.brand === b.slug}
                    onChange={() =>
                      onFilterChange({
                        ...filters,
                        brand: filters.brand === b.slug ? "" : b.slug,
                      })
                    }
                    className="accent-[#d43533]"
                  />
                  <span className="truncate">{b.name}</span>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">({b.count})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 4. Color Facet */}
      {colors.length > 0 && (
        <div className="border-b border-gray-100 pb-4">
          <h4 className="mb-2.5 font-bold text-gray-800 uppercase">Color</h4>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    color: filters.color === c.name ? "" : c.name,
                  })
                }
                title={c.name}
                style={{ backgroundColor: c.hex }}
                className={`h-6 w-6 rounded-full border border-gray-300 transition-transform ${
                  filters.color === c.name
                    ? "scale-125 ring-2 ring-[#d43533] ring-offset-1"
                    : "hover:scale-110"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. Rating Filter */}
      <div>
        <h4 className="mb-2.5 font-bold text-gray-800 uppercase">Rating</h4>
        <div className="flex flex-col gap-1.5">
          {[5, 4, 3].map((stars) => (
            <button
              key={stars}
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  rating: filters.rating === stars ? 0 : stars,
                })
              }
              className={`flex items-center gap-1.5 rounded px-2 py-1 text-left ${
                filters.rating === stars ? "bg-red-50 font-bold" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center text-[#ffc519]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < stars ? "fill-[#ffc519]" : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-500">& above</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden w-[260px] shrink-0 xl:block">
        <div className="sticky top-20 rounded-md border border-gray-100 bg-white shadow-sm">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Slide-Out Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden xl:hidden">
          <div
            onClick={onCloseMobile}
            className="absolute inset-0 bg-black/50 transition-opacity"
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 flex max-w-full pr-10">
            <div className="flex w-screen max-w-xs flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-900">Filters</h3>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductFilterSidebar
