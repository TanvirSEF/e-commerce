"use client"

import React, { useState } from "react"
import { Search, Percent } from "lucide-react"

export interface CategoryCommissionItem {
  id: string | number
  name: string
  icon?: string | null
  commission: number
}

interface SellerCategoryCommissionViewProps {
  categories?: CategoryCommissionItem[]
}

const DEFAULT_CATEGORIES: CategoryCommissionItem[] = [
  { id: 1, name: "Women Clothing & Fashion", icon: "👗", commission: 10 },
  { id: 2, name: "Men Clothing & Fashion", icon: "👔", commission: 10 },
  { id: 3, name: "Computer & Accessories", icon: "💻", commission: 8 },
  { id: 4, name: "Smartphone Accessories", icon: "📱", commission: 8 },
  { id: 5, name: "Car & Motorbike Accessories", icon: "🚗", commission: 10 },
  { id: 6, name: "Kitchen & Dining", icon: "🍳", commission: 12 },
  { id: 7, name: "Household Appliances", icon: "🏠", commission: 10 },
  { id: 8, name: "Fitness & Outdoor", icon: "⚽", commission: 9 },
]

export function SellerCategoryCommissionView({
  categories: initialCategories,
}: SellerCategoryCommissionViewProps = {}) {
  const [search, setSearch] = useState("")
  const list = initialCategories && initialCategories.length > 0 ? initialCategories : DEFAULT_CATEGORIES

  const filteredCategories = list.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Category-wise Commission</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          View platform commission rates applied to your vendor store product sales by category
        </p>
      </div>

      {/* Card Table Container */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        {/* Search header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">
            Categories Commission Rates ({filteredCategories.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search category name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-hidden"
            />
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/75 text-gray-700 font-bold uppercase text-[10px] border-b border-gray-100 tracking-wider">
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
                  <td colSpan={4} className="px-5 py-10 text-center text-xs text-gray-400">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3.5 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-5 py-3.5 text-base">
                      {cat.icon && cat.icon.startsWith("http") ? (
                        <img src={cat.icon} alt={cat.name} className="w-5 h-5 object-contain" />
                      ) : (
                        cat.icon || "📁"
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-gray-900">{cat.name}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-bold text-[#d43533] font-mono">
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
