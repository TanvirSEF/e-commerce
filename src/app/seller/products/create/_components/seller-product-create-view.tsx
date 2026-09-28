"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, CheckCircle, XCircle, X } from "lucide-react"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"
import type { SeedCategory, SeedBrand } from "@/db/seed/data"
import type { ProductEditInitial } from "@/services/product-service"
import { SellerProductBasicInfo } from "./seller-product-basic-info"
import { SellerProductPricing } from "./seller-product-pricing"

interface SellerProductCreateViewProps {
  categories: SeedCategory[]
  brands: SeedBrand[]
  initialProduct?: ProductEditInitial | null
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

export function SellerProductCreateView({
  categories,
  brands,
  initialProduct,
}: SellerProductCreateViewProps) {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormState>({
    name: initialProduct?.name || "",
    sku: initialProduct?.sku || "",
    categoryId: initialProduct?.categoryId ? String(initialProduct.categoryId) : "",
    brandId: initialProduct?.brandId ? String(initialProduct.brandId) : "",
    unitPrice: initialProduct?.unitPrice || "",
    purchasePrice: initialProduct?.purchasePrice || "",
    discount: initialProduct?.discount || "0",
    discountType: (initialProduct?.discountType as "percent" | "amount") || "percent",
    unit: initialProduct?.unit || "pc",
    currentStock: initialProduct ? String(initialProduct.currentStock) : "1",
    thumbnailImg: initialProduct?.thumbnailImg || "",
    description: initialProduct?.description || "",
    published: true,
    todaysDeal: false,
    featured: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isPickerOpen, setIsPickerOpen] = useState(false)

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
      const { createProductAction, updateProductAction } = await import(
        "@/app/actions/ecommerce-actions"
      )

      const payload = {
        name: form.name,
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        brandId: form.brandId ? Number(form.brandId) : undefined,
        unit: form.unit,
        unitPrice: parseFloat(form.unitPrice) || 0,
        purchasePrice: parseFloat(form.purchasePrice) || parseFloat(form.unitPrice) || 0,
        discount: parseFloat(form.discount) || 0,
        discountType: form.discountType,
        currentStock: parseInt(form.currentStock, 10) || 10,
        sku: form.sku || `SKU-${Date.now().toString().slice(-6)}`,
        description: form.description,
        thumbnailImg: form.thumbnailImg || "/assets/img/placeholder.jpg",
      }

      const res = initialProduct
        ? await updateProductAction(initialProduct.id, payload)
        : await createProductAction(payload)

      if (res && (res as any).success !== false) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/seller/products")
        }, 1200)
      } else {
        setError("Failed to save product. Please try again.")
      }
    } catch (err) {
      console.error("Seller product save failed:", err)
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
          <h1 className="text-xl font-bold text-slate-800">
            {initialProduct ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {initialProduct
              ? "Update product details and publish changes to catalog"
              : "Fill in the form below to list a new product in your store"}
          </p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm font-semibold">
          <CheckCircle className="w-4 h-4" />
          {initialProduct
            ? "Product updated successfully!"
            : "Product submitted for approval successfully!"}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">
          <XCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <SellerProductBasicInfo
          categories={categories}
          brands={brands}
          name={form.name}
          sku={form.sku}
          unit={form.unit}
          categoryId={form.categoryId}
          brandId={form.brandId}
          onChange={handleChange}
        />

        <SellerProductPricing
          unitPrice={form.unitPrice}
          purchasePrice={form.purchasePrice}
          currentStock={form.currentStock}
          discount={form.discount}
          discountType={form.discountType}
          onChange={handleChange}
        />

        {/* Thumbnail & Description */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Product Media & Description
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thumbnail Image <span className="text-gray-400 font-normal">(300x300)</span>
              </label>
              <div className="flex rounded border border-slate-300 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 font-medium border-r border-slate-300 transition-colors shrink-0 cursor-pointer"
                >
                  Browse
                </button>
                <div
                  onClick={() => setIsPickerOpen(true)}
                  className="px-3 py-2 text-slate-500 bg-white flex-1 cursor-pointer truncate flex items-center"
                >
                  {form.thumbnailImg ? (
                    <span className="text-slate-800 font-medium truncate">1 File selected</span>
                  ) : (
                    <span className="text-slate-400">Choose File</span>
                  )}
                </div>
              </div>
              {form.thumbnailImg && (
                <div className="mt-2 relative w-16 h-16 rounded border border-slate-200 overflow-hidden bg-slate-50">
                  <Image
                    src={form.thumbnailImg}
                    alt="Thumbnail Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, thumbnailImg: "" }))}
                    className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black text-white rounded-full p-0.5"
                    title="Remove"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
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
              <label
                key={flag.name}
                className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer"
              >
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
            className="px-4 py-2 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSubmitting
              ? "Saving..."
              : initialProduct
              ? "Update Product"
              : "Submit for Approval"}
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(urls) => {
          if (urls.length > 0) {
            setForm((prev) => ({ ...prev, thumbnailImg: urls[0] }))
          }
          setIsPickerOpen(false)
        }}
        title="Select Product Thumbnail Image"
      />
    </div>
  )
}
