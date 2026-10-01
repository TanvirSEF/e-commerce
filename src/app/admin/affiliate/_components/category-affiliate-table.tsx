"use client"

import React, { useState } from "react"
import { Layers, Save, CheckCircle2 } from "lucide-react"

interface CategoryItem {
  id: number
  name: string
  slug: string
  icon: string | null
}

interface CategoryAffiliateTableProps {
  categories: CategoryItem[]
  initialRates: Record<string, string>
  initialStatus: boolean
  onSave: (rates: Record<string, string>, status: boolean) => Promise<void>
}

export function CategoryAffiliateTable({
  categories,
  initialRates,
  initialStatus,
  onSave,
}: CategoryAffiliateTableProps) {
  const [status, setStatus] = useState(initialStatus)
  const [rates, setRates] = useState<Record<string, string>>(initialRates)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleRateChange = (catId: number, val: string) => {
    setRates((prev) => ({ ...prev, [String(catId)]: val }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await onSave(rates, status)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Category Wise Affiliate Commission</h2>
            <p className="text-xs text-slate-500">
              Overrides general product sharing. Enabling this will disable basic Product Sharing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-700">Enable Category Commission</label>
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => {
              setStatus(e.target.checked)
              setSaved(false)
            }}
            className="w-5 h-5 rounded text-[#d43533] focus:ring-[#d43533] accent-[#d43533]"
          />
        </div>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Category-wise commission rates updated successfully!
        </div>
      )}

      <div className="overflow-x-auto max-h-96 border border-slate-200 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-3.5 py-2.5 w-12 text-slate-400">#</th>
              <th className="px-3.5 py-2.5">Category Name</th>
              <th className="px-3.5 py-2.5 w-44 text-right">Commission Rate (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-slate-400">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-3.5 py-2.5 text-slate-400">{idx + 1}</td>
                  <td className="px-3.5 py-2.5 font-medium text-slate-800">{cat.name}</td>
                  <td className="px-3.5 py-2 text-right">
                    <div className="relative inline-block w-28">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={rates[String(cat.id)] || ""}
                        placeholder="0.00"
                        onChange={(e) => handleRateChange(cat.id, e.target.value)}
                        className="w-full pl-3 pr-6 py-1.5 text-xs text-right border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533]"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                        %
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#d43533] hover:bg-red-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? "Saving..." : "Save Category Commission Rates"}
        </button>
      </div>
    </div>
  )
}
