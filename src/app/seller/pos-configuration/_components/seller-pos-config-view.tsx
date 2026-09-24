"use client"

import React, { useState } from "react"
import { Printer, Save, CheckCircle2 } from "lucide-react"

export function SellerPosConfigView() {
  const [paperWidth, setPaperWidth] = useState<"80mm" | "58mm">("80mm")
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Printer className="h-6 w-6 text-[#d43533]" />
          Vendor POS Configuration
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure hardware and thermal printer paper roll size for your store
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg border bg-emerald-50 text-emerald-800 border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs max-w-md space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-2">
            Thermal Printer Size
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaperWidth("80mm")}
              className={`p-3 rounded-xl border text-left transition ${
                paperWidth === "80mm"
                  ? "border-[#d43533] bg-red-50 text-[#d43533] font-bold"
                  : "border-gray-200 text-gray-700"
              }`}
            >
              80mm Width
            </button>
            <button
              type="button"
              onClick={() => setPaperWidth("58mm")}
              className={`p-3 rounded-xl border text-left transition ${
                paperWidth === "58mm"
                  ? "border-[#d43533] bg-red-50 text-[#d43533] font-bold"
                  : "border-gray-200 text-gray-700"
              }`}
            >
              58mm Width
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#d43533] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition"
        >
          <Save className="w-4 h-4" />
          Save Configuration
        </button>
      </form>
    </div>
  )
}
