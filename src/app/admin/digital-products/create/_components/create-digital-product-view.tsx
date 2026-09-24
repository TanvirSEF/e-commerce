"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createDigitalProductAction } from "@/app/actions/ecommerce-actions"
import { ArrowLeft, Save, FileCode, UploadCloud, DollarSign } from "lucide-react"

interface CreateDigitalProductViewProps {
  categories: { id: string | number; name: string }[]
}

export function CreateDigitalProductView({ categories }: CreateDigitalProductViewProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [unitPrice, setUnitPrice] = useState<string>("")
  const [thumbnailImg, setThumbnailImg] = useState("")
  const [digitalFile, setDigitalFile] = useState("")
  const [description, setDescription] = useState("")
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
      await createDigitalProductAction({
        name,
        categoryId: categoryId ? Number(categoryId) : undefined,
        unitPrice: parseFloat(unitPrice),
        thumbnailImg,
        digitalFile: digitalFile.trim() || undefined,
        description,
      })
      router.push("/admin/digital-products")
      router.refresh()
    } catch {
      setErrorMsg("Failed to create digital product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
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
            <h1 className="text-2xl font-bold text-gray-800">Add New Digital Product</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Active eCommerce CMS Standard Digital Asset Publisher
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
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Publishing..." : "Save Digital Product"}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
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
              Thumbnail Preview Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={thumbnailImg}
              onChange={(e) => setThumbnailImg(e.target.value)}
              placeholder="https://images.unsplash.com/... or uploaded asset URL"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Downloadable File Link / Delivery URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={digitalFile}
                onChange={(e) => setDigitalFile(e.target.value)}
                placeholder="/downloads/software-bundle-v1.zip or cloud storage secure link"
                className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#d43533] font-mono"
              />
              <UploadCloud className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
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
    </form>
  )
}
