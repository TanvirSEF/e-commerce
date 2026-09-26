"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react"
import {
  sendPasswordResetCodeAction,
  resetPasswordWithCodeAction,
} from "@/app/actions/ecommerce-actions"

export function ForgotPasswordView() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [emailOrPhone, setEmailOrPhone] = useState("tanvir@example.com")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailOrPhone.trim()) return

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const res = await sendPasswordResetCodeAction({ emailOrPhone: emailOrPhone.trim() })
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message })
        if (res.code) setCode(res.code)
        setStep(2)
      } else {
        setStatusMessage({ type: "error", text: res.message })
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to send reset code." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: "error", text: "New password and confirmation do not match." })
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const res = await resetPasswordWithCodeAction({
        emailOrPhone: emailOrPhone.trim(),
        code: code.trim(),
        newPassword,
      })
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message })
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setStatusMessage({ type: "error", text: res.message })
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to reset password." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#f8f9fa] min-h-[85vh] py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="rounded border border-gray-200 bg-white shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Hero Graphic */}
          <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#d43533] to-[#9d1b1a] text-white p-8 flex-col justify-between">
            <div>
              <div className="text-xl font-extrabold uppercase tracking-wider mb-2">
                Active eCommerce
              </div>
              <p className="text-xs text-red-100 leading-relaxed">
                Securely reset your password and get back to managing your orders, cart, and exclusive rewards.
              </p>
            </div>

            <div className="space-y-3 py-6">
              <div className="rounded bg-white/10 p-3 text-xs backdrop-blur-sm">
                <p className="font-semibold text-white">Instant Account Recovery</p>
                <p className="text-[11px] text-red-100">Verification code sent directly to your email or phone</p>
              </div>
              <div className="rounded bg-white/10 p-3 text-xs backdrop-blur-sm">
                <p className="font-semibold text-white">Encrypted & Safe</p>
                <p className="text-[11px] text-red-100">End-to-end credential hashing & protection</p>
              </div>
            </div>

            <div className="text-[11px] text-red-200">
              © {new Date().getFullYear()} Active eCommerce CMS. All rights reserved.
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-2xl font-bold uppercase text-[#d43533]">
                {step === 1 ? "Forgot Password ?" : "Set New Password"}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {step === 1
                  ? "Enter your email or phone number to receive a verification reset code."
                  : "Enter the verification code along with your new account password."}
              </p>
            </div>

            {statusMessage && (
              <div
                className={`rounded border px-3.5 py-2.5 text-xs font-semibold mb-4 flex items-center gap-2 ${
                  statusMessage.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <span className="font-bold">⚠</span>
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email or Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="e.g. tanvir@example.com or +880 1712 345678"
                      className="w-full rounded border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded bg-[#d43533] py-2.5 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Sending Verification Code..." : "Send Reset Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Verification Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter 6-digit code (e.g. 123456)"
                      className="w-full rounded border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
                    />
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded bg-[#d43533] py-2.5 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Updating Password..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center text-xs text-gray-500">
              Remember your password?{" "}
              <Link href="/login" className="font-bold text-[#d43533] hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
