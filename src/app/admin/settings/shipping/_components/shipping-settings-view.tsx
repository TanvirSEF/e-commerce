"use client"

import React, { useState } from "react"
import {
  Truck,
  MapPin,
  Save,
  CheckCircle,
  Package,
  Layers,
} from "lucide-react"
import { updateShippingSettingsAction } from "@/app/actions/ecommerce-actions"
import type { ShippingSettings } from "@/services/settings-service"

interface ShippingSettingsViewProps {
  initialSettings: ShippingSettings
}

export function ShippingSettingsView({
  initialSettings,
}: ShippingSettingsViewProps) {
  const [form, setForm] = useState<ShippingSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateShippingSettingsAction(form)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Shipping Configuration</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure delivery rates, area-wise shipping (Inside/Outside Dhaka), and free shipping thresholds
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4" />
          Shipping rates and delivery rules saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Shipping Type Selector Cards */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#d43533]" />
            Select Shipping Calculation Method
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Area-Wise */}
            <div
              onClick={() => setForm((f) => ({ ...f, shippingType: "area_wise" }))}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                form.shippingType === "area_wise"
                  ? "border-[#d43533] bg-red-50/20 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <MapPin className="w-5 h-5 text-[#d43533]" />
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    form.shippingType === "area_wise"
                      ? "border-[#d43533] bg-[#d43533]"
                      : "border-slate-300"
                  }`}
                >
                  {form.shippingType === "area_wise" && (
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </span>
              </div>
              <h3 className="font-bold text-xs text-slate-800 mb-1">
                Area-Wise Shipping
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Different delivery charges for Inside Dhaka vs Outside Dhaka districts.
              </p>
            </div>

            {/* Flat Rate */}
            <div
              onClick={() => setForm((f) => ({ ...f, shippingType: "flat_rate" }))}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                form.shippingType === "flat_rate"
                  ? "border-[#d43533] bg-red-50/20 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    form.shippingType === "flat_rate"
                      ? "border-[#d43533] bg-[#d43533]"
                      : "border-slate-300"
                  }`}
                >
                  {form.shippingType === "flat_rate" && (
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </span>
              </div>
              <h3 className="font-bold text-xs text-slate-800 mb-1">
                Flat Rate Shipping
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Uniform fixed delivery charge across the entire country for any order.
              </p>
            </div>

            {/* Product-Wise */}
            <div
              onClick={() => setForm((f) => ({ ...f, shippingType: "product_wise" }))}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                form.shippingType === "product_wise"
                  ? "border-[#d43533] bg-red-50/20 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Package className="w-5 h-5 text-amber-600" />
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    form.shippingType === "product_wise"
                      ? "border-[#d43533] bg-[#d43533]"
                      : "border-slate-300"
                  }`}
                >
                  {form.shippingType === "product_wise" && (
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </span>
              </div>
              <h3 className="font-bold text-xs text-slate-800 mb-1">
                Product-Wise Shipping
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Cost calculated based on individual product delivery costs configured on each item.
              </p>
            </div>
          </div>
        </div>

        {/* Rates & Delivery Estimates Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Area Rates & Delivery Time
          </h2>

          {form.shippingType === "area_wise" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inside Dhaka City Shipping Fee (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.insideDhakaCost}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, insideDhakaCost: Number(e.target.value) }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-bold text-slate-800 focus:outline-none focus:border-[#d43533]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Outside Dhaka Delivery Fee (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.outsideDhakaCost}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, outsideDhakaCost: Number(e.target.value) }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-bold text-slate-800 focus:outline-none focus:border-[#d43533]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Delivery Time (Inside Dhaka)
                </label>
                <input
                  type="text"
                  value={form.estimatedDaysInside}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, estimatedDaysInside: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Delivery Time (Outside Dhaka)
                </label>
                <input
                  type="text"
                  value={form.estimatedDaysOutside}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, estimatedDaysOutside: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Flat Delivery Fee Across Bangladesh (৳)
              </label>
              <input
                type="number"
                min="0"
                value={form.flatRateCost}
                onChange={(e) =>
                  setForm((f) => ({ ...f, flatRateCost: Number(e.target.value) }))
                }
                className="w-full sm:w-60 px-3 py-2 border border-slate-300 rounded text-xs font-bold text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          )}
        </div>

        {/* Free Shipping Threshold Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">
              Free Shipping Promotion
            </h2>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.freeShippingEnabled}
                onChange={(e) =>
                  setForm((f) => ({ ...f, freeShippingEnabled: e.target.checked }))
                }
                className="rounded text-[#d43533] focus:ring-[#d43533] w-4 h-4"
              />
              Enable Free Shipping
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Minimum Cart Order Amount for Free Shipping (৳)
            </label>
            <input
              type="number"
              min="0"
              disabled={!form.freeShippingEnabled}
              value={form.freeShippingThreshold}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  freeShippingThreshold: Number(e.target.value),
                }))
              }
              className="w-full sm:w-60 px-3 py-2 border border-slate-300 rounded text-xs font-bold text-slate-800 focus:outline-none focus:border-[#d43533] disabled:bg-slate-100 disabled:text-slate-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Customers whose cart subtotal exceeds this amount will get free shipping automatically at checkout.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Shipping Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
