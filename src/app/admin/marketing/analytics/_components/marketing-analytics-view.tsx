"use client"

import React, { useState } from "react"
import { BarChart2, Activity, Eye, Share2, Save, CheckCircle2 } from "lucide-react"
import { updateAnalyticsSettingsAction } from "@/app/actions/ecommerce-actions"
import type { MarketingAnalyticsSettings } from "@/services/analytics-service"

interface MarketingAnalyticsViewProps {
  initialSettings: MarketingAnalyticsSettings
}

export function MarketingAnalyticsView({ initialSettings }: MarketingAnalyticsViewProps) {
  const [settings, setSettings] = useState<MarketingAnalyticsSettings>(initialSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateAnalyticsSettingsAction(settings)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[#d43533]" />
          Marketing Analytics & Conversion Tracking Pixels
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Connect third-party analytics and tracking scripts to measure traffic, conversions, and ad campaign performance.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Analytics & pixel settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* GA4 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                GA4
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Google Analytics (GA4)</h2>
                <p className="text-xs text-gray-500">Track visitor behavior, sales performance and conversion insights.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.googleAnalyticsActive}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Google Analytics Tracking / Measurement ID
            </label>
            <input
              type="text"
              placeholder="e.g. G-XXXXXXXXXX"
              value={settings.googleAnalyticsId}
              onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
              className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        {/* GTM */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                GTM
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Google Tag Manager (GTM)</h2>
                <p className="text-xs text-gray-500">Manage and deploy marketing tags without editing underlying code.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.googleTagManagerActive}
                onChange={(e) => setSettings({ ...settings, googleTagManagerActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Google Tag Manager Container ID
            </label>
            <input
              type="text"
              placeholder="e.g. GTM-XXXXXXX"
              value={settings.googleTagManagerId}
              onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
              className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        {/* Meta Pixel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
                FB
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Meta / Facebook Pixel</h2>
                <p className="text-xs text-gray-500">Track customer events, purchases, and measure Meta ad campaigns.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.metaPixelActive}
                onChange={(e) => setSettings({ ...settings, metaPixelActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Meta Pixel ID
            </label>
            <input
              type="text"
              placeholder="e.g. 123456789012345"
              value={settings.metaPixelId}
              onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
              className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        {/* TikTok Pixel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
                TT
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">TikTok Pixel</h2>
                <p className="text-xs text-gray-500">Track customer purchases and conversions from TikTok ad campaigns.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.tiktokPixelActive}
                onChange={(e) => setSettings({ ...settings, tiktokPixelActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              TikTok Pixel ID
            </label>
            <input
              type="text"
              placeholder="e.g. CXXXXXXXXXXXX"
              value={settings.tiktokPixelId}
              onChange={(e) => setSettings({ ...settings, tiktokPixelId: e.target.value })}
              className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Analytics Configurations"}
          </button>
        </div>
      </form>
    </div>
  )
}
