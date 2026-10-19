"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react"
import { createCustomerAdminAction } from "@/app/actions/customer-actions"

export default function CreateCustomerPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and Email are required.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await createCustomerAdminAction({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        password: formData.password || undefined,
      })

      if (res.success) {
        router.push("/admin/customers")
      } else {
        setError(res.error || "Failed to create customer")
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/customers"
            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Add New Customer</h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h5 className="text-sm font-semibold text-gray-800">Customer Information</h5>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. customer@example.com"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +8801700000000"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Default: Customer@123"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-400"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Leave blank to automatically use default temporary password: Customer@123
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <Link
              href="/admin/customers"
              className="px-4 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#1d3557] text-white text-xs font-semibold rounded hover:bg-[#16304d] disabled:opacity-50 transition-colors shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
