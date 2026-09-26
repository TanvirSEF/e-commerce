"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Store, Eye, EyeOff, CheckCircle } from "lucide-react"

export function SellerLoginView() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { loginAction } = await import("@/app/actions/ecommerce-actions")
      const res = await loginAction({ email, password })
      if (res.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push(res.redirectTo || "/seller/dashboard")
          router.refresh()
        }, 800)
      } else {
        setError(res.error || "Invalid seller credentials.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fillDemoSeller = () => {
    setEmail("seller@example.com")
    setPassword("password123")
  }

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-10 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-10">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-8">
          <div className="size-12 rounded-full bg-red-50 text-primary flex items-center justify-center mx-auto mb-3">
            <Store className="size-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900">
            Seller Login
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Access your store catalog, incoming orders, and earnings.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email or Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="seller@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <a href="#" className="text-[11px] text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded p-2.5 pr-8 focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">
              <span className="font-bold">⚠</span>
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Seller login successful! Redirecting to Merchant Portal...
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 rounded text-xs font-bold bg-primary hover:bg-primary/90 text-white uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Signing in..." : success ? "Redirecting..." : "Login to Seller Panel"}
            </button>
          </div>

          {/* Quick Demo Fill button */}
          <button
            type="button"
            onClick={fillDemoSeller}
            className="w-full py-2 rounded text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            Click here to fill Demo Seller credentials
          </button>

          <div className="text-center text-xs text-gray-500 pt-3 border-t border-gray-100">
            Don&apos;t have a seller account yet?{" "}
            <Link href="/seller/register" className="font-bold text-primary hover:underline">
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
