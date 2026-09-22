"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react"

interface SubCategory {
  name: string
  slug: string
  children?: { name: string; slug: string }[]
}

interface CategoryGroup {
  id: string
  name: string
  slug: string
  banner: string
  subcategories: SubCategory[]
}

interface CategoriesViewProps {
  categories: CategoryGroup[]
}

export function CategoriesView({ categories }: CategoriesViewProps) {
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({})

  const toggleSub = (key: string) => {
    setExpandedSubs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">All Categories</h1>
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 mt-2 md:mt-0">
            <Link href="/" className="hover:text-[#d43533] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-800">&quot;All Categories&quot;</span>
          </nav>
        </div>

        {/* Categories List */}
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white border border-gray-200 rounded-none shadow-sm overflow-hidden">
              {/* Main Category Header Banner */}
              <Link
                href={`/category/${cat.slug}`}
                className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-14 h-14 relative p-1 border border-gray-200 mr-4 flex-shrink-0 bg-white">
                  <Image
                    src={cat.banner}
                    alt={cat.name}
                    fill
                    sizes="60px"
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-[#d43533] transition-colors">
                    {cat.name}
                  </h2>
                  <span className="text-xs text-gray-500">View all items &rarr;</span>
                </div>
              </Link>

              {/* Subcategories Grid */}
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {cat.subcategories.map((sub, idx) => {
                    const subKey = `${cat.id}-${idx}`
                    const isExpanded = !!expandedSubs[subKey]
                    const visibleChildren = isExpanded
                      ? sub.children
                      : sub.children?.slice(0, 5)

                    return (
                      <div key={sub.slug} className="text-left">
                        <h3 className="mb-2.5">
                          <Link
                            href={`/category/${sub.slug}`}
                            className="font-bold text-sm text-gray-800 hover:text-[#d43533] transition-colors"
                          >
                            {sub.name}
                          </Link>
                        </h3>

                        {sub.children && sub.children.length > 0 && (
                          <ul className="space-y-1.5 mb-2">
                            {visibleChildren?.map((child) => (
                              <li key={child.slug}>
                                <Link
                                  href={`/category/${child.slug}`}
                                  className="text-xs text-gray-600 hover:text-[#d43533] transition-colors block py-0.5"
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}

                        {sub.children && sub.children.length > 5 && (
                          <button
                            type="button"
                            onClick={() => toggleSub(subKey)}
                            className="text-xs font-semibold text-[#d43533] hover:underline flex items-center mt-1"
                          >
                            {isExpanded ? (
                              <>
                                Less <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                              </>
                            ) : (
                              <>
                                More ({sub.children.length - 5}){" "}
                                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
