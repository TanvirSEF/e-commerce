"use client"

import React, { useState } from "react"
import { Settings, Save, CheckCircle2, DollarSign, Bell } from "lucide-react"
import { updateDeliveryBoyConfigAction } from "@/app/actions/ecommerce-actions"

interface AdminDeliveryBoyConfigViewProps {
  config: {
    commission_type: string
    commission_value: string
    monthly_salary: string
    cash_collection_limit: string
    mail_notification: boolean
    otp_notification: boolean
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
          Configure courier remuneration structures, cash collection limits, and dispatch notifications
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
            <label className="text-xs font-bold text-slate-700">Payment Structure Type</label>
            <select
              value={config.commission_type}
              onChange={(e) => setConfig({ ...config, commission_type: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533] bg-white"
            >
              <option value="commission">Commission Per Delivered Order</option>
              <option value="salary">Fixed Monthly Salary</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Delivery Fee / Commission Rate ($)
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

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Monthly Base Salary ($)</label>
            <input
              type="number"
              step="100"
              required
              value={config.monthly_salary}
              onChange={(e) => setConfig({ ...config, monthly_salary: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>

          <div className="space-y-1.5">
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
              Couriers exceeding this limit will not be assigned new deliveries until funds are deposited
            </p>
          </div>

          {/* Notifications toggles */}
          <div className="md:col-span-2 pt-2 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-slate-500" />
              Delivery Status Notifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Mail Notification</span>
                  <span className="text-[11px] text-slate-400">Send email updates on delivery assignments</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.mail_notification}
                  onChange={(e) => setConfig({ ...config, mail_notification: e.target.checked })}
                  className="w-4 h-4 rounded text-[#d43533] focus:ring-[#d43533] accent-[#d43533]"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">SMS / OTP Notification</span>
                  <span className="text-[11px] text-slate-400">Send customer OTP verification for delivery handover</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.otp_notification}
                  onChange={(e) => setConfig({ ...config, otp_notification: e.target.checked })}
                  className="w-4 h-4 rounded text-[#d43533] focus:ring-[#d43533] accent-[#d43533]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-red-700 disabled:opacity-60 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  )
}
