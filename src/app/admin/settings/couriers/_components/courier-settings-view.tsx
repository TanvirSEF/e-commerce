"use client"

import React, { useState } from "react"
import { Truck, CheckCircle2, Save, Loader2 } from "lucide-react"
import { updateCouriersSettingsAction } from "@/app/actions/ecommerce-actions"
import type { CouriersMasterSettings, CourierConfigItem } from "@/services/courier-config-service"
import { CourierTabCard } from "./courier-tab-card"

interface CourierSettingsViewProps {
  initialSettings: CouriersMasterSettings
}

export function CourierSettingsView({ initialSettings }: CourierSettingsViewProps) {
  const [settings, setSettings] = useState<CouriersMasterSettings>(initialSettings)
  const [activeTab, setActiveTab] = useState<"steadfast" | "pathao" | "redx" | "paperfly">("steadfast")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateCouriersSettingsAction(settings)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleUpdateCourier = (identifier: keyof CouriersMasterSettings, updated: CourierConfigItem) => {
    setSettings((prev) => ({
      ...prev,
      [identifier]: updated,
    }))
  }

  const tabs: Array<{ id: "steadfast" | "pathao" | "redx" | "paperfly"; label: string; active: boolean }> = [
    { id: "steadfast", label: "Steadfast Courier", active: settings.steadfast.active },
    { id: "pathao", label: "Pathao Express", active: settings.pathao.active },
    { id: "redx", label: "RedX Logistics", active: settings.redx.active },
    { id: "paperfly", label: "Paperfly Doorstep", active: settings.paperfly.active },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#d43533]" />
          Third-Party Courier & Logistics Integrations
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Connect automated delivery dispatch and live parcel consignment tracking with Bangladesh&apos;s leading couriers.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Courier credentials and automation settings updated successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? "border-[#d43533] text-[#d43533]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>{tab.label}</span>
            {tab.active && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <CourierTabCard
          courier={settings[activeTab]}
          onUpdate={(updated) => handleUpdateCourier(activeTab, updated)}
        />

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] text-white rounded-lg text-xs font-bold hover:bg-[#b82a28] shadow-sm transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving Configuration..." : "Save Courier Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
