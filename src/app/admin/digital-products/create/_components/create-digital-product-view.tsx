"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createDigitalProductAction, updateProductAction } from "@/app/actions/ecommerce-actions"
import { ArrowLeft, Save, FileCode, UploadCloud, X } from "lucide-react"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"
import type { ProductEditInitial } from "@/services/product-service"

interface CreateDigitalProductViewProps {
  categories: { id: string | number; name: string }[]
  initialProduct?: ProductEditInitial | null
}

export function CreateDigitalProductView({
  categories,
  initialProduct,
}: CreateDigitalProductViewProps) {
  const router = useRouter()
  const [name, setName] = useState(initialProduct?.name || "")
  const [categoryId, setCategoryId] = useState<string>(
    initialProduct?.categoryId ? String(initialProduct.categoryId) : ""
  )
  const [unitPrice, setUnitPrice] = useState<string>(initialProduct?.unitPrice || "")
  const [thumbnailImg, setThumbnailImg] = useState(initialProduct?.thumbnailImg || "")
  const [digitalFile, setDigitalFile] = useState(initialProduct?.digitalFile || "")
  const [pickerTarget, setPickerTarget] = useState<"thumbnail" | "file" | null>(null)
  const [description, setDescription] = useState(initialProduct?.description || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !unitPrice.trim() || !thumbnailImg.trim()) {
      setErrorMsg("Product Name, Base Price, and Thumbnail Image URL are required.")
      return
    }

    setIsSubmitting(true)
    setErrorMsg("")

    try {
      if (initialProduct) {
        await updateProductAction(initialProduct.id, {
          name: name.trim(),
          categoryId: categoryId ? Number(categoryId) : undefined,
          unitPrice: parseFloat(unitPrice) || 0,
          thumbnailImg,
          digitalFile: digitalFile.trim() || undefined,
          description,
        })
      } else {
        await createDigitalProductAction({
          name: name.trim(),
          categoryId: categoryId ? Number(categoryId) : undefined,
          unitPrice: parseFloat(unitPrice) || 0,
          thumbnailImg,
          digitalFile: digitalFile.trim() || undefined,
          description,
        })
      }
      router.push("/admin/digital-products")
      router.refresh()
    } catch {
      setErrorMsg("Failed to save digital product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/digital-products"
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {initialProduct ? "Edit Digital Product" : "Add New Digital Product"}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Active eCommerce CMS Standard Digital Asset Publisher (Laravel 1:1)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/digital-products"
            className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>
              {isSubmitting
                ? "Saving..."
                : initialProduct
                ? "Update Digital Product"
                : "Save Digital Product"}
            </span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-semibold">
          {errorMsg}
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-[#fafbfc]">
          <FileCode className="w-4 h-4 text-[#d43533]" />
          <h2 className="font-semibold text-gray-800 text-sm">Product Information</h2>
        </div>
        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Flutter Mobile E-Commerce Full Source Code"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none bg-white text-gray-700"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Base Price (৳ BDT) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="2500"
                  className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#d43533] font-mono"
                  required
                />
                <span className="absolute left-3 top-2.5 font-bold text-gray-400">৳</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Thumbnail Preview Image <span className="text-red-500">*</span> <span className="text-gray-400 font-normal">(300x300)</span>
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setPickerTarget("thumbnail")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2.5 font-medium border-r border-gray-300 transition-colors shrink-0 cursor-pointer"
              >
                Browse
              </button>
              <div
                onClick={() => setPickerTarget("thumbnail")}
                className="px-3 py-2.5 text-gray-500 bg-white flex-1 cursor-pointer truncate flex items-center"
              >
                {thumbnailImg ? (
                  <span className="text-gray-800 font-medium truncate">1 File selected</span>
                ) : (
                  <span className="text-gray-400">Choose File</span>
                )}
              </div>
            </div>
            {thumbnailImg && (
              <div className="mt-2.5 relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                <Image
                  src={thumbnailImg}
                  alt="Thumbnail Preview"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setThumbnailImg("")}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-0.5 cursor-pointer"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Downloadable File / Delivery Asset
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setPickerTarget("file")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2.5 font-medium border-r border-gray-300 transition-colors shrink-0 cursor-pointer"
              >
                Browse
              </button>
              <div
                onClick={() => setPickerTarget("file")}
                className="px-3 py-2.5 text-gray-500 bg-white flex-1 cursor-pointer truncate flex items-center"
              >
                {digitalFile ? (
                  <span className="text-gray-800 font-medium truncate">{digitalFile}</span>
                ) : (
                  <span className="text-gray-400">Choose File</span>
                )}
              </div>
              {digitalFile && (
                <button
                  type="button"
                  onClick={() => setDigitalFile("")}
                  className="px-3 text-gray-400 hover:text-red-600 border-l border-gray-200 cursor-pointer"
                  title="Clear file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              This file download link will be provided to verified customers after payment.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Description & Specs</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe software features, installation steps, requirements..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#d43533] leading-relaxed"
            />
          </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        type={pickerTarget === "thumbnail" ? "image" : "all"}
        onSelect={(urls) => {
          if (urls.length > 0) {
            if (pickerTarget === "thumbnail") setThumbnailImg(urls[0])
            if (pickerTarget === "file") setDigitalFile(urls[0])
          }
          setPickerTarget(null)
        }}
        title={pickerTarget === "thumbnail" ? "Select Thumbnail Image" : "Select Product Digital File"}
      />
    </form>
  )
}
