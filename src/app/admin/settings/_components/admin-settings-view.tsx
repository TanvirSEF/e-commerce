"use client"

import React, { useState, useTransition } from "react"
import { Save, Check, Loader2 } from "lucide-react"
import { updateGeneralSettingsAction } from "@/app/actions/settings-actions"
import type { GeneralSettings } from "@/services/settings-service"

interface AdminSettingsViewProps {
  initialSettings: GeneralSettings
}

export function AdminSettingsView({ initialSettings }: AdminSettingsViewProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      await updateGeneralSettingsAction(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  const inputCls =
    "w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
  const labelCls = "block text-xs font-bold text-slate-700 mb-1"

  return (
    <div className="space-y-6 max-w-4xl p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl font-bold text-slate-800">General Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Configure platform branding, contact info, and currency</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded shadow-xs p-6 space-y-5">
        {/* System Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>System Title / Name</label>
            <input type="text" name="systemName" value={settings.systemName} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>System Motto</label>
            <input type="text" name="systemMotto" value={settings.systemMotto} onChange={handleChange} className={inputCls} />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Contact Email</label>
            <input type="email" name="systemEmail" value={settings.systemEmail} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Customer Helpline</label>
            <input type="text" name="systemPhone" value={settings.systemPhone} onChange={handleChange} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Fax</label>
            <input type="text" name="systemFax" value={settings.systemFax} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Address</label>
            <input type="text" name="address" value={settings.address} onChange={handleChange} className={inputCls} />
          </div>
        </div>

        {/* Currency */}
        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Currency</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Currency Symbol</label>
              <input type="text" name="currencySymbol" value={settings.currencySymbol} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Currency Code</label>
              <input type="text" name="currencyCode" value={settings.currencyCode} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Exchange Rate (vs USD)</label>
              <input type="text" name="currencyExchangeRate" value={settings.currencyExchangeRate} onChange={handleChange} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Locale */}
        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Locale</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Default Language</label>
              <input type="text" name="systemLanguage" value={settings.systemLanguage} onChange={handleChange} className={inputCls} placeholder="en" />
            </div>
            <div>
              <label className={labelCls}>Date Format</label>
              <input type="text" name="dateFormat" value={settings.dateFormat} onChange={handleChange} className={inputCls} placeholder="d-m-Y" />
            </div>
            <div>
              <label className={labelCls}>Time Zone</label>
              <input type="text" name="timeZone" value={settings.timeZone} onChange={handleChange} className={inputCls} placeholder="UTC" />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Branding</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>System Logo URL</label>
              <input type="text" name="systemLogo" value={settings.systemLogo} onChange={handleChange} className={inputCls} placeholder="/assets/img/logo.png" />
            </div>
            <div>
              <label className={labelCls}>System Icon URL</label>
              <input type="text" name="systemIcon" value={settings.systemIcon} onChange={handleChange} className={inputCls} placeholder="/assets/img/favicon.png" />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center space-x-3">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center space-x-2 px-5 py-2 bg-[#d43533] text-white text-xs font-bold rounded shadow-xs hover:bg-[#b82a28] transition-colors disabled:opacity-60"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isPending ? "Saving..." : "Save Settings"}</span>
          </button>
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Saved successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
