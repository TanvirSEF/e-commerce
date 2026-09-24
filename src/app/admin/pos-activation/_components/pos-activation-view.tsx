"use client"

import React, { useState, useTransition } from "react"
import {
  Settings,
  Printer,
  CheckCircle2,
  AlertCircle,
  Save,
  Barcode,
  Store,
} from "lucide-react"
import { updatePosConfigAction } from "@/app/actions/ecommerce-actions"
import type { PosConfigSettings } from "@/services/pos-service"

interface PosActivationViewProps {
  initialConfig: PosConfigSettings
}

export function PosActivationView({ initialConfig }: PosActivationViewProps) {
  const [config, setConfig] = useState<PosConfigSettings>(initialConfig)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await updatePosConfigAction(config)
      if (res.success) {
        setFeedback({ type: "success", text: "POS hardware & terminal settings saved!" })
      } else {
        setFeedback({ type: "error", text: "Failed to update POS settings" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-[#d43533]" />
          POS Configuration & Terminal Setup
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure thermal printer layout, barcode scanner defaults, and retail cash register options
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Card 1: Thermal Receipt Printer */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-[#d43533]">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Thermal Receipt Printer</h2>
              <p className="text-[11px] text-gray-500">Receipt paper roll dimension</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Printer Paper Roll Width
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setConfig({ ...config, thermalPrinterWidth: "80mm" })}
                className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition ${
                  config.thermalPrinterWidth === "80mm"
                    ? "border-[#d43533] bg-red-50/50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-gray-900 block">80mm Width</span>
                  <span className="text-[11px] text-gray-500">Standard 3-inch POS printer</span>
                </div>
                <input
                  type="radio"
                  name="printerWidth"
                  checked={config.thermalPrinterWidth === "80mm"}
                  onChange={() => setConfig({ ...config, thermalPrinterWidth: "80mm" })}
                  className="text-[#d43533]"
                />
              </label>

              <label
                onClick={() => setConfig({ ...config, thermalPrinterWidth: "58mm" })}
                className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition ${
                  config.thermalPrinterWidth === "58mm"
                    ? "border-[#d43533] bg-red-50/50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-gray-900 block">58mm Width</span>
                  <span className="text-[11px] text-gray-500">Compact 2-inch mini printer</span>
                </div>
                <input
                  type="radio"
                  name="printerWidth"
                  checked={config.thermalPrinterWidth === "58mm"}
                  onChange={() => setConfig({ ...config, thermalPrinterWidth: "58mm" })}
                  className="text-[#d43533]"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs font-semibold text-gray-900 block">Auto-Print After Sale</span>
              <span className="text-[11px] text-gray-500">Automatically open print dialog upon checkout</span>
            </div>
            <button
              type="button"
              onClick={() => setConfig({ ...config, printAfterSale: !config.printAfterSale })}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                config.printAfterSale ? "bg-emerald-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  config.printAfterSale ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Card 2: Barcode & Cashier Rules */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Barcode className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Barcode & Scanning</h2>
              <p className="text-[11px] text-gray-500">Laser scanner & input preferences</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-900 block">Barcode Scanning Mode</span>
              <span className="text-[11px] text-gray-500">Focus barcode input automatically</span>
            </div>
            <button
              type="button"
              onClick={() => setConfig({ ...config, enableBarcodeScanner: !config.enableBarcodeScanner })}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                config.enableBarcodeScanner ? "bg-emerald-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  config.enableBarcodeScanner ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Default Walk-in Customer Label
            </label>
            <input
              type="text"
              value={config.defaultCustomerName}
              onChange={(e) => setConfig({ ...config, defaultCustomerName: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#d43533] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition"
            >
              <Save className="w-4 h-4" />
              {isPending ? "Saving..." : "Save POS Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
