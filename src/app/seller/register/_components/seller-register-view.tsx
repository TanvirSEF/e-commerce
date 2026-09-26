"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Store, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"

export function SellerRegisterView() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirmation: "",
    shopName: "",
    address: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (formData.password !== formData.passwordConfirmation) {
      setError("Passwords do not match!")
      return
    }

    setSubmitted(true)
    setTimeout(() => {
      router.push("/seller/login")
    }, 1500)
  }

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-10 flex items-center justify-center">
      <div className="max-w-xl w-full mx-4 bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-10">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-8">
          <div className="size-12 rounded-full bg-red-50 text-primary flex items-center justify-center mx-auto mb-3">
            <Store className="size-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900">
            Register Your Shop
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Start selling to millions of active customers on Active eCommerce CMS.
          </p>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle className="size-14 text-green-500 mx-auto" />
            <h2 className="text-lg font-bold text-gray-900">Application Submitted!</h2>
            <p className="text-xs text-gray-500">Our merchant onboarding team will review and verify your store. Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">
                <XCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <div className="border-b border-gray-100 pb-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Personal Information
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@business.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+880 1700 000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Re-type password"
                  value={formData.passwordConfirmation}
                  onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Shop Basic Info */}
            <div className="border-b border-gray-100 pb-2 mb-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Shop Information
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Shop Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Electronics, Fashion Hub"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Shop Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Market / Building, Street, City"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded text-xs font-bold bg-primary hover:bg-primary/90 text-white uppercase tracking-wider shadow-sm transition-all cursor-pointer"
              >
                Register Your Shop
              </button>
            </div>

            <div className="text-center text-xs text-gray-500 pt-3 border-t border-gray-100">
              Already have a seller account?{" "}
              <Link href="/seller/login" className="font-bold text-primary hover:underline">
                Login Now
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
