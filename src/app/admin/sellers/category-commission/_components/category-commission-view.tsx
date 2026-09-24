"use client"

import React, { useState, useTransition } from "react"
import {
  Percent,
  Search,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowUpDown,
  Layers,
} from "lucide-react"
import { updateCategoryCommissionsAction } from "@/app/actions/ecommerce-actions"
import type { SeedCategory } from "@/db/seed/data"

interface CategoryCommissionViewProps {
  categories: SeedCategory[]
  initialCommissions: Record<string, number>
}

export function CategoryCommissionView({
  categories,
  initialCommissions,
}: CategoryCommissionViewProps) {
  const [commissions, setCommissions] = useState<Record<string, number>>(initialCommissions)
  const [search, setSearch] = useState("")
  const [bulkRate, setBulkRate] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleRateChange = (catId: string, val: string) => {
    const num = parseFloat(val) || 0
    setCommissions((prev) => ({ ...prev, [catId]: num }))
  }

  const handleApplyBulk = () => {
    const num = parseFloat(bulkRate)
    if (isNaN(num) || num < 0 || num > 100) {
      setFeedback({ type: "error", text: "Please enter a valid percentage between 0 and 100" })
      return
    }
    const updated = { ...commissions }
    filteredCategories.forEach((c) => {
      updated[c.id] = num
    })
    setCommissions(updated)
    setFeedback({ type: "success", text: `Applied ${num}% to ${filteredCategories.length} categories. Click Save Changes to commit.` })
  }

  const handleSaveAll = () => {
    startTransition(async () => {
      const res = await updateCategoryCommissionsAction(commissions)
      if (res.success) {
        setFeedback({ type: "success", text: "Category commissions updated successfully!" })
      } else {
        setFeedback({ type: "error", text: "Failed to update category commissions" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Percent className="h-6 w-6 text-[#d43533]" />
            Category-Based Seller Commission
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Define specific marketplace commission percentages per category when Category-Based commission is active
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Bulk Apply Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-700">Quick Bulk Set:</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              placeholder="e.g. 8"
              value={bulkRate}
              onChange={(e) => setBulkRate(e.target.value)}
              className="w-20 rounded-lg border border-gray-200 px-2.5 py-1 text-xs focus:border-[#d43533] focus:outline-hidden"
            />
            <span className="text-xs text-gray-500 font-semibold">%</span>
            <button
              type="button"
              onClick={handleApplyBulk}
              className="rounded-lg bg-gray-900 px-3 py-1 text-xs font-semibold text-white hover:bg-black transition"
            >
              Apply to Visible
            </button>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#d43533]"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3 text-right">Commission Rate (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    No categories found matching &quot;{search}&quot;.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, idx) => {
                  const currentRate = commissions[cat.id] ?? 10
                  return (
                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {cat.icon ? (
                              <img src={cat.icon} alt={cat.name} className="h-full w-full object-cover" />
                            ) : (
                              <Percent className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900">{cat.name}</span>
                            {cat.featured && (
                              <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-500 text-[11px]">{cat.slug}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            value={currentRate}
                            onChange={(e) => handleRateChange(cat.id, e.target.value)}
                            className="w-20 rounded-lg border border-gray-200 px-2.5 py-1.5 text-right text-xs font-bold text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                          />
                          <span className="font-bold text-gray-500 text-xs">%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50/75 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isPending}
            className="rounded-lg bg-[#d43533] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition"
          >
            {isPending ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
