"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Save, Gavel, XCircle, X, Image as ImageIcon } from "lucide-react"
import { createAuctionProductAction } from "@/app/actions/ecommerce-actions"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"

interface SellerAuctionCreateViewProps {
  sellerSlug?: string
  sellerName?: string
}

export function SellerAuctionCreateView({
  sellerSlug = "active-fashion-outlet",
  sellerName = "Active Fashion Outlet",
}: SellerAuctionCreateViewProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    description: "",
    startingBid: "150.00",
    minBidIncrement: "10.00",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
  })

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
    setFormData((prev) => ({ ...prev, name, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim() || !formData.startingBid) {
      setError("Please fill in all required fields (Product Name, Starting Bid).")
      return
    }

    setIsSubmitting(true)
    try {
      await createAuctionProductAction({
        name: formData.name.trim(),
        slug: formData.slug || `auc-${Date.now()}`,
        thumbnail: formData.thumbnail || "/assets/img/placeholder.jpg",
        description: formData.description,
        startingBid: formData.startingBid,
        minBidIncrement: formData.minBidIncrement || "10.00",
        auctionStartDate: new Date(formData.startDate),
        auctionEndDate: new Date(formData.endDate),
        sellerSlug,
        sellerName,
        featured: false,
      })
      router.push("/seller/auction/products")
      router.refresh()
    } catch (err) {
      console.error("createAuctionProduct error:", err)
      setError("Failed to create auction product. Please check input values.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/seller/auction/products"
          className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Gavel className="w-5 h-5 text-[#d43533]" />
            Add New Auction Product
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            List your merchandise or collectible for real-time competitive bidding
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            <XCircle className="h-4 w-4 shrink-0 text-red-500" />
            {error}
          </div>
        )}

        {/* General Information Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
            Product Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700">
                Product Title <span className="text-[#d43533]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rolex Submariner Date 41mm Vintage Gold Edition"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Starting Bid ($) <span className="text-[#d43533]">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={formData.startingBid}
                onChange={(e) => setFormData({ ...formData, startingBid: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Minimum Bid Increment ($) <span className="text-[#d43533]">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={formData.minBidIncrement}
                onChange={(e) => setFormData({ ...formData, minBidIncrement: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Auction Start Date <span className="text-[#d43533]">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Auction End Date <span className="text-[#d43533]">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700">
                Description & Authenticity Notes
              </label>
              <textarea
                rows={4}
                placeholder="Detail item provenance, condition, accessories included, and shipping provisions..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533]"
              />
            </div>
          </div>
        </div>

        {/* Media / Image Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
            Product Images
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">
              Gallery Thumbnail <span className="text-gray-400 font-normal">(600x600 recommended)</span>
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden text-xs max-w-md">
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 font-medium border-r border-gray-300 transition-colors shrink-0 cursor-pointer"
              >
                Browse
              </button>
              <div
                onClick={() => setIsPickerOpen(true)}
                className="px-3 py-2 text-gray-500 bg-white flex-1 cursor-pointer truncate flex items-center"
              >
                {formData.thumbnail ? (
                  <span className="text-gray-800 font-medium truncate">1 File selected</span>
                ) : (
                  <span className="text-gray-400">Choose File</span>
                )}
              </div>
            </div>

            {formData.thumbnail && (
              <div className="mt-3 relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 shadow-xs">
                <Image
                  src={formData.thumbnail}
                  alt="Auction Thumbnail"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, thumbnail: "" })}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-0.5 cursor-pointer transition-colors"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/seller/auction/products"
            className="px-5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82927] disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving Product..." : "Save Auction Product"}
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(urls) => {
          if (urls.length > 0) {
            setFormData((prev) => ({ ...prev, thumbnail: urls[0] }))
          }
          setIsPickerOpen(false)
        }}
        title="Select Auction Product Thumbnail"
      />
    </div>
  )
}
