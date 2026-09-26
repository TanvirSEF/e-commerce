"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Save, UploadCloud } from "lucide-react"
import { createProductAction } from "@/app/actions/ecommerce-actions"
import { ProductVariationMatrix, VariantItem } from "./product-variation-matrix"

interface CategoryOption {
  id: string | number
  name: string
  slug: string
}

interface BrandOption {
  id: string | number
  name: string
  slug: string
}

interface AdminProductCreateViewProps {
  categories: CategoryOption[]
  brands: BrandOption[]
}

export function AdminProductCreateView({ categories, brands }: AdminProductCreateViewProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    categoryId: categories[0]?.id || 1,
    brandId: brands[0]?.id || 1,
    unit: "pc",
    unitPrice: "",
    purchasePrice: "",
    discount: "0",
    discountType: "percent" as "percent" | "amount",
    stock: "20",
    sku: "",
    description: "",
    thumbnail: "/assets/img/placeholder.jpg",
  })

  const [variations, setVariations] = useState<VariantItem[]>([])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        name: formData.name,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        unit: formData.unit,
        unitPrice: parseFloat(formData.unitPrice) || 0,
        purchasePrice: parseFloat(formData.purchasePrice) || parseFloat(formData.unitPrice) || 0,
        discount: parseFloat(formData.discount) || 0,
        discountType: formData.discountType,
        currentStock: parseInt(formData.stock, 10) || 10,
        sku: formData.sku || `SKU-${Date.now().toString().slice(-6)}`,
        description: formData.description,
        thumbnailImg: formData.thumbnail,
        variations: variations.map((v) => ({
          variant: v.variant,
          sku: v.sku,
          price: v.price,
          stock: v.stock,
        })),
      }

      const res = await createProductAction(payload)
      if (res) {
        router.push("/admin/products")
      } else {
        alert("Failed to save product to database.")
      }
    } catch (err) {
      console.error("Error creating product:", err)
      alert("An error occurred while saving the product.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="p-1.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Add New Product</h1>
            <p className="text-xs text-slate-500">
              Fill in the required information to publish to catalog (Laravel 1:1)
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center space-x-2 px-5 py-2 bg-[#d43533] text-white text-xs font-bold rounded shadow-xs hover:bg-[#b82a28] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Saving..." : "Save & Publish"}</span>
        </button>
      </div>

      {/* 1. Product General Information */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
          Product Information
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Slim Fit Cotton Formal Shirt"
            className="w-full px-3.5 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g. pc, kg, pack"
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>
      </div>

      {/* 2. Product Pricing & Stock */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
          Product Price & Stock
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Unit Price (৳) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="unitPrice"
              required
              value={formData.unitPrice}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Discount</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Discount Type</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
            >
              <option value="percent">Percent (%)</option>
              <option value="amount">Flat (৳)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Total Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              required
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Base SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g. PROD-SKU-001"
            className="w-full max-w-sm px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>
      </div>

      {/* 3. Product Variations & SKU Combination Matrix (Laravel 1:1) */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
          Product Variations & Attribute Matrix
        </h2>
        <ProductVariationMatrix
          basePrice={parseFloat(formData.unitPrice) || 0}
          baseSku={formData.sku || formData.name.slice(0, 4).toUpperCase()}
          onVariantsChange={setVariations}
        />
      </div>

      {/* 4. Product Description */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">
          Description & Details
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Product Description</label>
          <textarea
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed features, specifications, and warranty info..."
            className="w-full p-3 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Product Thumbnail</label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors bg-slate-50">
            <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-xs font-semibold text-slate-700">Choose images to upload</p>
            <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WebP up to 5MB</p>
          </div>
        </div>
      </div>
    </form>
  )
}
