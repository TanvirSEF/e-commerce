"use client"

import React, { useState, useTransition } from "react"
import { CheckCircle2, AlertCircle, Save } from "lucide-react"
import type { OtpLoginSettings } from "@/types/otp-sms"
import { updateOtpSettingsAction } from "@/app/actions/otp-sms-actions"

interface Props {
  initialSettings: OtpLoginSettings
}

export function OtpLoginView({ initialSettings }: Props) {
  const [settings, setSettings] = useState<OtpLoginSettings>(initialSettings)
  const [feedback, setFeedback] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (key: keyof OtpLoginSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        await updateOtpSettingsAction(settings)
        setFeedback({
          type: "success",
          text: "OTP configuration settings updated successfully!",
        })
      } catch {
        setFeedback({
          type: "error",
          text: "Failed to update OTP configuration.",
        })
      }
      setTimeout(() => setFeedback(null), 3500)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce Titlebar */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          OTP Login Configuration
        </h1>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded border transition-all ${
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Registration & Authentication */}
          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h5 className="text-sm font-semibold text-gray-800">
                Authentication & Registration OTP
              </h5>
            </div>
            <div className="p-5 space-y-4 text-xs">
              {/* Customer Registration OTP */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">
                    OTP for Customer Registration
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    Require SMS verification PIN to activate new customer accounts
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.otpCustomerRegistration}
                    onChange={() => handleToggle("otpCustomerRegistration")}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#28a745] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>

              {/* Password Reset OTP */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">
                    OTP for Password Reset
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    Verify customer mobile number via OTP when recovering password
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.otpPasswordReset}
                    onChange={() => handleToggle("otpPasswordReset")}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#28a745] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Order & Transaction Verification */}
          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h5 className="text-sm font-semibold text-gray-800">
                Orders & Checkout Verification
              </h5>
            </div>
            <div className="p-5 space-y-4 text-xs">
              {/* Cash On Delivery OTP */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">
                    OTP for Cash On Delivery (COD)
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    Prevent bogus orders by prompting SMS PIN before confirming COD checkout
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.otpCodVerification}
                    onChange={() => handleToggle("otpCodVerification")}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#28a745] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>

              {/* Order Placement OTP */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">
                    OTP for All Order Placements
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    Require SMS confirmation for all checkout payment methods
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.otpOrderVerification}
                    onChange={() => handleToggle("otpOrderVerification")}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#28a745] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>

              {/* Wallet Recharge OTP */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">
                    OTP for Wallet Recharge
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    Send OTP verification before crediting customer wallet
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.otpWalletRecharge}
                    onChange={() => handleToggle("otpWalletRecharge")}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#28a745] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            </div>
          </div>

          {/* Card 3: Logistics & Delivery Security */}
          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h5 className="text-sm font-semibold text-gray-800">
                Logistics & Delivery Boy Verification
              </h5>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">
                    OTP for Delivery Boy Package Handover
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    Delivery personnel must enter customer delivery PIN to mark package as delivered
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.otpDeliveryBoyVerification}
                    onChange={() => handleToggle("otpDeliveryBoyVerification")}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#28a745] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            </div>
          </div>

          {/* Card 4: Cooldown & Expiration Limits */}
          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h5 className="text-sm font-semibold text-gray-800">
                OTP Cooldown & Expiration Limits
              </h5>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  OTP Resend Cooldown (Seconds)
                </label>
                <input
                  type="number"
                  min="15"
                  max="300"
                  value={settings.otpResendDurationSec}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      otpResendDurationSec: parseInt(e.target.value) || 60,
                    })
                  }
                  className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  OTP Expiration Time (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.otpExpireDurationMin}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      otpExpireDurationMin: parseInt(e.target.value) || 5,
                    })
                  }
                  className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-[#1d3557] hover:bg-[#16304d] text-white rounded disabled:opacity-60 transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isPending ? "Saving Settings..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
