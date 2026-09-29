"use client"

import React from "react"
import Image from "next/image"
import { Search, Edit, Trash2 } from "lucide-react"

export interface AdminCategoryItem {
  id: string
  name: string
  slug: string
  icon: string
  banner?: string
  coverImage?: string
  digital?: boolean
  featured: boolean
  hot?: boolean
  level?: number
  orderLevel: number
  parentId?: number | null
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

interface AdminCategoriesTableProps {
  categories: AdminCategoryItem[]
  allCategories: AdminCategoryItem[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onToggleFeatured: (id: string, current: boolean) => Promise<void>
  onToggleHot: (id: string, current: boolean) => Promise<void>
  onEditClick: (category: AdminCategoryItem) => void
  onDeleteClick: (id: string) => void
}

export function AdminCategoriesTable({
  categories,
  allCategories,
  searchQuery,
  onSearchChange,
  onToggleFeatured,
  onToggleHot,
  onEditClick,
  onDeleteClick,
}: AdminCategoriesTableProps) {
  const getParentName = (parentId?: number | null) => {
    if (!parentId) return "—"
    const parent = allCategories.find((c) => String(c.id) === String(parentId))
    return parent ? parent.name : "—"
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      {/* Table Header Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fafbfc]">
        <h2 className="text-sm font-bold text-slate-800">
          All Categories ({categories.length})
        </h2>
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 w-12">#</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Parent Category</th>
              <th className="py-3 px-4 text-center">Order Level</th>
              <th className="py-3 px-4 text-center">Level</th>
              <th className="py-3 px-4 text-center">Featured</th>
              <th className="py-3 px-4 text-center">Hot</th>
              <th className="py-3 px-4 text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-slate-50/75 transition-colors">
                  <td className="py-3 px-4 text-slate-400 font-semibold">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 relative border border-slate-200 rounded shrink-0 bg-white overflow-hidden shadow-2xs">
                        <Image
                          src={cat.icon || "/assets/img/placeholder.jpg"}
                          alt={cat.name}
                          fill
                          sizes="36px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{cat.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-slate-400 font-mono">/{cat.slug}</span>
                          {cat.digital && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-purple-100 text-purple-700 rounded">
                              Digital
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Parent Category Badge */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                      {getParentName(cat.parentId)}
                    </span>
                  </td>

                  {/* Order Level */}
                  <td className="py-3 px-4 text-center font-bold font-mono text-slate-800">
                    {cat.orderLevel}
                  </td>

                  {/* Level */}
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-100 text-slate-600">
                      L{cat.parentId ? 1 : 0}
                    </span>
                  </td>

                  {/* Featured Switch Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleFeatured(cat.id, cat.featured)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        cat.featured ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                      title="Toggle Featured Status"
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          cat.featured ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Hot Category Switch Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleHot(cat.id, !!cat.hot)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        cat.hot ? "bg-amber-500" : "bg-gray-200"
                      }`}
                      title="Toggle Hot Status"
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          cat.hot ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Options: Edit & Delete */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        type="button"
                        onClick={() => onEditClick(cat)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        title="Edit category"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteClick(cat.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
