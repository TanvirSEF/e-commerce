"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Gavel, DollarSign } from "lucide-react"
import { createAuctionProductAction } from "@/app/actions/ecommerce-actions"

export function SellerAuctionCreateView() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    description: "",
    startingBid: "150.00",
    minBidIncrement: "10.00",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
    sellerSlug: "tech-vision",
    sellerName: "TechVision MegaStore",
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
    if (!formData.name || !formData.startingBid) {
      alert("Please complete required fields")
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
        featured: false,
      })
      router.push("/seller/auction/products")
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to submit auction product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/seller/auction/products"
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Gavel className="w-6 h-6 text-[#d43533]" />
            List Auction Item
          </h1>
          <p className="text-sm text-slate-400">Put your collectible or high-demand merchandise up for bidding</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#1e293b] rounded-xl shadow-sm border border-slate-800 p-6 space-y-5 text-slate-300">
          <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3">Item Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Item Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rare Vintage Collector Item"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Thumbnail Image URL</label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Starting Bid ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.startingBid}
                onChange={(e) => setFormData({ ...formData, startingBid: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Minimum Bid Increment ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.minBidIncrement}
                onChange={(e) => setFormData({ ...formData, minBidIncrement: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Auction Closing Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Item Condition & Authenticity Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/seller/auction/products"
            className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-red-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Listing..." : "Launch Auction"}
          </button>
        </div>
      </form>
    </div>
  )
}
