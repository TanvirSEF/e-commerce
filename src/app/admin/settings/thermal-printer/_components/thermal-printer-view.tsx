"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Printer, ChevronLeft, Save, CheckCircle } from "lucide-react"

export function ThermalPrinterView() {
  const [enabled, setEnabled] = useState(true)
  const [fields, setFields] = useState({
    show_logo: true,
    show_tracking_code: true,
    show_platform_contact: true,
    show_seller_contact: true,
    show_sku: true,
    show_product_variation: true,
    show_barcode: true,
    show_qr_code: true,
  })
  const [saved, setSaved] = useState(false)

  const toggleField = (key: keyof typeof fields) => {
    setFields((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const fieldLabels: Record<keyof typeof fields, string> = {
    show_logo: "Show Logo",
    show_tracking_code: "Show Tracking Code",
    show_platform_contact: "Show Platform Contact",
    show_seller_contact: "Show Seller Contact",
    show_sku: "Show SKU",
    show_product_variation: "Show Product Variation",
    show_barcode: "Show Barcode",
    show_qr_code: "Show QR Code",
  }

  return (
    <div className="space-y-6">
      {/* Top Banner (1:1 with Active eCommerce thermal_printer.blade.php) */}
      <div className="border border-gray-200 bg-white rounded-xl p-4 sm:p-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#d43533] flex items-center justify-center shrink-0">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">Thermal Printer</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure thermal invoice to ensure accurate and professional order documentation.
            </p>
          </div>
        </div>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-lg transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Business Settings
        </Link>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Thermal printer configuration updated successfully!
        </div>
      )}

      {/* Main Settings Card */}
      <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
        {/* Toggle master */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Generate Invoice for Thermal Printer</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Enable standard 80mm / 58mm POS thermal receipt format for quick printing
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d43533]"></div>
          </label>
        </div>

        {/* Content Fields */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Invoice Content Fields for Thermal Printer
          </h4>
          <p className="text-xs text-gray-400">
            Select elements to display on compact thermal receipts
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(Object.keys(fields) as Array<keyof typeof fields>).map((key) => {
              const isChecked = fields[key]
              return (
                <div
                  key={key}
                  onClick={() => toggleField(key)}
                  className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                    isChecked
                      ? "border-[#d43533]/40 bg-red-50/20"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="text-xs font-semibold text-gray-800">
                    {fieldLabels[key]}
                  </span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 text-[#d43533] rounded focus:ring-[#d43533] pointer-events-none"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-gray-100 text-right">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Thermal Configuration
          </button>
        </div>
      </form>
    </div>
  )
}
