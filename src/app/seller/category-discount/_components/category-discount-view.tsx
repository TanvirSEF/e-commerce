"use client"

import React, { useState, useTransition } from "react"
import { Search, Save, CheckCircle2, AlertCircle, Percent } from "lucide-react"
import { setSellerCategoryDiscountAction } from "@/app/actions/ecommerce-actions"

export interface CategoryDiscountItem {
  id: number
  name: string
  slug: string
  icon?: string | null
  discount: number
  dateRange: string
}

interface SellerCategoryDiscountViewProps {
  categories: CategoryDiscountItem[]
  shopId: number
  shopName: string
}

export function SellerCategoryDiscountView({
  categories: initialCategories,
  shopId,
  shopName,
}: SellerCategoryDiscountViewProps) {
  const [rows, setRows] = useState<CategoryDiscountItem[]>(initialCategories)
  const [search, setSearch] = useState("")
  const [savingId, setSavingId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDiscountChange = (id: number, val: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, discount: Math.max(0, Math.min(100, val)) } : r))
    )
  }

  const handleDateChange = (id: number, val: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, dateRange: val } : r)))
  }

  const handleSetDiscount = (row: CategoryDiscountItem) => {
    setSavingId(row.id)
    setFeedback(null)

    startTransition(async () => {
      const res = await setSellerCategoryDiscountAction({
        shopId,
        categoryId: row.id,
        discount: row.discount,
        dateRange: row.dateRange,
      })

      if (res && res.success) {
        setFeedback({
          type: "success",
          text: `Applied ${row.discount}% discount to all ${shopName} products in "${row.name}"!`,
        })
        setTimeout(() => setFeedback(null), 3000)
      } else {
        setFeedback({ type: "error", text: "Failed to apply category discount." })
      }
      setSavingId(null)
    })
  }

  const filtered = rows.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Set Category Base Product Discount
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {shopName} &bull; Apply promotional discount percentage across all your products in specific categories
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-xl border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span className="font-semibold">{feedback.text}</span>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        {/* Search header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">
            Categories ({filtered.length})
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

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/75 text-gray-700 font-bold uppercase text-[10px] border-b border-gray-100 tracking-wider">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Icon</th>
                <th className="px-5 py-3">Category Name</th>
                <th className="px-5 py-3" style={{ width: "160px" }}>Discount (%)</th>
                <th className="px-5 py-3" style={{ width: "220px" }}>Discount Date Range</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-xs text-gray-400">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3.5 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-5 py-3.5 text-base">
                      {row.icon ? (
                        <img src={row.icon} alt={row.name} className="w-6 h-6 object-contain" />
                      ) : (
                        "📁"
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-gray-900">{row.name}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 w-28">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={row.discount || ""}
                          onChange={(e) => handleDiscountChange(row.id, parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full rounded border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-800 focus:border-[#d43533] focus:outline-hidden text-right font-mono"
                        />
                        <span className="text-gray-500 font-bold">%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <input
                        type="text"
                        placeholder="YYYY-MM-DD to YYYY-MM-DD"
                        value={row.dateRange}
                        onChange={(e) => handleDateChange(row.id, e.target.value)}
                        className="w-full rounded border border-gray-300 px-2.5 py-1 text-xs text-gray-700 focus:border-[#d43533] focus:outline-hidden"
                      />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleSetDiscount(row)}
                        disabled={isPending && savingId === row.id}
                        className="inline-flex items-center justify-center gap-1 bg-[#d43533] hover:bg-[#b02a28] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {isPending && savingId === row.id ? "Applying..." : "Set"}
                      </button>
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
