"use client"

import React, { useState, useTransition } from "react"
import { Bell, CheckCircle2, AlertCircle, Save } from "lucide-react"
import { updateCustomAlertSettingsAction } from "@/app/actions/ecommerce-actions"
import type { CustomAlertSettings } from "@/services/settings-service"
import { AlertLocationCard } from "./alert-location-card"
import { CustomAlertsTable } from "./custom-alerts-table"

interface CustomAlertsViewProps {
  initialSettings: CustomAlertSettings
}

export function CustomAlertsView({ initialSettings }: CustomAlertsViewProps) {
  const [settings, setSettings] = useState<CustomAlertSettings>(initialSettings)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateCustomAlertSettingsAction(settings)
      if (res.success) {
        setFeedback({ type: "success", text: "Custom alert settings saved successfully" })
      } else {
        setFeedback({ type: "error", text: "Failed to save alert settings" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleLocationChange = (position: string) => {
    const updated = { ...settings, position: position as any }
    setSettings(updated)
    startTransition(async () => {
      await updateCustomAlertSettingsAction(updated)
    })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="h-6 w-6 text-[#d43533]" />
          Custom Alerts & Announcements
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure real-time sticky floating alerts and promotional badges across the storefront
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

      {/* Select Alert Location (1:1 with Active eCommerce) */}
      <AlertLocationCard
        currentLocation={settings.position || "bottom-left"}
        onLocationChange={handleLocationChange}
      />

      {/* All Custom Alerts Table (1:1 with Active eCommerce) */}
      <CustomAlertsTable
        showAlert={settings.showAlert}
        onToggleShowAlert={() =>
          setSettings((prev) => ({ ...prev, showAlert: !prev.showAlert }))
        }
        alertText={settings.text}
        alertLink={settings.link}
      />

      {/* Form: Alert Content & Appearance */}
      <form onSubmit={handleSave} className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
          Custom Alert Content & Appearance
        </h2>

        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            Alert Message Text <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={2}
            value={settings.text}
            onChange={(e) => setSettings({ ...settings, text: e.target.value })}
            placeholder="e.g. 🔥 Ramadan & Eid Mega Sale is LIVE! Enjoy Up to 50% Off and Fast Delivery!"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            Target URL / Redirection Link
          </label>
          <input
            type="text"
            value={settings.link || ""}
            onChange={(e) => setSettings({ ...settings, link: e.target.value })}
            placeholder="e.g. /flash-deals or /products"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden font-mono"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                className="h-8 w-12 rounded cursor-pointer border border-gray-200 p-0.5"
              />
              <input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                className="h-8 w-12 rounded cursor-pointer border border-gray-200 p-0.5"
              />
              <input
                type="text"
                value={settings.textColor}
                onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? "Saving..." : "Save Alert Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
