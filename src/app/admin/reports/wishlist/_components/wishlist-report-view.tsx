"use client"

import React, { useState } from "react"
import { type ProductWishReportItem } from "@/services/report-service"
import { Heart, Package, Filter } from "lucide-react"

interface WishlistReportViewProps {
  initialReport: ProductWishReportItem[]
  categories: { id: string | number; name: string }[]
  currentCategoryId?: number
}

export function WishlistReportView({
  initialReport,
  categories,
  currentCategoryId,
}: WishlistReportViewProps) {
  const [selectedCat, setSelectedCat] = useState<string>(
    currentCategoryId ? String(currentCategoryId) : ""
  )
  const [report, setReport] = useState<ProductWishReportItem[]>(initialReport)

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCat) {
      setReport(initialReport)
    } else {
      const catObj = categories.find((c) => String(c.id) === selectedCat)
      if (catObj) {
        setReport(initialReport.filter((p) => p.categoryName === catObj.name))
      }
    }
  }

  const totalWishes = report.reduce((sum, item) => sum + item.wishlistCount, 0)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title Bar */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Product Wish Report</h1>
        <p className="text-xs text-gray-500 mt-1">
          Track high-demand products and customer favorite wishlist saves
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-red-50 text-[#d43533] rounded-lg">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Wishlist Saves</p>
            <p className="text-lg font-bold text-gray-800">{totalWishes.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Saved Products Count</p>
            <p className="text-lg font-bold text-gray-800">{report.length}</p>
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Filter Form matching Active eCommerce CMS 1:1 */}
        <div className="p-6 border-b border-gray-200 bg-[#fafbfc]">
          <form onSubmit={handleFilter} className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 max-w-xl mx-auto">
            <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">
              Sort by Category :
            </label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white text-gray-700 w-full sm:w-60 focus:border-[#d43533]"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-5 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Number of Wish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {report.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-400">
                    No wishlist entries found for this category.
                  </td>
                </tr>
              ) : (
                report.map((item) => (
                  <tr key={item.productId} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <span className="line-clamp-2">{item.productName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 text-[11px]">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-[#d43533] border border-rose-100">
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>{item.wishlistCount} saves</span>
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
