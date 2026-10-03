"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { CategoryHierarchyItem } from "@/services/category-service"

interface CategoriesViewProps {
  categories: CategoryHierarchyItem[]
}

export function CategoriesView({ categories = [] }: CategoriesViewProps) {
  // Track expanded state for subcategories with > 5 items
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({})

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Breadcrumb Header */}
      <section className="pt-4 mb-4">
        <div className="max-w-[1240px] mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              All Categories
            </h1>
            <ul className="flex items-center justify-center sm:justify-end gap-1.5 text-xs text-gray-500">
              <li>
                <Link href="/" className="hover:text-[#d43533] transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-semibold">&quot;All Categories&quot;</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Category List */}
      <section className="pb-12">
        <div className="max-w-[1240px] mx-auto px-4 space-y-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-none border border-gray-200 overflow-hidden shadow-xs"
            >
              {/* Category Name & Header Banner */}
              <Link
                href={`/products?category=${cat.slug}`}
                className="p-4 flex items-center border-b border-gray-100 hover:bg-gray-50/60 transition-colors group"
              >
                <div className="w-[60px] h-[60px] shrink-0 p-1 border border-gray-200 mr-3 flex items-center justify-center bg-white relative overflow-hidden">
                  <Image
                    src={cat.banner || cat.icon || "/assets/img/placeholder.jpg"}
                    alt={cat.name}
                    width={52}
                    height={52}
                    className="object-contain max-h-full"
                  />
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#d43533] transition-colors">
                  {cat.name}
                </div>
              </Link>

              {/* Subcategories Grid (5-column matching Active eCommerce row-cols-xl-5) */}
              <div className="px-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                  {cat.children && cat.children.length > 0 ? (
                    cat.children.map((sub) => {
                      const itemKey = `${cat.id}-${sub.id}`
                      const isExpanded = !!expandedKeys[itemKey]
                      const totalChildren = sub.children?.length || 0
                      const hasMore = totalChildren > 5
                      const visibleChildren = isExpanded
                        ? sub.children
                        : sub.children?.slice(0, 5)

                      return (
                        <div key={sub.id} className="text-left">
                          {/* Sub Category Name */}
                          <h6 className="mb-2.5">
                            <Link
                              href={`/products?category=${sub.slug}`}
                              className="font-bold text-sm text-gray-900 hover:text-[#d43533] transition-colors block"
                            >
                              {sub.name}
                            </Link>
                          </h6>

                          {/* Sub-sub Categories List */}
                          {visibleChildren && visibleChildren.length > 0 && (
                            <ul className="space-y-1.5 mb-2">
                              {visibleChildren.map((second) => (
                                <li key={second.id}>
                                  <Link
                                    href={`/products?category=${second.slug}`}
                                    className="text-xs text-gray-600 hover:text-[#d43533] hover:underline transition-colors block py-0.5"
                                  >
                                    {second.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* More / Less Toggle */}
                          {hasMore && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(itemKey)}
                              className="text-xs font-bold text-[#d43533] hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                            >
                              {isExpanded ? (
                                <>
                                  Less <ChevronUp className="w-3.5 h-3.5" />
                                </>
                              ) : (
                                <>
                                  More <ChevronDown className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-xs text-gray-400 py-2">
                      No subcategories available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
