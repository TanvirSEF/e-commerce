"use client"

import React, { useState } from "react"
import { BarChart2, CheckCircle2 } from "lucide-react"
import { updateAnalyticsSettingsAction } from "@/app/actions/ecommerce-actions"
import type { MarketingAnalyticsSettings } from "@/services/analytics-service"
import { MarketingHubGrid } from "./marketing-hub-grid"
import { TrackingPixelsCard } from "./tracking-pixels-card"

interface MarketingAnalyticsViewProps {
  initialSettings: MarketingAnalyticsSettings
}

export function MarketingAnalyticsView({ initialSettings }: MarketingAnalyticsViewProps) {
  const [settings, setSettings] = useState<MarketingAnalyticsSettings>(initialSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (updated: Partial<MarketingAnalyticsSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateAnalyticsSettingsAction(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[#d43533]" />
          Marketing Analytics & Conversion Hub
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Active eCommerce promotional campaigns hub and conversion tracking pixel integrations
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Analytics & pixel settings updated successfully!
        </div>
      )}

      {/* 1:1 Active eCommerce Marketing Hub Cards */}
      <MarketingHubGrid />

      {/* Tracking Pixels Form */}
      <div className="border-t border-gray-200 pt-6">
        <TrackingPixelsCard
          settings={settings}
          onChange={handleChange}
          onSubmit={handleSubmit}
          saving={saving}
        />
      </div>
    </div>
  )
}
