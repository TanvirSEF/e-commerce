"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tag, ArrowLeft, Upload, Save, AlertCircle } from "lucide-react"
import { createCustomerProductAction } from "@/app/actions/ecommerce-actions"

const CATEGORIES = [
  "Cellphones & Tabs",
  "Gaming & Consoles",
  "Automobile & Bikes",
  "Computer & Accessories",
  "Consumer Electronics",
  "Home & Furniture",
  "Fashion & Accessories",
]

const CONDITIONS = [
  "Used - Like New",
  "Used - Good",
  "Used - Fair",
  "Brand New / Unopened",
]

export function CustomerProductCreateView() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    category: "Cellphones & Tabs",
    condition: "Used - Like New",
    unitPrice: "",
    customerName: "Sakib Al Hasan",
    customerPhone: "+880 1711-889900",
    customerEmail: "sakib.user@gmail.com",
    location: "Dhanmondi, Dhaka",
    thumbnailImg: "/assets/img/products/1.jpg",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.unitPrice || !formData.customerPhone) {
      setErrorMsg("Please complete all required fields marked with *")
      return
    }

    setSubmitting(true)
    setErrorMsg("")

    try {
      await createCustomerProductAction({
        name: formData.name,
        category: formData.category,
        unitPrice: Number(formData.unitPrice),
        condition: formData.condition,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        location: formData.location,
        thumbnailImg: formData.thumbnailImg || undefined,
      })
      router.push("/dashboard/customer-products")
    } catch {
      setErrorMsg("Failed to post classified product. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/customer-products"
            className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to My Advertisements
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#d43533]" />
            Post New Classified Product
          </h1>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Product Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Apple iPhone 14 Pro Max 256GB Deep Purple"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-[#d43533]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Condition <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-[#d43533]"
            >
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Asking Price (৳ BDT) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 75000"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              City / Neighborhood <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dhanmondi, Dhaka"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Contact Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+880 1711-XXXXXX"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Photo URL / Image Path
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="/assets/img/products/1.jpg"
              value={formData.thumbnailImg}
              onChange={(e) => setFormData({ ...formData, thumbnailImg: e.target.value })}
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
            />
            <button
              type="button"
              className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Detailed Description & Specs
          </label>
          <textarea
            rows={4}
            placeholder="Describe product condition, purchase date, box/accessories included, reason for selling..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full text-xs border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
          <Link
            href="/dashboard/customer-products"
            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Publishing Ad..." : "Publish Classified Ad"}
          </button>
        </div>
      </form>
    </div>
  )
}
