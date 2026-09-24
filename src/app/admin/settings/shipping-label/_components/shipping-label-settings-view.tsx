"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Printer, Save, CheckCircle2, ChevronLeft, QrCode, Barcode, PackageCheck, RefreshCw } from "lucide-react"
import { type ShippingLabelSettings } from "@/services/settings-service"
import { updateShippingLabelSettingsAction } from "@/app/actions/ecommerce-actions"

interface ShippingLabelSettingsViewProps {
  initialSettings: ShippingLabelSettings
}

export function ShippingLabelSettingsView({ initialSettings }: ShippingLabelSettingsViewProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)
    try {
      await updateShippingLabelSettingsAction(settings)
      setFeedback("Shipping label layout and print presets saved successfully!")
      setTimeout(() => setFeedback(null), 3000)
    } catch {
      setFeedback("Failed to update shipping label settings.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#d43533] flex items-center justify-center shrink-0">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Shipping Label Settings</h1>
            <p className="text-xs text-gray-500">
              Configure printable thermal shipping label formats, layout and barcode preferences
            </p>
          </div>
        </div>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Settings</span>
        </Link>
      </div>

      {feedback && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
        {/* Label Size Preset */}
        <div className="space-y-3">
          <label className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-[#d43533]" />
            <span>Label Size Preset</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "4x6", label: "4 x 6 inches (Standard Thermal)" },
              { id: "4x4", label: "4 x 4 inches (Square)" },
              { id: "3x4", label: "3 x 4 inches (Compact)" },
              { id: "2x3", label: "2 x 3 inches (Mini Tag)" },
            ].map((preset) => (
              <label
                key={preset.id}
                className={`p-3 border rounded-xl cursor-pointer text-center transition-colors ${
                  settings.labelSizePreset === preset.id
                    ? "border-blue-600 bg-blue-50/40 text-blue-900 font-bold"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs"
                }`}
              >
                <input
                  type="radio"
                  name="labelSizePreset"
                  value={preset.id}
                  checked={settings.labelSizePreset === preset.id}
                  onChange={(e) =>
                    setSettings({ ...settings, labelSizePreset: e.target.value as any })
                  }
                  className="hidden"
                />
                <span className="block text-sm mb-1 font-mono">{preset.id}</span>
                <span className="text-[11px] text-gray-500 block">{preset.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Barcode Type */}
        <div className="space-y-3">
          <label className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
            <Barcode className="w-4 h-4 text-[#d43533]" />
            <span>Barcode & Encoding Type</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "code128", label: "Code 128 (Recommended)" },
              { id: "code39", label: "Code 39" },
              { id: "qrcode", label: "QR Code" },
            ].map((bc) => (
              <label
                key={bc.id}
                className={`p-3 border rounded-xl cursor-pointer text-center transition-colors ${
                  settings.barcodeType === bc.id
                    ? "border-blue-600 bg-blue-50/40 text-blue-900 font-bold"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs"
                }`}
              >
                <input
                  type="radio"
                  name="barcodeType"
                  value={bc.id}
                  checked={settings.barcodeType === bc.id}
                  onChange={(e) =>
                    setSettings({ ...settings, barcodeType: e.target.value as any })
                  }
                  className="hidden"
                />
                <span className="block text-xs sm:text-sm font-semibold">{bc.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sender Info */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <h2 className="text-xs sm:text-sm font-bold text-gray-800">
            Dispatch Origin / Sender Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Sender Business Name</label>
              <input
                type="text"
                value={settings.senderName}
                onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Sender Contact Phone</label>
              <input
                type="text"
                value={settings.senderPhone}
                onChange={(e) => setSettings({ ...settings, senderPhone: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Sender Warehouse Address</label>
            <input
              type="text"
              value={settings.senderAddress}
              onChange={(e) => setSettings({ ...settings, senderAddress: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showQrCode}
              onChange={(e) => setSettings({ ...settings, showQrCode: e.target.checked })}
              className="w-4 h-4 text-[#d43533] rounded border-gray-300 focus:ring-[#d43533]"
            />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Print Tracking QR Code on label margin
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showItemTable}
              onChange={(e) => setSettings({ ...settings, showItemTable: e.target.checked })}
              className="w-4 h-4 text-[#d43533] rounded border-gray-300 focus:ring-[#d43533]"
            />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Include order packaging items summary list on label
            </span>
          </label>
        </div>

        <div className="pt-4 border-t border-gray-100 text-right">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] disabled:bg-gray-300 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
