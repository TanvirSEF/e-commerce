"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Save, FileText, CheckCircle2, XCircle } from "lucide-react"
import { createProductAction, updateProductAction } from "@/app/actions/ecommerce-actions"
import { ProductGeneralInfo, type CategoryOption, type BrandOption } from "./product-general-info"
import { ProductPricingStock } from "./product-pricing-stock"
import { ProductMediaGallery } from "./product-media-gallery"
import { ProductVariationMatrix, type VariantItem } from "./product-variation-matrix"
import type { ProductEditInitial } from "@/services/product-service"

export type { ProductEditInitial }

interface AdminProductCreateViewProps {
  categories: CategoryOption[]
  brands: BrandOption[]
  initialProduct?: ProductEditInitial | null
}

export function AdminProductCreateView({
  categories,
  brands,
  initialProduct,
}: AdminProductCreateViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    name: initialProduct?.name || "",
    categoryId: initialProduct?.categoryId || categories[0]?.id || 1,
    brandId: initialProduct?.brandId || brands[0]?.id || 1,
    unit: initialProduct?.unit || "pc",
    unitPrice: initialProduct?.unitPrice || "",
    purchasePrice: initialProduct?.purchasePrice || "",
    discount: initialProduct?.discount || "0",
    discountType: (initialProduct?.discountType as "percent" | "amount") || "percent",
    stock: initialProduct ? String(initialProduct.currentStock) : "20",
    sku: initialProduct?.sku || "",
    weight: initialProduct?.weight || "0.00",
    description: initialProduct?.description || "",
    thumbnail: initialProduct?.thumbnailImg || "/assets/img/placeholder.jpg",
    photos: initialProduct?.photos || [],
  })

  const [variations, setVariations] = useState<VariantItem[]>(
    initialProduct?.variations || []
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProduct = async (shouldPublish: boolean) => {
    if (!formData.name.trim()) {
      setError("Product Name is required.")
      return
    }
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      setError("Please specify a valid Unit Price.")
      return
    }

    setError("")
    startTransition(async () => {
      try {
        const payload = {
          name: formData.name.trim(),
          categoryId: formData.categoryId,
          brandId: formData.brandId,
          unit: formData.unit,
          unitPrice: parseFloat(formData.unitPrice) || 0,
          purchasePrice: parseFloat(formData.purchasePrice) || parseFloat(formData.unitPrice) || 0,
          discount: parseFloat(formData.discount) || 0,
          discountType: formData.discountType,
          currentStock: parseInt(formData.stock, 10) || 10,
          sku: formData.sku || `SKU-${Date.now().toString().slice(-6)}`,
          weight: parseFloat(formData.weight) || 0,
          description: formData.description,
          thumbnailImg: formData.thumbnail,
          photos: formData.photos,
          published: initialProduct ? (initialProduct.published !== false) : shouldPublish,
          variations: variations.map((v) => ({
            variant: v.variant,
            sku: v.sku,
            price: v.price,
            stock: v.stock,
          })),
        }

        const res = initialProduct
          ? await updateProductAction(initialProduct.id, payload)
          : await createProductAction(payload)

        if (res && (res as any).success !== false) {
          setFeedback({
            type: "success",
            text: initialProduct
              ? "Product updated successfully!"
              : shouldPublish
              ? "Product published to store catalog!"
              : "Product saved as draft (unpublished)!",
          })
          setTimeout(() => {
            router.push("/admin/products")
          }, 800)
        } else {
          setError("Failed to save product to database. Please check input fields.")
        }
      } catch (err) {
        console.error("Error saving product:", err)
        setError("An error occurred while saving the product.")
      }
    })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Alert Notices */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 shadow-2xs">
          <XCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 shadow-2xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            title="Back to Catalog"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {initialProduct ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-xs text-slate-500">
              {initialProduct
                ? "Update product information, media gallery, variations, and catalog details"
                : "Configure product catalog details, attributes, gallery, and pricing (Active eCommerce 1:1)"}
            </p>
          </div>
        </div>

        {/* Dual Actions: Save as Draft vs Save & Publish */}
        <div className="flex items-center gap-2">
          {!initialProduct && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleSaveProduct(false)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-2xs hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>{isPending ? "Saving..." : "Save as Draft"}</span>
            </button>
          )}

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSaveProduct(true)}
            className="inline-flex items-center space-x-1.5 px-5 py-2 bg-[#d43533] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#b82a28] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>
              {isPending
                ? "Saving..."
                : initialProduct
                ? "Update Product"
                : "Save & Publish"}
            </span>
          </button>
        </div>
      </div>

      {/* 1. General Info Card */}
      <ProductGeneralInfo
        categories={categories}
        brands={brands}
        name={formData.name}
        categoryId={formData.categoryId}
        brandId={formData.brandId}
        unit={formData.unit}
        sku={formData.sku}
        weight={formData.weight}
        onChange={handleChange}
      />

      {/* 2. Pricing & Stock Card */}
      <ProductPricingStock
        unitPrice={formData.unitPrice}
        purchasePrice={formData.purchasePrice}
        discount={formData.discount}
        discountType={formData.discountType}
        stock={formData.stock}
        onChange={handleChange}
      />

      {/* 3. Product Variations & Attribute Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>Product Variations & Attribute Matrix (Laravel 1:1)</span>
          <span className="text-[11px] font-normal text-slate-400">Cartesian combinations</span>
        </h2>
        <ProductVariationMatrix
          basePrice={parseFloat(formData.unitPrice) || 0}
          baseSku={formData.sku || formData.name.slice(0, 4).toUpperCase()}
          onVariantsChange={setVariations}
        />
      </div>

      {/* 4. Product Media & Gallery Card (Thumbnail + Multi Photos) */}
      <ProductMediaGallery
        thumbnail={formData.thumbnail}
        photos={formData.photos}
        description={formData.description}
        onThumbnailChange={(url) => setFormData((prev) => ({ ...prev, thumbnail: url }))}
        onPhotosChange={(photos) => setFormData((prev) => ({ ...prev, photos }))}
        onDescriptionChange={(description) => setFormData((prev) => ({ ...prev, description }))}
      />

      {/* Bottom Floating Action Bar */}
      <div className="flex items-center justify-end gap-2 pt-2">
        {!initialProduct && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSaveProduct(false)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-2xs hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Save as Draft (Unpublished)</span>
          </button>
        )}

        <button
          type="button"
          disabled={isPending}
          onClick={() => handleSaveProduct(true)}
          className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-[#d43533] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#b82a28] transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>
            {isPending
              ? "Saving..."
              : initialProduct
              ? "Update Product"
              : "Save & Publish"}
          </span>
        </button>
      </div>
    </div>
  )
}
