"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Truck, Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"

export function DeliveryBoyLoginView() {
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState("deliveryboy@example.com")
  const [password, setPassword] = useState("password123")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const res = await login(email, password)
      if (res.success) {
        router.push(res.redirectTo || "/delivery-boy/dashboard")
        router.refresh()
      } else {
        setErrorMessage(res.error || "Invalid email or password.")
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during login.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#f8f9fa] min-h-[85vh] py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="rounded border border-gray-200 bg-white p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto size-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Truck className="size-6" />
            </div>
            <h1 className="text-xl font-bold uppercase text-gray-900">
              Delivery Boy Portal
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Login to view and update your assigned dispatch deliveries
            </p>
          </div>

          {/* Demo Fill Pill */}
          <div className="mb-4 p-2.5 rounded bg-gray-50 border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Demo Account:</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail("deliveryboy@example.com")
                setPassword("password123")
              }}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded text-[11px] font-bold text-emerald-700 transition-colors"
            >
              Fill Credentials
            </button>
          </div>

          {errorMessage && (
            <div className="rounded border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700 flex items-center gap-2 mb-4">
              <span className="font-bold">⚠</span>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Email or Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deliveryboy@example.com"
                  className="w-full rounded border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded border border-gray-300 pl-9 pr-10 py-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-3.5 w-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Remember Me</span>
              </label>
              <Link href="/forgot-password" className="font-semibold text-emerald-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded bg-emerald-600 py-2.5 font-bold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Logging In..." : "Log In as Delivery Boy"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-100 pt-4">
            Are you a customer?{" "}
            <Link href="/login" className="font-bold text-[#d43533] hover:underline">
              Customer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
