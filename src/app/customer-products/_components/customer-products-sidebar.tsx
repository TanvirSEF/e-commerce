"use client"

import React from "react"
import Link from "next/link"
import { ChevronLeft, X } from "lucide-react"
import type { CustomerProductCategoryTree } from "@/services/category-service"

interface CustomerProductsSidebarProps {
  categoryTree: CustomerProductCategoryTree
  isOpenMobile?: boolean
  onCloseMobile?: () => void
}

export function CustomerProductsSidebar({
  categoryTree,
  isOpenMobile,
  onCloseMobile,
}: CustomerProductsSidebarProps) {
  const { level0, selected, parent, children } = categoryTree

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 xl:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-white p-4 shadow-xl transition-transform duration-300 xl:static xl:z-0 xl:w-full xl:p-0 xl:shadow-none ${
          isOpenMobile ? "translate-x-0" : "translate-x-full xl:translate-x-0"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex xl:hidden items-center justify-between pb-3 border-b border-gray-200 mb-3">
          <h3 className="font-bold text-sm text-gray-900">Filters</h3>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 text-gray-500 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Card */}
        <div className="bg-white border border-gray-200 rounded-none mb-4">
          <div className="text-sm md:text-base font-bold text-gray-900 p-3.5 border-b border-gray-100">
            Categories
          </div>
          <div className="p-3.5">
            <ul className="space-y-3 text-xs md:text-sm">
              {!selected ? (
                // Level 0 root categories
                level0.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/customer-products?category=${cat.slug}`}
                      className="text-gray-700 hover:text-[#d43533] transition-colors block"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                // Hierarchical navigation for selected category
                <>
                  <li>
                    <Link
                      href="/customer-products"
                      className="font-semibold text-gray-800 hover:text-[#d43533] flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      All Categories
                    </Link>
                  </li>

                  {parent && (
                    <li>
                      <Link
                        href={`/customer-products?category=${parent.slug}`}
                        className="font-semibold text-gray-800 hover:text-[#d43533] flex items-center gap-1 transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        {parent.name}
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link
                      href={`/customer-products?category=${selected.slug}`}
                      className="font-bold text-[#d43533] flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      {selected.name}
                    </Link>
                  </li>

                  {children.map((child) => (
                    <li key={child.id} className="pl-4">
                      <Link
                        href={`/customer-products?category=${child.slug}`}
                        className="text-gray-600 hover:text-[#d43533] transition-colors block"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        </div>
      </aside>
    </>
  )
}
