"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from "lucide-react"
import { createAuctionProductAction } from "@/app/actions/auction-actions"
import { AuctionCreateInfoCard } from "./auction-create-info-card"
import { AuctionCreatePricingCard } from "./auction-create-pricing-card"
import { AuctionCreateSidebar } from "./auction-create-sidebar"

interface AdminAuctionCreateViewProps {
  categories?: { id: string | number; name: string; slug?: string }[]
  brands?: { id: string | number; name: string; slug?: string }[]
}

export function AdminAuctionCreateView({
  categories = [],
  brands = [],
}: AdminAuctionCreateViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Form states
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [thumbnail, setThumbnail] = useState("https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80")
  const [description, setDescription] = useState("")
  const [startingBid, setStartingBid] = useState("100.00")
  const [minBidIncrement, setMinBidIncrement] = useState("10.00")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0]
  )

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories && categories.length > 0 && categories[0]?.id ? String(categories[0].id) : ""
  )
  const [selectedBrandId, setSelectedBrandId] = useState(
    brands && brands.length > 0 && brands[0]?.id ? String(brands[0].id) : ""
  )
  const [isPublished, setIsPublished] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Product Title is required.")
      return
    }
    if (!startingBid || Number(startingBid) <= 0) {
      setError("Please specify a valid starting bid.")
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        const res = await createAuctionProductAction({
          name: name.trim(),
          slug: slug.trim() || `auc-${Date.now()}`,
          thumbnail: thumbnail.trim(),
          description: description.trim(),
          startingBid: String(startingBid),
          minBidIncrement: String(minBidIncrement || "10.00"),
          auctionStartDate: new Date(startDate),
          auctionEndDate: new Date(endDate),
          sellerSlug: "inhouse",
          sellerName: "Active In-House Luxury Desk",
          featured: isFeatured,
        })

        if (res) {
          setSuccess("Auction Product has been created successfully!")
          setTimeout(() => {
            router.push("/admin/auction/all-products")
            router.refresh()
          }, 600)
        } else {
          setError("Failed to create auction product.")
        }
      } catch (err: any) {
        setError(err?.message || "Failed to create auction product")
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/auction/all-products"
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h5 className="text-base font-bold text-gray-800">Add New Auction Product</h5>
            <p className="text-xs text-gray-400">Configure auction rules, starting bid, and timer</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg border bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg border bg-emerald-50 text-emerald-800 border-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: col-lg-8 */}
          <div className="lg:col-span-8 space-y-5">
            <AuctionCreateInfoCard
              name={name}
              setName={setName}
              slug={slug}
              setSlug={setSlug}
              thumbnail={thumbnail}
              setThumbnail={setThumbnail}
              description={description}
              setDescription={setDescription}
            />

            <AuctionCreatePricingCard
              startingBid={startingBid}
              setStartingBid={setStartingBid}
              minBidIncrement={minBidIncrement}
              setMinBidIncrement={setMinBidIncrement}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </div>

          {/* Right Column: col-lg-4 */}
          <div className="lg:col-span-4">
            <AuctionCreateSidebar
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              brands={brands}
              selectedBrandId={selectedBrandId}
              setSelectedBrandId={setSelectedBrandId}
              isPublished={isPublished}
              setIsPublished={setIsPublished}
              isFeatured={isFeatured}
              setIsFeatured={setIsFeatured}
            />
          </div>

          {/* Bottom Toolbar */}
          <div className="col-span-12 flex justify-end gap-3 pt-2 pb-6">
            <Link
              href="/admin/auction/all-products"
              className="px-4 py-2 rounded text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-xs transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded text-xs font-semibold text-white bg-[#d43533] hover:bg-[#b82a28] shadow-xs transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isPending ? "Publishing..." : "Save & Publish"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
