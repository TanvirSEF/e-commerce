"use client"

import React, { useState } from "react"
import { Settings, Save, CheckCircle2, DollarSign, Shield } from "lucide-react"
import { updateDeliveryBoyConfigAction } from "@/app/actions/ecommerce-actions"

interface AdminDeliveryBoyConfigViewProps {
  config: {
    commission_type: string
    commission_value: string
    cash_collection_limit: string
    cancel_request_verification: boolean
  }
}

export function AdminDeliveryBoyConfigView({ config: initialConfig }: AdminDeliveryBoyConfigViewProps) {
  const [config, setConfig] = useState(initialConfig)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateDeliveryBoyConfigAction(config)
      setSaved(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-[#d43533]" />
          Delivery Boy Configuration
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure courier commission rates per completed delivery and cash collection policies
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Delivery boy configuration settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Commission Rate Type</label>
            <select
              value={config.commission_type}
              onChange={(e) => setConfig({ ...config, commission_type: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            >
              <option value="fixed">Fixed Rate ($ per completed delivery)</option>
              <option value="percentage">Percentage (% of order total)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Delivery Fee / Commission Value ({config.commission_type === "fixed" ? "$" : "%"})
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={config.commission_value}
              onChange={(e) => setConfig({ ...config, commission_value: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700">Maximum Allowed COD Cash In Hand ($)</label>
            <input
              type="number"
              step="100"
              required
              value={config.cash_collection_limit}
              onChange={(e) => setConfig({ ...config, cash_collection_limit: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
            <p className="text-[11px] text-slate-400">
              Couriers exceeding this collected cash ceiling will be barred from receiving new orders until cash is turned over
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-red-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  )
}
