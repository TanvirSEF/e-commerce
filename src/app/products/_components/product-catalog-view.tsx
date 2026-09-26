"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronRight, PackageOpen } from "lucide-react"
import { ProductCard, type ProductCardProps } from "@/components/product/product-card"
import { ProductFilterSidebar, type FilterState } from "./product-filter-sidebar"
import { ProductSortBar } from "./product-sort-bar"

interface ProductCatalogViewProps {
  initialProducts: (ProductCardProps & {
    categorySlug: string
    brandSlug?: string
    colorName?: string
  })[]
  initialCategory?: string
  initialBrand?: string
  initialKeyword?: string
}

export function ProductCatalogView({
  initialProducts,
  initialCategory = "",
  initialBrand = "",
  initialKeyword = "",
}: ProductCatalogViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    minPrice: "",
    maxPrice: "",
    brand: initialBrand,
    color: "",
    rating: 0,
  })

  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      // Keyword
      if (
        initialKeyword &&
        !p.name.toLowerCase().includes(initialKeyword.toLowerCase())
      ) {
        return false
      }
      // Category
      if (filters.category && p.categorySlug !== filters.category) {
        return false
      }
      // Min Price
      if (filters.minPrice && p.price < Number(filters.minPrice)) {
        return false
      }
      // Max Price
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) {
        return false
      }
      // Brand
      if (filters.brand && p.brandSlug !== filters.brand) {
        return false
      }
      // Color
      if (filters.color && p.colorName !== filters.color) {
        return false
      }
      // Rating
      if (filters.rating > 0 && (p.rating || 0) < filters.rating) {
        return false
      }
      return true
    })
  }, [initialProducts, initialKeyword, filters])

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]
    if (sortBy === "price_asc") {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === "popular") {
      list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    }
    return list
  }, [filteredProducts, sortBy])

  const totalPages = Math.ceil(sortedProducts.length / pageSize) || 1
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleClearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      brand: "",
      color: "",
      rating: 0,
    })
    setCurrentPage(1)
  }

  return (
    <div className="bg-gray-50/40 py-5">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#d43533]">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/products" className="hover:text-[#d43533]">
            All Products
          </Link>
          {filters.category && (
            <>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <span className="font-semibold text-gray-800 capitalize">
                {filters.category.replace(/-/g, " ")}
              </span>
            </>
          )}
          {initialKeyword && (
            <>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <span className="font-semibold text-gray-800">
                Search: &quot;{initialKeyword}&quot;
              </span>
            </>
          )}
        </nav>

        {/* Main Content: Sidebar + Products */}
        <div className="flex items-start gap-6">
          {/* Filter Sidebar */}
          <ProductFilterSidebar
            filters={filters}
            onFilterChange={(newFilters) => {
              setFilters(newFilters)
              setCurrentPage(1)
            }}
            onClearFilters={handleClearFilters}
            isMobileOpen={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
          />

          {/* Catalog Products Area */}
          <div className="min-w-0 flex-1">
            <ProductSortBar
              totalCount={sortedProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onToggleMobileFilter={() => setMobileFilterOpen(true)}
            />

            {/* Empty State */}
            {paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-md border border-gray-100 bg-white py-16 text-center">
                <PackageOpen className="h-12 w-12 text-gray-300" />
                <h3 className="mt-3 text-base font-bold text-gray-800">
                  No products found
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Try adjusting your filter criteria or search keyword.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-4 rounded bg-[#d43533] px-4 py-2 text-xs font-semibold text-white hover:bg-[#9d1b1a]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4"
                      : "flex flex-col gap-3"
                  }
                >
                  {paginatedProducts.map((p) => (
                    <ProductCard key={p.id} {...p} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentPage(i + 1)}
                        className={`h-8 w-8 rounded text-xs font-bold transition-colors ${
                          currentPage === i + 1
                            ? "bg-[#d43533] text-white"
                            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCatalogView
