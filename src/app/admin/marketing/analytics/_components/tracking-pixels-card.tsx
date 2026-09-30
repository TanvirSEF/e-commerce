"use client"

import React from "react"
import { Save } from "lucide-react"
import type { MarketingAnalyticsSettings } from "@/services/analytics-service"

interface TrackingPixelsCardProps {
  settings: MarketingAnalyticsSettings
  onChange: (updated: Partial<MarketingAnalyticsSettings>) => void
  onSubmit: (e: React.FormEvent) => void
  saving: boolean
}

export function TrackingPixelsCard({
  settings,
  onChange,
  onSubmit,
  saving,
}: TrackingPixelsCardProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Third-Party Tracking Pixels</h2>
          <p className="text-xs text-gray-500">
            Configure analytics and advertising conversion measurement tags
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? "Saving..." : "Save Pixel Settings"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GA4 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-800">Google Analytics (GA4)</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.googleAnalyticsActive}
                onChange={(e) => onChange({ googleAnalyticsActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Measurement ID
            </label>
            <input
              type="text"
              placeholder="e.g. G-XXXXXXXXXX"
              value={settings.googleAnalyticsId}
              onChange={(e) => onChange({ googleAnalyticsId: e.target.value })}
              className="w-full text-xs font-mono border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        {/* GTM */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-800">Google Tag Manager (GTM)</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.googleTagManagerActive}
                onChange={(e) => onChange({ googleTagManagerActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Container ID
            </label>
            <input
              type="text"
              placeholder="e.g. GTM-XXXXXXX"
              value={settings.googleTagManagerId}
              onChange={(e) => onChange({ googleTagManagerId: e.target.value })}
              className="w-full text-xs font-mono border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        {/* Meta Pixel */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-800">Meta / Facebook Pixel</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.metaPixelActive}
                onChange={(e) => onChange({ metaPixelActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Pixel ID
            </label>
            <input
              type="text"
              placeholder="e.g. 123456789012345"
              value={settings.metaPixelId}
              onChange={(e) => onChange({ metaPixelId: e.target.value })}
              className="w-full text-xs font-mono border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        {/* TikTok Pixel */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-800">TikTok Pixel</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.tiktokPixelActive}
                onChange={(e) => onChange({ tiktokPixelActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Pixel ID
            </label>
            <input
              type="text"
              placeholder="e.g. CXXXXXXXXXXXXXX"
              value={settings.tiktokPixelId}
              onChange={(e) => onChange({ tiktokPixelId: e.target.value })}
              className="w-full text-xs font-mono border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
