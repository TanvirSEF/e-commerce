"use client"

import React, { useState } from "react"
import { DollarSign, Save, Plus, CheckCircle, RefreshCw } from "lucide-react"
import { updateCurrencySettingsAction } from "@/app/actions/ecommerce-actions"
import type { CurrencySettings, CurrencyItem } from "@/services/settings-service"

interface CurrenciesSettingsViewProps {
  initialSettings: CurrencySettings
}

export function CurrenciesSettingsView({
  initialSettings,
}: CurrenciesSettingsViewProps) {
  const [settings, setSettings] = useState<CurrencySettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  // Add Currency Form
  const [newName, setNewName] = useState("")
  const [newSymbol, setNewSymbol] = useState("")
  const [newCode, setNewCode] = useState("")
  const [newRate, setNewRate] = useState("1")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateCurrencySettingsAction(settings)
      setSuccessMsg("Currency formats and exchange rates updated successfully!")
      setTimeout(() => setSuccessMsg(""), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSetDefault = (code: string) => {
    setSettings((prev) => ({
      ...prev,
      defaultCurrencyCode: code,
      currencies: prev.currencies.map((c) => ({
        ...c,
        isDefault: c.code === code,
      })),
    }))
  }

  const handleToggleStatus = (id: number) => {
    setSettings((prev) => ({
      ...prev,
      currencies: prev.currencies.map((c) =>
        c.id === id ? { ...c, status: !c.status } : c
      ),
    }))
  }

  const handleRateChange = (id: number, val: number) => {
    setSettings((prev) => ({
      ...prev,
      currencies: prev.currencies.map((c) =>
        c.id === id ? { ...c, exchangeRate: val } : c
      ),
    }))
  }

  const handleAddCurrency = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newCode.trim()) return

    const newCurr: CurrencyItem = {
      id: Date.now(),
      name: newName.trim(),
      symbol: newSymbol.trim() || newCode.trim(),
      code: newCode.trim().toUpperCase(),
      exchangeRate: Number(newRate) || 1,
      isDefault: false,
      status: true,
    }

    setSettings((prev) => ({
      ...prev,
      currencies: [...prev.currencies, newCurr],
    }))

    setNewName("")
    setNewSymbol("")
    setNewCode("")
    setNewRate("1")
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#d43533]" />
          Multi-Currency & Exchange Rates
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure default marketplace billing currency, live forex rates, and customer display formats
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Top 2 Cards: System Default & Formatting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">System Default Currency</h2>
          <p className="text-[11px] text-slate-500">
            All prices in catalog & database are calculated based on this reference currency
          </p>
          <div className="flex gap-2">
            <select
              value={settings.defaultCurrencyCode}
              onChange={(e) => handleSetDefault(e.target.value)}
              className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded font-semibold text-slate-800 bg-white"
            >
              {settings.currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.symbol} {c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Currency Symbol Placement</h2>
          <p className="text-[11px] text-slate-500">
            Control how currency symbols render next to item prices on storefront
          </p>
          <select
            value={settings.symbolFormat}
            onChange={(e) =>
              setSettings({ ...settings, symbolFormat: e.target.value as any })
            }
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white font-medium"
          >
            <option value="symbol_amount">[Symbol][Amount] - e.g. ৳1250</option>
            <option value="symbol_space_amount">[Symbol] [Amount] - e.g. ৳ 1250</option>
            <option value="amount_symbol">[Amount][Symbol] - e.g. 1250৳</option>
            <option value="amount_space_symbol">[Amount] [Symbol] - e.g. 1250 ৳</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currencies & Rates Table (2 Cols) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Exchange Rates</h2>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? "Saving..." : "Save Rates"}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Currency</th>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Exchange Rate</th>
                    <th className="px-4 py-3 text-right">Default</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {settings.currencies.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-800">{c.name}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{c.symbol}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">{c.code}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.001"
                          min="0.001"
                          disabled={c.isDefault}
                          value={c.exchangeRate}
                          onChange={(e) => handleRateChange(c.id, Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-slate-300 rounded text-xs font-bold font-mono disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {c.isDefault ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                            Default
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(c.code)}
                            className="text-[11px] text-blue-600 hover:underline font-semibold"
                          >
                            Set Default
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>
        </div>

        {/* Add New Currency (1 Col) */}
        <div>
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 space-y-3 sticky top-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#d43533]" />
              Add New Currency
            </h3>

            <form onSubmit={handleAddCurrency} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Currency Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Canadian Dollar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Symbol</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. C$"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Currency Code (ISO)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CAD"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Exchange Rate</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="e.g. 88.5"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] transition-colors"
              >
                Add Currency
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
