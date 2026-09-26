"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Package, Save, CheckCircle, XCircle } from "lucide-react"
import type { SeedCategory } from "@/db/seed/data"
import type { SeedBrand } from "@/db/seed/data"

interface SellerProductCreateViewProps {
  categories: SeedCategory[]
  brands: SeedBrand[]
}

interface ProductFormState {
  name: string
  sku: string
  categoryId: string
  brandId: string
  unitPrice: string
  purchasePrice: string
  discount: string
  discountType: "percent" | "amount"
  unit: string
  currentStock: string
  thumbnailImg: string
  description: string
  published: boolean
  todaysDeal: boolean
  featured: boolean
}

const initialForm: ProductFormState = {
  name: "",
  sku: "",
  categoryId: "",
  brandId: "",
  unitPrice: "",
  purchasePrice: "",
  discount: "0",
  discountType: "percent",
  unit: "pc",
  currentStock: "1",
  thumbnailImg: "",
  description: "",
  published: true,
  todaysDeal: false,
  featured: false,
}

export function SellerProductCreateView({ categories, brands }: SellerProductCreateViewProps) {
  const [form, setForm] = useState<ProductFormState>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const { createProductAction } = await import("@/app/actions/ecommerce-actions")
      const res = await createProductAction({
        name: form.name,
        categoryId: form.categoryId || undefined,
        brandId: form.brandId || undefined,
        unit: form.unit,
        unitPrice: parseFloat(form.unitPrice) || 0,
        purchasePrice: parseFloat(form.purchasePrice) || parseFloat(form.unitPrice) || 0,
        discount: parseFloat(form.discount) || 0,
        discountType: form.discountType,
        currentStock: parseInt(form.currentStock, 10) || 10,
        sku: form.sku || `SKU-${Date.now().toString().slice(-6)}`,
        description: form.description,
        thumbnailImg: form.thumbnailImg || "/assets/img/placeholder.jpg",
      })

      if (res) {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          setForm(initialForm)
        }, 2000)
      } else {
        setError("Failed to save product. Please try again.")
      }
    } catch (err) {
      console.error("Seller product create failed:", err)
      setError("Error saving product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/seller/products"
          className="p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Add New Product</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in the form below to list a new product in your store
          </p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm font-semibold">
          <CheckCircle className="w-4 h-4" />
          Product submitted for approval successfully!
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">
          <XCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            <Package className="w-4 h-4 inline mr-1 text-[#d43533]" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Premium Cotton T-Shirt"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g. TSHT-RED-L-001"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
              >
                <option value="pc">Piece (pc)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="litre">Litre</option>
                <option value="pair">Pair</option>
                <option value="set">Set</option>
                <option value="box">Box</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Brand</label>
              <select
                name="brandId"
                value={form.brandId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit Price (৳) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="e.g. 1299"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Purchase Price (৳)
              </label>
              <input
                type="number"
                name="purchasePrice"
                value={form.purchasePrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Your cost"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Stock <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                name="currentStock"
                value={form.currentStock}
                onChange={handleChange}
                min="0"
                placeholder="Available quantity"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Discount</label>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                min="0"
                max="100"
                placeholder="0"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Discount Type</label>
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
              >
                <option value="percent">Percentage (%)</option>
                <option value="amount">Flat Amount (৳)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Thumbnail & Description */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Product Media & Description
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thumbnail Image URL
              </label>
              <input
                type="url"
                name="thumbnailImg"
                value={form.thumbnailImg}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Upload your images to a CDN and paste the URL here
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Description
              </label>
              <textarea
                rows={5}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product in detail..."
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>
        </div>

        {/* Flags */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Visibility Settings
          </h2>
          <div className="flex flex-wrap gap-6">
            {[
              { name: "published", label: "Published (Visible in catalog)" },
              { name: "featured", label: "Mark as Featured" },
              { name: "todaysDeal", label: "Include in Today's Deal" },
            ].map((flag) => (
              <label key={flag.name} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name={flag.name}
                  checked={form[flag.name as keyof ProductFormState] as boolean}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 text-[#d43533] accent-[#d43533]"
                />
                {flag.label}
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href="/seller/products"
            className="px-4 py-2 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Submit for Approval"}
          </button>
        </div>
      </form>
    </div>
  )
}
