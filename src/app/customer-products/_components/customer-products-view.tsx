"use client"

import React, { useState } from "react"
import Link from "next/link"
import { CustomerProductsSidebar } from "./customer-products-sidebar"
import { CustomerProductsToolbar } from "./customer-products-toolbar"
import { CustomerProductCard } from "./customer-product-card"
import type { ClassifiedProductItem } from "@/services/customer-product-service"
import type { CustomerProductCategoryTree } from "@/services/category-service"
import type { SeedBrand } from "@/db/seed/data"

interface CustomerProductsViewProps {
  products: ClassifiedProductItem[]
  total: number
  currentPage: number
  totalPages: number
  categoryTree: CustomerProductCategoryTree
  brands: SeedBrand[]
}

export function CustomerProductsView({
  products = [],
  total,
  currentPage,
  totalPages,
  categoryTree,
  brands = [],
}: CustomerProductsViewProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const selectedCat = categoryTree.selected

  return (
    <div className="bg-gray-50/50 min-h-screen py-6">
      <div className="max-w-[1240px] mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column: Sidebar Filters (3 cols on xl) */}
          <div className="xl:col-span-3">
            <CustomerProductsSidebar
              categoryTree={categoryTree}
              isOpenMobile={mobileSidebarOpen}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>

          {/* Right Column: Contents (9 cols on xl) */}
          <div className="xl:col-span-9">
            {/* Breadcrumb */}
            <ul className="flex items-center flex-wrap gap-1.5 text-xs text-gray-500 mb-4">
              <li>
                <Link href="/" className="hover:text-[#d43533] transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              {!selectedCat ? (
                <li className="text-gray-900 font-semibold">&quot;All Categories&quot;</li>
              ) : (
                <>
                  <li>
                    <Link
                      href="/customer-products"
                      className="hover:text-[#d43533] transition-colors"
                    >
                      All Categories
                    </Link>
                  </li>
                  <li>/</li>
                  <li className="text-gray-900 font-semibold">&quot;{selectedCat.name}&quot;</li>
                </>
              )}
            </ul>

            {/* Top Toolbar Filters */}
            <CustomerProductsToolbar
              brands={brands}
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            />

            {/* Products Grid (Table-Border Grid: border-t border-l) */}
            {products.length === 0 ? (
              <div className="bg-white border border-gray-200 p-12 text-center text-gray-500">
                <p className="text-sm font-semibold">No classified advertisements found.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try adjusting or clearing your filters.
                </p>
              </div>
            ) : (
              <div className="border-t border-l border-gray-200 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                  {products.map((item) => (
                    <CustomerProductCard key={item.id} product={item} />
                  ))}
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-8">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1
                  const isActive = pNum === currentPage
                  return (
                    <Link
                      key={pNum}
                      href={`/customer-products?page=${pNum}`}
                      className={`w-8 h-8 flex items-center justify-center text-xs font-semibold border transition-colors ${
                        isActive
                          ? "bg-[#d43533] text-white border-[#d43533]"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {pNum}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
