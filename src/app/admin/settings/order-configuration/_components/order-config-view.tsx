"use client"

import React, { useState, useTransition } from "react"
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
  Receipt,
  ShieldAlert,
} from "lucide-react"
import { updateOrderRulesAction } from "@/app/actions/ecommerce-actions"
import type { OrderRulesSettings } from "@/services/order-rules-service"

interface OrderConfigViewProps {
  initialRules: OrderRulesSettings
}

export function OrderConfigView({ initialRules }: OrderConfigViewProps) {
  const [rules, setRules] = useState<OrderRulesSettings>(initialRules)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateOrderRulesAction(rules)
      if (res.success) {
        setFeedback({ type: "success", text: "Order configuration updated successfully!" })
      } else {
        setFeedback({ type: "error", text: "Failed to update order rules" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-[#d43533]" />
          Order Rules & Configuration
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure minimum order thresholds, cancellation grace periods, and invoice numbering sequences
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
        {/* Card 1: Minimum Order Amount Check */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-[#d43533]">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Minimum Order Amount</h2>
                <p className="text-[11px] text-gray-500">Require carts to meet minimum checkout threshold</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRules({ ...rules, minOrderCheck: !rules.minOrderCheck })}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                rules.minOrderCheck ? "bg-emerald-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  rules.minOrderCheck ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Minimum Required Subtotal (৳)
            </label>
            <input
              type="number"
              min="0"
              step="50"
              disabled={!rules.minOrderCheck}
              value={rules.minOrderAmount}
              onChange={(e) => setRules({ ...rules, minOrderAmount: parseFloat(e.target.value) || 0 })}
              className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono font-bold ${
                !rules.minOrderCheck ? "bg-gray-50 text-gray-400" : "text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              }`}
            />
            <p className="text-[11px] text-gray-400 mt-1">
              If enabled, users cannot proceed to checkout if their subtotal is lower than this value.
            </p>
          </div>
        </div>

        {/* Card 2: Cancellation Grace Period */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Order Cancellation Window</h2>
              <p className="text-[11px] text-gray-500">Allow customers to cancel orders from account portal</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Allowed Cancellation Time (Hours)
            </label>
            <input
              type="number"
              min="1"
              max="168"
              value={rules.cancellationHours}
              onChange={(e) => setRules({ ...rules, cancellationHours: parseInt(e.target.value) || 0 })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Customer can only request cancellation within these hours after order placement while status is pending.
            </p>
          </div>
        </div>

        {/* Card 3: Invoice Prefix */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Invoice Number Format</h2>
              <p className="text-[11px] text-gray-500">Prefix sequence for PDF invoices and shipping slips</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Invoice Code Prefix
            </label>
            <input
              type="text"
              maxLength={10}
              value={rules.invoicePrefix}
              onChange={(e) => setRules({ ...rules, invoicePrefix: e.target.value.toUpperCase() })}
              placeholder="e.g. ORD or INV"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono font-bold uppercase text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Example generated invoice code: <span className="font-mono font-bold text-gray-700">{rules.invoicePrefix}-20260324-8492</span>
            </p>
          </div>
        </div>

        {/* Card 4: Action / Save Button */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              Real-time Business Enforcement
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Updates to order policies take effect immediately across all storefront carts, vendor consoles, and backend order processing workflows.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#d43533] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition"
            >
              <Save className="w-4 h-4" />
              {isPending ? "Saving..." : "Save Order Configuration"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
