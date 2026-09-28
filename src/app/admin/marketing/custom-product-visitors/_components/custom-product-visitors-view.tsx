"use client"

import React, { useState } from "react"
import { Eye, Save, CheckCircle, AlertCircle } from "lucide-react"
import { updateCustomProductVisitorsAction } from "@/app/actions/ecommerce-actions"
import type { CustomProductVisitorsSettings } from "@/services/settings-service"

interface CustomProductVisitorsViewProps {
  initialSettings: CustomProductVisitorsSettings
}

export function CustomProductVisitorsView({ initialSettings }: CustomProductVisitorsViewProps) {
  const [settings, setSettings] = useState<CustomProductVisitorsSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (settings.minCustomProductVisitors > settings.maxCustomProductVisitors) {
      setError("Minimum visitors cannot be greater than maximum visitors.")
      return
    }

    setIsSaving(true)
    try {
      const res = await updateCustomProductVisitorsAction(settings)
      if (res.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError("Failed to save settings. Please try again.")
      }
    } catch (err: any) {
      setError(err?.message || "Failed to update settings.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#d43533]" />
          Custom Product Visitors
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure simulated live visitor pulse badge on product details page (Active eCommerce 1:1)
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          Settings updated successfully!
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-800">
              Show Custom Product Visitors
            </label>
            <p className="text-[11px] text-slate-400">
              Display live radar badge showing active viewers on product details page
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showCustomProductVisitors}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, showCustomProductVisitors: e.target.checked }))
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d43533]"></div>
          </label>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-800">
            Visitors Range
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                Minimum Visitors
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={settings.minCustomProductVisitors}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    minCustomProductVisitors: parseInt(e.target.value, 10) || 1,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                Maximum Visitors
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={settings.maxCustomProductVisitors}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    maxCustomProductVisitors: parseInt(e.target.value, 10) || 1,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            The system will randomly select a viewer count within this range on product page load.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
