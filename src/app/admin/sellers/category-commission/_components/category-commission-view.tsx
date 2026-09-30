"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import {
  Percent,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Save,
  Layers,
  X,
} from "lucide-react"
import { updateCategoryCommissionsAction } from "@/app/actions/ecommerce-actions"
import type { SeedCategory } from "@/db/seed/data"

interface CategoryCommissionViewProps {
  categories?: SeedCategory[]
  initialCommissions?: Record<string, number>
}

export function CategoryCommissionView({
  categories = [],
  initialCommissions = {},
}: CategoryCommissionViewProps) {
  const [commissions, setCommissions] = useState<Record<string, number>>(initialCommissions || {})
  const [search, setSearch] = useState("")
  const [bulkRate, setBulkRate] = useState("")
  const [pendingConfirmCat, setPendingConfirmCat] = useState<SeedCategory | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const filteredCategories = (categories || []).filter((c) =>
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
    setFeedback({ type: "success", text: `Applied ${num}% to visible categories. Save changes to commit.` })
  }

  const handleConfirmSingle = () => {
    if (!pendingConfirmCat) return
    const catId = pendingConfirmCat.id
    const rate = commissions[catId] ?? 0
    startTransition(async () => {
      const res = await updateCategoryCommissionsAction({ [catId]: rate })
      if (res.success) {
        setFeedback({ type: "success", text: `Commission rate for "${pendingConfirmCat.name}" updated to ${rate}%!` })
      } else {
        setFeedback({ type: "error", text: "Failed to update category commission" })
      }
      setPendingConfirmCat(null)
      setTimeout(() => setFeedback(null), 3500)
    })
  }

  const handleSaveAll = () => {
    startTransition(async () => {
      const res = await updateCategoryCommissionsAction(commissions)
      if (res.success) {
        setFeedback({ type: "success", text: "All category commissions saved successfully!" })
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
            <Percent className="h-5 w-5 text-[#d43533]" />
            Set Category Wise Commission
          </h1>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#b02a28] transition"
        >
          <Save className="h-3.5 w-3.5" />
          {isPending ? "Saving..." : "Save All"}
        </button>
      </div>

      {/* Alert Notice (1:1 with Laravel set_commission.blade.php) */}
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 text-xs text-sky-900 space-y-1">
        <p className="font-semibold">
          If you set commission on the main Category, all sister categories will inherit that commission unless overridden individually.
        </p>
        <p className="text-slate-600">
          Ensure commission type is set to Category Based under{" "}
          <Link href="/admin/sellers/commission" className="text-[#d43533] font-bold underline">
            Seller Commission Settings
          </Link>.
        </p>
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

      {/* Filter and Bulk Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Layers className="h-4 w-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-700">Quick Set:</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              placeholder="e.g. 10"
              value={bulkRate}
              onChange={(e) => setBulkRate(e.target.value)}
              className="w-16 rounded border border-gray-200 px-2 py-1 text-xs focus:border-[#d43533] focus:outline-hidden"
            />
            <span className="text-xs text-gray-500 font-semibold">%</span>
            <button
              type="button"
              onClick={handleApplyBulk}
              className="rounded bg-slate-800 px-2.5 py-1 text-xs font-semibold text-white hover:bg-black transition"
            >
              Apply to Visible
            </button>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Type name & Enter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#d43533]"
          />
        </div>
      </div>

      {/* Main Table (1:1 with Laravel category_wise_commission/set_commission.blade.php) */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3 w-12">#</th>
                <th className="px-4 py-3 w-16">Icon</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Parent Category</th>
                <th className="px-4 py-3 w-48">Commission Rate</th>
                <th className="px-4 py-3 text-right w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
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
                        <div className="h-8 w-8 rounded bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {cat.icon ? (
                            <img src={cat.icon} alt={cat.name} className="h-full w-full object-cover" />
                          ) : (
                            <Percent className="h-3.5 w-3.5 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        {cat.name}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        —
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={currentRate}
                            onChange={(e) => handleRateChange(cat.id, e.target.value)}
                            className="w-24 rounded-l border border-gray-200 px-2 py-1 text-xs font-bold text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                          />
                          <span className="bg-gray-100 border border-l-0 border-gray-200 px-2.5 py-1 text-xs text-gray-600 font-bold rounded-r">
                            %
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setPendingConfirmCat(cat)}
                          className="rounded bg-[#d43533] px-3.5 py-1 text-xs font-semibold text-white hover:bg-[#b02a28] transition"
                        >
                          Set
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal (1:1 with Laravel confirm-modal) */}
      {pendingConfirmCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 text-xs">
            <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Confirm Commission Rate
            </h3>
            <p className="text-slate-500 mb-4">
              Are you sure you want to set Category Wise Commission for &quot;{pendingConfirmCat.name}&quot; to{" "}
              <span className="font-bold text-[#d43533]">{commissions[pendingConfirmCat.id] ?? 0}%</span>?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setPendingConfirmCat(null)}
                className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSingle}
                disabled={isPending}
                className="px-5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white font-semibold rounded transition"
              >
                {isPending ? "Setting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
