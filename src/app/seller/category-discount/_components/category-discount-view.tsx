"use client"

import React, { useState } from "react"
import { Search, Save, Check } from "lucide-react"

interface CategoryDiscountRow {
  id: string
  name: string
  icon: string
  discount: number
  dateRange: string
}

const DEFAULT_ROWS: CategoryDiscountRow[] = [
  { id: "cd-1", name: "Women Clothing & Fashion", icon: "👗", discount: 15, dateRange: "2026-09-01 to 2026-10-31" },
  { id: "cd-2", name: "Men Clothing & Fashion", icon: "👔", discount: 10, dateRange: "2026-09-01 to 2026-10-31" },
  { id: "cd-3", name: "Computer & Accessories", icon: "💻", discount: 5, dateRange: "2026-09-15 to 2026-10-15" },
  { id: "cd-4", name: "Cellphones & Tabs", icon: "📱", discount: 0, dateRange: "" },
  { id: "cd-5", name: "Consumer Electronics", icon: "🎧", discount: 8, dateRange: "2026-09-01 to 2026-09-30" },
]

export function SellerCategoryDiscountView() {
  const [rows, setRows] = useState(DEFAULT_ROWS)
  const [search, setSearch] = useState("")
  const [savedId, setSavedId] = useState<string | null>(null)

  const handleDiscountChange = (id: string, val: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, discount: val } : r))
    )
  }

  const handleSave = (id: string) => {
    setSavedId(id)
    setTimeout(() => setSavedId(null), 2000)
  }

  const filtered = rows.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-900">
          Category Base Product Discount
        </h1>
        <p className="text-xs text-gray-500">
          Set sitewide promotional discounts across all your products in specific categories
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">Categories Discount Setup</h2>
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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-[10px] border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Icon</th>
                <th className="px-5 py-3">Category Name</th>
                <th className="px-5 py-3">Discount (%)</th>
                <th className="px-5 py-3">Discount Date Range</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row, idx) => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5 text-gray-400 font-medium">{idx + 1}</td>
                  <td className="px-5 py-3.5 text-base">{row.icon}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-800">{row.name}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 w-24">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={row.discount}
                        onChange={(e) => handleDiscountChange(row.id, Number(e.target.value))}
                        className="w-full rounded border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-800 focus:border-[#d43533] focus:outline-none"
                      />
                      <span className="text-gray-500 font-bold">%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <input
                      type="text"
                      placeholder="e.g. 2026-09-01 to 2026-10-31"
                      defaultValue={row.dateRange}
                      className="w-full max-w-[220px] rounded border border-gray-300 px-2.5 py-1 text-xs text-gray-700 focus:border-[#d43533] focus:outline-none"
                    />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleSave(row.id)}
                      className="inline-flex items-center gap-1 rounded bg-[#d43533] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#b82a28] shadow-sm transition-colors"
                    >
                      {savedId === row.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" />
                          Save
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
