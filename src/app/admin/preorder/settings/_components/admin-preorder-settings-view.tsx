"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { Clock, ArrowLeft, Save, CheckCircle2, AlertCircle } from "lucide-react"
import { updatePreorderSettingsAction } from "@/app/actions/ecommerce-actions"
import type { PreorderSettings } from "@/services/preorder-service"

interface AdminPreorderSettingsViewProps {
  initialSettings: PreorderSettings
}

export function AdminPreorderSettingsView({ initialSettings }: AdminPreorderSettingsViewProps) {
  const [settings, setSettings] = useState<PreorderSettings>(initialSettings)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await updatePreorderSettingsAction(settings)
      if (res.success) {
        setFeedback({ type: "success", text: "Pre-order settings saved successfully" })
      } else {
        setFeedback({ type: "error", text: "Failed to update settings" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/preorder/products"
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#d43533]" />
            Pre-Order Configuration
          </h1>
          <p className="text-xs text-gray-500">Configure global advance deposits, cancellation windows, and notification triggers</p>
        </div>
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

      <form onSubmit={handleSave} className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Default Prepayment Deposit (%)
            </label>
            <input
              type="number"
              min={5}
              max={100}
              value={settings.defaultPrepaymentPercent}
              onChange={(e) =>
                setSettings({ ...settings, defaultPrepaymentPercent: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
            <p className="text-[11px] text-gray-400 mt-1">Percentage of total price collected upfront</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Minimum Manufacturing Lead Time (Days)
            </label>
            <input
              type="number"
              min={1}
              value={settings.minimumLeadDays}
              onChange={(e) =>
                setSettings({ ...settings, minimumLeadDays: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Customer Cancellation Grace Window (Days)
            </label>
            <input
              type="number"
              min={0}
              value={settings.allowCancellationDays}
              onChange={(e) =>
                setSettings({ ...settings, allowCancellationDays: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Automated Reminders Before Release (Days)
            </label>
            <input
              type="number"
              min={1}
              value={settings.autoReminderDaysBeforeRelease}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  autoReminderDaysBeforeRelease: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-800 block">
              Notify Sellers on New Booking
            </span>
            <span className="text-[11px] text-gray-500">
              Send automated email & notification to vendor upon deposit payment
            </span>
          </div>
          <label className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
            <input
              type="checkbox"
              checked={settings.notifySellerOnBooking}
              onChange={(e) =>
                setSettings({ ...settings, notifySellerOnBooking: e.target.checked })
              }
              className="sr-only"
            />
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                settings.notifySellerOnBooking ? "translate-x-4 bg-white" : "translate-x-0"
              }`}
            />
            <span
              className={`absolute inset-0 rounded-full transition-colors -z-10 ${
                settings.notifySellerOnBooking ? "bg-emerald-500" : "bg-gray-200"
              }`}
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
