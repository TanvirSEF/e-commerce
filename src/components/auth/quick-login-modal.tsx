"use client"

import React, { useState } from "react"
import Link from "next/link"
import { X, Lock, Mail, Loader2, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"

interface QuickLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function QuickLoginModal({ isOpen, onClose, onSuccess }: QuickLoginModalProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await login(email, password)
      if (res.success) {
        onSuccess?.()
        onClose()
      } else {
        setError(res.error || "Invalid email or password")
      }
    } catch {
      setError("An unexpected error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemo = (role: "admin" | "seller" | "customer") => {
    if (role === "admin") {
      setEmail("admin@example.com")
      setPassword("123456")
    } else if (role === "seller") {
      setEmail("seller@example.com")
      setPassword("123456")
    } else {
      setEmail("customer@example.com")
      setPassword("123456")
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-base font-bold text-gray-900">Sign In to Your Account</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Demo Fast Login Pills */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
            Quick Demo Login:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo("customer")}
              className="px-2.5 py-1 bg-white border border-gray-200 hover:border-gray-300 rounded text-[11px] font-semibold text-gray-700"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("seller")}
              className="px-2.5 py-1 bg-white border border-gray-200 hover:border-gray-300 rounded text-[11px] font-semibold text-gray-700"
            >
              Seller
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("admin")}
              className="px-2.5 py-1 bg-white border border-gray-200 hover:border-gray-300 rounded text-[11px] font-semibold text-gray-700"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email or Phone
            </label>
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
              />
              <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <Link
                href="/forgot-password"
                onClick={onClose}
                className="text-[11px] text-[#d43533] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
              />
              <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            onClick={onClose}
            className="text-[#d43533] font-bold hover:underline"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  )
}
