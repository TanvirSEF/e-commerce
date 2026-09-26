"use client"

import React, { useState, useTransition } from "react"
import { Code, Save, CheckCircle2, AlertCircle } from "lucide-react"
import { updateGenericSettingAction } from "@/app/actions/ecommerce-actions"
import type { CustomScriptsSettings } from "@/services/settings-service"

interface CustomScriptsViewProps {
  initialSettings: CustomScriptsSettings
}

export function CustomScriptsView({ initialSettings }: CustomScriptsViewProps) {
  const [settings, setSettings] = useState<CustomScriptsSettings>(initialSettings)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const ok = await updateGenericSettingAction("custom_scripts_settings", JSON.stringify(settings))
      if (ok) {
        setFeedback({ type: "success", text: "Custom tracking scripts saved successfully" })
      } else {
        setFeedback({ type: "error", text: "Failed to update custom scripts" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Code className="w-5 h-5 text-[#d43533]" />
          Custom Scripts & Analytics Integration
        </h1>
        <p className="text-xs text-gray-500">Inject custom JavaScript, GTM, GA4, Meta Pixel, and conversion tags</p>
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Quick Tracking IDs Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-gray-900">Analytics & Pixel IDs</h2>
            <p className="text-[11px] text-gray-500">Directly link tracking providers without writing script wrappers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Google Analytics 4 ID
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={settings.googleAnalyticsId}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Google Tag Manager ID
              </label>
              <input
                type="text"
                placeholder="GTM-XXXXXXX"
                value={settings.googleTagManagerId}
                onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Meta / Facebook Pixel ID
              </label>
              <input
                type="text"
                placeholder="123456789012345"
                value={settings.metaPixelId}
                onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Custom Header Script */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-gray-900">Header Custom Script</h2>
            <p className="text-[11px] text-gray-500">Injected immediately before closing &lt;/head&gt; tag</p>
          </div>

          <textarea
            rows={5}
            placeholder="<script>...your header tracking code...</script>"
            value={settings.headerScript}
            onChange={(e) => setSettings({ ...settings, headerScript: e.target.value })}
            className="w-full rounded-lg border border-gray-200 p-3 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
          />
        </div>

        {/* Custom Footer Script */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-gray-900">Footer Custom Script</h2>
            <p className="text-[11px] text-gray-500">Injected immediately before closing &lt;/body&gt; tag</p>
          </div>

          <textarea
            rows={5}
            placeholder="<script>...your footer tracking code...</script>"
            value={settings.footerScript}
            onChange={(e) => setSettings({ ...settings, footerScript: e.target.value })}
            className="w-full rounded-lg border border-gray-200 p-3 text-xs text-gray-900 font-mono focus:border-[#d43533] focus:outline-hidden"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : "Save Custom Scripts"}
          </button>
        </div>
      </form>
    </div>
  )
}
