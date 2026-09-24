"use client"

import React, { useState, useTransition } from "react"
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Save,
  Sliders,
  ExternalLink,
  Eye,
} from "lucide-react"
import { updateCustomAlertSettingsAction } from "@/app/actions/ecommerce-actions"
import type { CustomAlertSettings } from "@/services/settings-service"

interface CustomAlertsViewProps {
  initialSettings: CustomAlertSettings
}

export function CustomAlertsView({ initialSettings }: CustomAlertsViewProps) {
  const [settings, setSettings] = useState<CustomAlertSettings>(initialSettings)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const positions = [
    {
      id: "bottom-left",
      label: "From Bottom-left",
      badgePos: "bottom-3 left-3",
    },
    {
      id: "bottom-right",
      label: "From Bottom-right",
      badgePos: "bottom-3 right-3",
    },
    {
      id: "top-left",
      label: "From Top-left",
      badgePos: "top-3 left-3",
    },
    {
      id: "top-right",
      label: "From Top-right",
      badgePos: "top-3 right-3",
    },
  ] as const

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

  return (
    <div className="space-y-6">
      {/* Title Bar */}
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

      {/* Select Alert Location (Active eCommerce 1:1) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
        <h2 className="text-sm font-bold text-gray-900">Select Alert Location</h2>
        <p className="text-xs text-gray-500 mb-4">
          Choose which screen corner dynamic alert toasts appear from
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {positions.map((pos) => {
            const isSelected = (settings.position || "bottom-left") === pos.id
            return (
              <div
                key={pos.id}
                onClick={() => setSettings({ ...settings, position: pos.id })}
                className={`relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
                  isSelected
                    ? "border-[#d43533] bg-red-50/40 shadow-xs ring-2 ring-red-100"
                    : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                }`}
              >
                {/* Mini mockup screen */}
                <div className="relative h-20 w-full rounded-md border border-gray-200 bg-white mb-2 overflow-hidden shadow-inner">
                  {/* Fake screen wireframe */}
                  <div className="h-2 w-full bg-gray-100 border-b border-gray-200" />
                  <div className="p-1 space-y-1">
                    <div className="h-1.5 w-1/3 bg-gray-100 rounded" />
                    <div className="h-1.5 w-1/2 bg-gray-100 rounded" />
                  </div>
                  {/* Alert spot indicator */}
                  <div
                    className={`absolute ${pos.badgePos} h-3.5 w-10 rounded-sm bg-[#d43533] text-[6px] text-white flex items-center justify-center font-bold shadow-xs`}
                  >
                    Alert
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5">
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() => setSettings({ ...settings, position: pos.id })}
                    className="h-3.5 w-3.5 text-[#d43533] focus:ring-[#d43533]"
                  />
                  <span className="text-xs font-semibold text-gray-800">
                    {pos.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Form & Live Preview */}
      <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-gray-900">
              Alert Content & Appearance
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600">Enable Alert:</span>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, showAlert: !settings.showAlert })}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  settings.showAlert ? "bg-emerald-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    settings.showAlert ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Text */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Alert Message Text <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={settings.text}
              onChange={(e) => setSettings({ ...settings, text: e.target.value })}
              placeholder="e.g. 🔥 Ramadan & Eid Mega Sale is LIVE! Enjoy Up to 50% Off and Fast Express Delivery across Bangladesh!"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          {/* Link */}
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

          {/* Colors */}
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
                  className="h-9 w-12 rounded cursor-pointer border border-gray-200 p-0.5"
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
                  className="h-9 w-12 rounded cursor-pointer border border-gray-200 p-0.5"
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

          {/* Delay */}
          <div className="w-full sm:w-1/2">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Trigger Delay (seconds)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.delaySec ?? 4}
              onChange={(e) => setSettings({ ...settings, delaySec: parseInt(e.target.value) || 4 })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition"
            >
              <Save className="w-4 h-4" />
              {isPending ? "Saving..." : "Save Alert Settings"}
            </button>
          </div>
        </div>

        {/* Live Preview column: 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 text-xs font-bold text-gray-900">
              <Eye className="w-4 h-4 text-[#d43533]" />
              Storefront Preview
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 min-h-[160px] flex items-center justify-center relative">
              <div
                style={{
                  backgroundColor: settings.backgroundColor || "#d43533",
                  color: settings.textColor || "#ffffff",
                }}
                className="max-w-xs p-3.5 rounded-xl shadow-lg text-xs font-medium leading-relaxed flex items-start gap-2.5 transition-all"
              >
                <Bell className="w-4 h-4 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p>{settings.text}</p>
                  {settings.link && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold underline">
                      Learn More <ExternalLink className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 text-center mt-3">
              Position: <span className="font-semibold text-gray-600">{settings.position || "bottom-left"}</span>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
