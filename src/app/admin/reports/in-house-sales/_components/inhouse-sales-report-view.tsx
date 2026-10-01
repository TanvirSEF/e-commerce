"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, ShoppingBag } from "lucide-react"
import type { InhouseSaleReportItem } from "@/services/report-service"

interface InhouseSalesReportViewProps {
  products: InhouseSaleReportItem[]
  categories: { id: number | string; name: string }[]
  currentCategoryId?: number
}

export function InhouseSalesReportView({
  products,
  categories,
  currentCategoryId,
}: InhouseSalesReportViewProps) {
  const router = useRouter()
  const [selectedCat, setSelectedCat] = useState<string>(
    currentCategoryId ? String(currentCategoryId) : ""
  )
  const [search, setSearch] = useState("")

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCat) {
      router.push(`/admin/reports/in-house-sales?category_id=${selectedCat}`)
    } else {
      router.push(`/admin/reports/in-house-sales`)
    }
  }

  const filtered = products.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Inhouse Product sale report</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record of items sold exclusively from in-house admin inventory
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          {/* Filter Bar (1:1 with Laravel) */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <form onSubmit={handleFilter} className="flex flex-col sm:flex-row items-center gap-3">
              <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                Sort by Category :
              </label>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full sm:w-72 px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              >
                <option value="">Choose Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" /> Filter
              </button>
            </form>
          </div>

          {/* Quick Search */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#d43533]"
              />
            </div>
            <div className="text-xs text-slate-500">
              Total Products: <span className="font-bold text-slate-800">{filtered.length}</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs">
                <tr>
                  <th className="px-4 py-3 w-16">#</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3 text-right">Num of Sale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                      No in-house products found for this category.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 text-xs text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-900 text-sm">{item.productName}</div>
                        <div className="text-[11px] text-slate-500">{item.categoryName}</div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShoppingBag className="w-3 h-3" />
                          {item.numOfSale}
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
    </div>
  )
}
