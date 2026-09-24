"use client"

import React, { useState } from "react"
import { Bell, Save, CheckCircle2, Clock, PackageCheck, RefreshCw } from "lucide-react"
import { type CustomSaleAlertSettings } from "@/services/settings-service"
import { updateSaleAlertSettingsAction } from "@/app/actions/ecommerce-actions"

interface ProductItem {
  id: number
  name: string
  thumbnailImg?: string
}

interface CustomSaleAlertsViewProps {
  initialSettings: CustomSaleAlertSettings
  products: ProductItem[]
}

export function CustomSaleAlertsView({
  initialSettings,
  products,
}: CustomSaleAlertsViewProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleToggleProduct = (id: number) => {
    setSettings((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter((p) => p !== id)
        : [...prev.productIds, id],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)
    try {
      await updateSaleAlertSettingsAction(settings)
      setFeedback("Sale alert popup settings saved successfully!")
      setTimeout(() => setFeedback(null), 3000)
    } catch {
      setFeedback("Failed to save sale alert settings.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Titlebar */}
      <div className="pb-2 border-b border-gray-200">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Custom Sale Alert Products
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Configure real-time floating sales popup alerts to build social proof and boost conversion
        </p>
      </div>

      {feedback && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
        {/* Toggle Switch */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <span className="text-sm font-bold text-gray-800 block">
              Enable Custom Sale Alert Popups
            </span>
            <span className="text-xs text-gray-500">
              Show live purchase notifications to storefront visitors
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSettings({ ...settings, showSaleAlert: !settings.showSaleAlert })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.showSaleAlert ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.showSaleAlert ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Intervals */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#d43533]" />
            <span>Popup Appearance Interval (Random Seconds)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Minimum Interval (Seconds)</label>
              <input
                type="number"
                min={2}
                max={60}
                value={settings.minIntervalSec}
                onChange={(e) =>
                  setSettings({ ...settings, minIntervalSec: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Maximum Interval (Seconds)</label>
              <input
                type="number"
                min={5}
                max={120}
                value={settings.maxIntervalSec}
                onChange={(e) =>
                  setSettings({ ...settings, maxIntervalSec: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Products Multi-select */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#d43533]" />
              <span>Select Alert Products ({settings.productIds.length} Selected)</span>
            </label>
            <button
              type="button"
              onClick={() =>
                setSettings({
                  ...settings,
                  productIds:
                    settings.productIds.length === products.length
                      ? []
                      : products.map((p) => p.id),
                })
              }
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              {settings.productIds.length === products.length ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="border border-gray-200 rounded-xl p-3 max-h-60 overflow-y-auto space-y-1.5 bg-gray-50/50">
            {products.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={settings.productIds.includes(p.id)}
                  onChange={() => handleToggleProduct(p.id)}
                  className="w-4 h-4 text-[#d43533] rounded border-gray-300 focus:ring-[#d43533]"
                />
                <span className="text-xs text-gray-800 font-medium line-clamp-1">{p.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 text-right">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] disabled:bg-gray-300 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Alert Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
