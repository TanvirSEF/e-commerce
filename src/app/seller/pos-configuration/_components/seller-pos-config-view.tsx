"use client"

import React, { useState, useTransition } from "react"
import { Printer, Save, CheckCircle2, AlertCircle, Scan, Receipt, UserCheck } from "lucide-react"
import { updatePosConfigAction } from "@/app/actions/ecommerce-actions"
import type { PosConfigSettings } from "@/services/pos-service"

interface SellerPosConfigViewProps {
  initialConfig: PosConfigSettings
  shopId: number
  shopName: string
}

export function SellerPosConfigView({
  initialConfig,
  shopId,
  shopName,
}: SellerPosConfigViewProps) {
  const [config, setConfig] = useState<PosConfigSettings>(initialConfig)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const res = await updatePosConfigAction(config, shopId)
      if (res && res.success) {
        setFeedback({ type: "success", text: "POS Configuration successfully saved to database!" })
        setTimeout(() => setFeedback(null), 3000)
      } else {
        setFeedback({ type: "error", text: "Failed to update configuration. Please try again." })
      }
    })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Printer className="h-6 w-6 text-[#d43533]" />
          Vendor POS Configuration
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {shopName} &bull; Manage receipt paper size, barcode scanner behavior, and cashier defaults
        </p>
      </div>

      {/* Alert banner */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3.5 text-xs rounded-xl border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span className="font-semibold">{feedback.text}</span>
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-6">
        {/* Section 1: Thermal Printer Paper Width */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-gray-500" />
            Thermal Printer Paper Roll Width
          </label>
          <p className="text-[11px] text-gray-500">
            Select the width of your POS thermal receipt printer roll.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div
              onClick={() => setConfig({ ...config, thermalPrinterWidth: "80mm" })}
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                config.thermalPrinterWidth === "80mm"
                  ? "border-[#d43533] bg-red-50/50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900">80mm Paper Width</span>
                  {config.thermalPrinterWidth === "80mm" && (
                    <span className="h-2 w-2 rounded-full bg-[#d43533]" />
                  )}
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Standard desktop thermal receipt printers (EPSON, BIXOLON, Xprinter 80).
                </p>
              </div>
              <div className="mt-3 text-[10px] font-mono font-bold text-gray-400">
                Resolution: 576 dots / line
              </div>
            </div>

            <div
              onClick={() => setConfig({ ...config, thermalPrinterWidth: "58mm" })}
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                config.thermalPrinterWidth === "58mm"
                  ? "border-[#d43533] bg-red-50/50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900">58mm Paper Width</span>
                  {config.thermalPrinterWidth === "58mm" && (
                    <span className="h-2 w-2 rounded-full bg-[#d43533]" />
                  )}
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Compact handheld & Bluetooth wireless mini receipt printers.
                </p>
              </div>
              <div className="mt-3 text-[10px] font-mono font-bold text-gray-400">
                Resolution: 384 dots / line
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Barcode Scanner */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-gray-900 flex items-center gap-2">
                <Scan className="w-4 h-4 text-gray-500" />
                Barcode Scanner Auto-Add
              </label>
              <p className="text-[11px] text-gray-500">
                Immediately add product to cart when barcode scanner fires Enter key
              </p>
            </div>
            <input
              type="checkbox"
              checked={config.enableBarcodeScanner}
              onChange={(e) => setConfig({ ...config, enableBarcodeScanner: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
            />
          </div>
        </div>

        {/* Section 3: Receipt Behavior */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-gray-900 flex items-center gap-2">
                <Printer className="w-4 h-4 text-gray-500" />
                Auto-Prompt Print Receipt
              </label>
              <p className="text-[11px] text-gray-500">
                Automatically show thermal print dialog right after a counter sale is completed
              </p>
            </div>
            <input
              type="checkbox"
              checked={config.printAfterSale}
              onChange={(e) => setConfig({ ...config, printAfterSale: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
            />
          </div>
        </div>

        {/* Section 4: Receipt Header & Default Customer */}
        <div className="border-t border-gray-100 pt-4 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-gray-500" />
              Default Counter Customer Name
            </label>
            <input
              type="text"
              value={config.defaultCustomerName}
              onChange={(e) => setConfig({ ...config, defaultCustomerName: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
              placeholder="Walk-in Customer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-900">
              Receipt Header / Brand Name
            </label>
            <input
              type="text"
              value={config.invoiceTitle || ""}
              onChange={(e) => setConfig({ ...config, invoiceTitle: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
              placeholder={shopName}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#d43533] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving to Database..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  )
}
