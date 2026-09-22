"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"

export function LoginView() {
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState("tanvir@example.com")
  const [password, setPassword] = useState("password123")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      login(email, password)
      router.push("/dashboard")
    }, 400)
  }

  const handleSocialLogin = (provider: string) => {
    setIsSubmitting(true)
    setTimeout(() => {
      login(`${provider.toLowerCase()}@example.com`, "social-pass")
      router.push("/dashboard")
    }, 400)
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
                Experience seamless online shopping with thousands of verified products, flexible
                delivery, and exclusive discounts.
              </p>
            </div>

            <div className="space-y-3 py-6">
              <div className="rounded bg-white/10 p-3 text-xs backdrop-blur-sm">
                <p className="font-semibold text-white">100% Genuine Products</p>
                <p className="text-[11px] text-red-100">Directly sourced from trusted brands</p>
              </div>
              <div className="rounded bg-white/10 p-3 text-xs backdrop-blur-sm">
                <p className="font-semibold text-white">Safe & Secure Payment</p>
                <p className="text-[11px] text-red-100">bKash, Nagad, Cards & Cash on Delivery</p>
              </div>
            </div>

            <div className="text-[11px] text-red-200">
              © {new Date().getFullYear()} Active eCommerce CMS. All rights reserved.
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-2xl font-bold uppercase text-[#d43533]">Welcome Back !</h1>
              <p className="text-xs text-gray-500 mt-1">Login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email or Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johndoe@example.com"
                    className="w-full rounded border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Password */}
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
                    className="w-full rounded border border-gray-300 pl-9 pr-10 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
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

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
                  />
                  <span>Remember Me</span>
                </label>

                <a href="#forgot" className="text-xs font-semibold text-[#d43533] hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-[#d43533] py-2.5 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Logging In..." : "Log In"}
              </button>
            </form>

            {/* Social Logins */}
            <div className="mt-6 text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-400">Or Login With</span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="flex items-center justify-center gap-2 rounded border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex-1"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Facebook")}
                  className="flex items-center justify-center gap-2 rounded border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex-1"
                >
                  <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>

            {/* Register link */}
            <div className="mt-6 text-center text-xs text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-bold text-[#d43533] hover:underline">
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
