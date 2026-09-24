"use client"

import React, { useState, useTransition } from "react"
import {
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Lock,
  ShoppingBag,
} from "lucide-react"
import { updateOtpSettingsAction } from "@/app/actions/ecommerce-actions"
import type { OtpLoginSettings } from "@/services/sms-service"

interface OtpLoginViewProps {
  initialSettings: OtpLoginSettings
}

export function OtpLoginView({ initialSettings }: OtpLoginViewProps) {
  const [settings, setSettings] = useState<OtpLoginSettings>(initialSettings)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateOtpSettingsAction(settings)
      if (res.success) {
        setFeedback({ type: "success", text: "OTP authentication rules updated successfully!" })
      } else {
        setFeedback({ type: "error", text: "Failed to update OTP rules" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-[#d43533]" />
          OTP Authentication & Verification Rules
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure SMS one-time PIN prompts for customer login, checkout security, and COD verification
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
        {/* Card 1: Login OTP */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-[#d43533]">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">OTP for Phone Login</h2>
                <p className="text-[11px] text-gray-500">Allow customers to log in using SMS verification PIN</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, otpLoginEnabled: !settings.otpLoginEnabled })}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.otpLoginEnabled ? "bg-emerald-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.otpLoginEnabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            When enabled, users can enter their phone number on the login page and receive a one-time 4-digit code without needing a password.
          </p>
        </div>

        {/* Card 2: Cash on Delivery OTP */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Cash On Delivery (COD) OTP</h2>
                <p className="text-[11px] text-gray-500">Prevent fake orders with SMS phone confirmation</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, otpCodVerification: !settings.otpCodVerification })}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.otpCodVerification ? "bg-emerald-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.otpCodVerification ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Demands an SMS OTP verification prompt before a Cash on Delivery order is finalized to dramatically reduce bogus deliveries.
          </p>
        </div>

        {/* Card 3: Checkout OTP */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">OTP on All Checkouts</h2>
                <p className="text-[11px] text-gray-500">Require OTP for every single order placement</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, otpOrderVerification: !settings.otpOrderVerification })}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.otpOrderVerification ? "bg-emerald-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.otpOrderVerification ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            If enabled, every purchase irrespective of payment gateway will mandate an OTP confirmation step.
          </p>
        </div>

        {/* Card 4: Resend Timer & Save */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
            OTP Expiration & Resend Window
          </h2>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Resend Wait Duration (seconds)
            </label>
            <input
              type="number"
              min="15"
              max="300"
              value={settings.otpResendDurationSec}
              onChange={(e) => setSettings({ ...settings, otpResendDurationSec: parseInt(e.target.value) || 60 })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono font-bold"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#d43533] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition"
            >
              <Save className="w-4 h-4" />
              {isPending ? "Saving..." : "Save OTP Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
