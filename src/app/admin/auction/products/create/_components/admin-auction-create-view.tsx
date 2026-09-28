"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Save, Gavel, Calendar, DollarSign, Image as ImageIcon, XCircle, X } from "lucide-react"
import { createAuctionProductAction } from "@/app/actions/ecommerce-actions"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"

export function AdminAuctionCreateView() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    description: "",
    startingBid: "100.00",
    minBidIncrement: "10.00",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
    sellerSlug: "inhouse",
    sellerName: "In-House Store",
    featured: false,
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
    if (!formData.name || !formData.startingBid) {
      setError("Please fill in required fields.")
      return
    }

    setIsSubmitting(true)
    try {
      await createAuctionProductAction({
        name: formData.name,
        slug: formData.slug || `auc-${Date.now()}`,
        thumbnail: formData.thumbnail,
        description: formData.description,
        startingBid: formData.startingBid,
        minBidIncrement: formData.minBidIncrement,
        auctionStartDate: new Date(formData.startDate),
        auctionEndDate: new Date(formData.endDate),
        sellerSlug: formData.sellerSlug,
        sellerName: formData.sellerName,
        featured: formData.featured,
      })
      router.push("/admin/auction/all-products")
      router.refresh()
    } catch (err) {
      console.error(err)
      setError("Failed to create auction product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/auction/all-products"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Gavel className="w-6 h-6 text-[#d43533]" />
              Add New Auction Product
            </h1>
            <p className="text-sm text-slate-500">Configure auction rules, starting bid, and timer</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">
            <XCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3">
            Product Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Product Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Vintage Rolex Chronograph 1972"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Product Slug</label>
              <input
                type="text"
                placeholder="slug-url"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Thumbnail Image <span className="text-gray-400 font-normal">(300x300)</span>
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 font-medium border-r border-slate-300 transition-colors shrink-0 cursor-pointer"
                >
                  Browse
                </button>
                <div
                  onClick={() => setIsPickerOpen(true)}
                  className="px-3 py-2 text-slate-500 bg-white flex-1 cursor-pointer truncate flex items-center"
                >
                  {formData.thumbnail ? (
                    <span className="text-slate-800 font-medium truncate">1 File selected</span>
                  ) : (
                    <span className="text-slate-400">Choose File</span>
                  )}
                </div>
              </div>
              {formData.thumbnail && (
                <div className="mt-2 relative w-16 h-16 rounded border border-slate-200 overflow-hidden bg-slate-50">
                  <Image
                    src={formData.thumbnail}
                    alt="Auction Thumbnail"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, thumbnail: "" })}
                    className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black text-white rounded-full p-0.5"
                    title="Remove"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Description & Authenticity Notes</label>
              <textarea
                rows={4}
                placeholder="Condition grade, provenance, warranty, collector documentation..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Bidding & Pricing Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Starting Bid ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.startingBid}
                onChange={(e) => setFormData({ ...formData, startingBid: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Minimum Bid Increment ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.minBidIncrement}
                onChange={(e) => setFormData({ ...formData, minBidIncrement: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
              <p className="text-[11px] text-slate-400">Next bidders must offer at least current bid + this amount</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Auction Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Auction End Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 md:col-span-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-slate-300 text-[#d43533] focus:ring-[#d43533]"
              />
              <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                Feature on Auction Showcase Homepage banner
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/auction/all-products"
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-red-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Publishing..." : "Publish Auction"}
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
        title="Select Auction Thumbnail Image"
      />
    </div>
  )
}
