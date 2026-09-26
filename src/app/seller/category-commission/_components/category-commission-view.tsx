"use client"

import React, { useState } from "react"
import { Search, Percent } from "lucide-react"

interface CategoryCommissionItem {
  id: string
  name: string
  icon: string
  commission: number
}

const DEFAULT_CATEGORIES: CategoryCommissionItem[] = [
  { id: "cat-1", name: "Women Clothing & Fashion", icon: "👗", commission: 10 },
  { id: "cat-2", name: "Men Clothing & Fashion", icon: "👔", commission: 10 },
  { id: "cat-3", name: "Computer & Accessories", icon: "💻", commission: 8 },
  { id: "cat-4", name: "Cellphones & Tabs", icon: "📱", commission: 5 },
  { id: "cat-5", name: "Consumer Electronics", icon: "🎧", commission: 7 },
  { id: "cat-6", name: "Jewelry & Watches", icon: "⌚", commission: 12 },
  { id: "cat-7", name: "Home Appliances", icon: "🏠", commission: 8 },
  { id: "cat-8", name: "Sports & Outdoor", icon: "⚽", commission: 9 },
]

export function SellerCategoryCommissionView() {
  const [search, setSearch] = useState("")

  const filteredCategories = DEFAULT_CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Title Bar */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">Category-wise Commission</h1>
        <p className="text-xs text-gray-500">
          View platform commission rates applied to your product sales by category
        </p>
      </div>

      {/* Card Table Container */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Search header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">Categories Commission Rates</h2>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search category name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-gray-300 pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
            />
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-[10px] border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Icon</th>
                <th className="px-5 py-3">Category Name</th>
                <th className="px-5 py-3 text-right">Commission Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-xs text-gray-400">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-5 py-3.5 text-base">{cat.icon}</td>
                    <td className="px-5 py-3.5 font-bold text-gray-800">{cat.name}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2.5 py-1 text-xs font-bold text-[#d43533]">
                        <Percent className="h-3 w-3" />
                        {cat.commission}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
