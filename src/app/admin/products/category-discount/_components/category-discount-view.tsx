"use client"

import React, { useState } from "react"
import { Percent, Search, Save, CheckCircle2, RefreshCw, Calendar, Tag } from "lucide-react"
import { type CategoryDiscountRule } from "@/services/settings-service"
import { updateCategoryDiscountsAction } from "@/app/actions/ecommerce-actions"

interface CategoryItem {
  id: string
  name: string
  icon?: string
}

interface CategoryDiscountViewProps {
  categories: CategoryItem[]
  initialDiscounts: Record<string, CategoryDiscountRule>
}

export function CategoryDiscountView({
  categories,
  initialDiscounts,
}: CategoryDiscountViewProps) {
  const [discounts, setDiscounts] = useState(initialDiscounts)
  const [search, setSearch] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleDiscountChange = (catId: string, val: number) => {
    setDiscounts((prev) => ({
      ...prev,
      [catId]: {
        categoryId: Number(catId),
        discount: val,
        applyToInhouse: prev[catId]?.applyToInhouse ?? true,
        applyToSeller: prev[catId]?.applyToSeller ?? true,
        startDate: prev[catId]?.startDate || "2026-03-01",
        endDate: prev[catId]?.endDate || "2026-04-30",
      },
    }))
  }

  const handleToggleInhouse = (catId: string) => {
    setDiscounts((prev) => ({
      ...prev,
      [catId]: {
        ...(prev[catId] || {
          categoryId: Number(catId),
          discount: 0,
          startDate: "2026-03-01",
          endDate: "2026-04-30",
        }),
        applyToInhouse: !(prev[catId]?.applyToInhouse ?? true),
        applyToSeller: prev[catId]?.applyToSeller ?? true,
      },
    }))
  }

  const handleToggleSeller = (catId: string) => {
    setDiscounts((prev) => ({
      ...prev,
      [catId]: {
        ...(prev[catId] || {
          categoryId: Number(catId),
          discount: 0,
          startDate: "2026-03-01",
          endDate: "2026-04-30",
        }),
        applyToInhouse: prev[catId]?.applyToInhouse ?? true,
        applyToSeller: !(prev[catId]?.applyToSeller ?? true),
      },
    }))
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    setFeedback(null)
    try {
      await updateCategoryDiscountsAction(discounts)
      setFeedback("Category-wise product discounts saved successfully!")
      setTimeout(() => setFeedback(null), 3000)
    } catch {
      setFeedback("Failed to update category discounts.")
    } finally {
      setIsSaving(false)
    }
  }

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Set Category Wise Product Discount
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Apply global promotional percentage discounts across entire product categories
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] disabled:bg-gray-300 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All Discounts</span>
            </>
          )}
        </button>
      </div>

      {feedback && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-4 text-xs sm:text-sm space-y-1">
        <p className="font-bold">Discount Rule Application:</p>
        <p className="text-blue-800">
          When a discount is set on a category, products under that category will display the promotional badge and calculate discounted prices during checkout for the specified date range.
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Categories ({filteredCategories.length})
          </span>
          <div className="relative w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category name..."
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4 w-12">#</th>
                <th className="p-4">Category Name</th>
                <th className="p-4 text-center">In-house</th>
                <th className="p-4 text-center">Seller</th>
                <th className="p-4">Discount (%)</th>
                <th className="p-4">Date Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.map((cat, index) => {
                const rule = discounts[cat.id] || {
                  categoryId: Number(cat.id),
                  discount: 0,
                  applyToInhouse: true,
                  applyToSeller: true,
                  startDate: "2026-03-01",
                  endDate: "2026-04-30",
                }

                return (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-500">{index + 1}</td>
                    <td className="p-4 font-bold text-gray-800 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#d43533]" />
                      <span>{cat.name}</span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleInhouse(cat.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          rule.applyToInhouse ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            rule.applyToInhouse ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSeller(cat.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          rule.applyToSeller ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            rule.applyToSeller ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 w-28">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={rule.discount}
                          onChange={(e) =>
                            handleDiscountChange(cat.id, Number(e.target.value))
                          }
                          className="w-16 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
                        />
                        <span className="font-semibold text-gray-500">%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{rule.startDate || "2026-03-01"}</span>
                        <span>to</span>
                        <span>{rule.endDate || "2026-04-30"}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
