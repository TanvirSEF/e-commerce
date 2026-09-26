"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, User, Phone } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"

export function RegisterView() {
  const router = useRouter()
  const { register } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match!")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await register(name, email, password, phone, "customer")
      if (res.success) {
        router.push(res.redirectTo || "/dashboard")
        router.refresh()
      } else {
        setError(res.error || "Registration failed. Please try again.")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#f8f9fa] min-h-[85vh] py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="rounded border border-gray-200 bg-white shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Hero Banner */}
          <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#d43533] to-[#9d1b1a] text-white p-8 flex-col justify-between">
            <div>
              <div className="text-xl font-extrabold uppercase tracking-wider mb-2">
                Join Active eCommerce
              </div>
              <p className="text-xs text-red-100 leading-relaxed">
                Create an account to unlock fast checkout, real-time shipment tracking, personalized
                wishlist, and exclusive welcome coupons.
              </p>
            </div>

            <div className="space-y-3 py-6">
              <div className="rounded bg-white/10 p-3 text-xs backdrop-blur-sm">
                <p className="font-semibold text-white">🎁 Welcome Coupon 10% OFF</p>
                <p className="text-[11px] text-red-100">Automatically granted on your first purchase</p>
              </div>
              <div className="rounded bg-white/10 p-3 text-xs backdrop-blur-sm">
                <p className="font-semibold text-white">⭐ Earn Club Points</p>
                <p className="text-[11px] text-red-100">Redeem points for direct cash discounts</p>
              </div>
            </div>

            <div className="text-[11px] text-red-200">
              © {new Date().getFullYear()} Active eCommerce CMS. All rights reserved.
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <div className="mb-5">
              <h1 className="text-2xl font-bold uppercase text-[#d43533]">Create an Account.</h1>
              <p className="text-xs text-gray-500 mt-1">
                Register as a customer to start shopping
              </p>
            </div>

            {error && (
              <div className="rounded border border-red-200 bg-red-50 p-2.5 text-xs text-red-600 mb-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tanvir Ahmed"
                    className="w-full rounded border border-gray-300 pl-9 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
                  />
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tanvir@example.com"
                    className="w-full rounded border border-gray-300 pl-9 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1712 345678"
                    className="w-full rounded border border-gray-300 pl-9 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
                  />
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded border border-gray-300 pl-9 pr-8 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
                    />
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded border border-gray-300 pl-9 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
                    />
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
                  />
                  <span>
                    By signing up you agree to our{" "}
                    <Link href="/terms" className="font-semibold text-gray-900 underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="font-semibold text-gray-900 underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!agreed || isSubmitting}
                className="w-full rounded bg-[#d43533] py-2.5 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors disabled:opacity-50 mt-2"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-5 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#d43533] hover:underline">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
