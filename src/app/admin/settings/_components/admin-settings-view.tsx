"use client"

import React, { useState } from "react"
import { Save, Check } from "lucide-react"

interface AdminSettingsViewProps {
  initialSettings: {
    siteName: string
    siteMotto: string
    currencySymbol: string
    currencyCode: string
    helpline: string
    email: string
  }
}

export function AdminSettingsView({ initialSettings }: AdminSettingsViewProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">General Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Configure platform branding, contact info, and currency</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-sm shadow-xs p-6 space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            System Title / Name
          </label>
          <input
            type="text"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            className="w-full max-w-md px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            System Motto
          </label>
          <input
            type="text"
            name="siteMotto"
            value={settings.siteMotto}
            onChange={handleChange}
            className="w-full max-w-md px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Currency Symbol</label>
            <input
              type="text"
              name="currencySymbol"
              value={settings.currencySymbol}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Currency Code</label>
            <input
              type="text"
              name="currencyCode"
              value={settings.currencyCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Customer Helpline</label>
          <input
            type="text"
            name="helpline"
            value={settings.helpline}
            onChange={handleChange}
            className="w-full max-w-md px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
          <input
            type="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
            className="w-full max-w-md px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center space-x-3">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-5 py-2 bg-[#d43533] text-white text-xs font-bold rounded shadow-xs hover:bg-[#b82a28] transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
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
