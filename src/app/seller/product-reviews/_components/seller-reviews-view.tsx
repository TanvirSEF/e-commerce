"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Star, Loader2, Search } from "lucide-react"
import { SellerReviewDetailsModal } from "./seller-review-details-modal"
import { fetchSellerProductReviewDetailsAction } from "@/app/actions/seller-actions"
import type { SellerReviewedProductRow, SellerProductReviewDetail } from "@/services/seller-panel-service"

interface SellerReviewsViewProps {
  initialProducts: SellerReviewedProductRow[]
}

export function SellerReviewsView({ initialProducts }: SellerReviewsViewProps) {
  const [products, setProducts] = useState<SellerReviewedProductRow[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [ratingFilter, setRatingFilter] = useState<"" | "desc" | "asc">("")

  const [loadingProductId, setLoadingProductId] = useState<number | null>(null)
  const [activeModalData, setActiveModalData] = useState<{
    product: { id: number; name: string; thumbnailImg: string | null; rating: number }
    reviews: SellerProductReviewDetail[]
  } | null>(null)

  const handleOpenReviews = async (product: SellerReviewedProductRow) => {
    setLoadingProductId(product.id)
    const res = await fetchSellerProductReviewDetailsAction(product.id)
    setLoadingProductId(null)

    if (res.success && res.data?.product) {
      setActiveModalData({
        product: res.data.product,
        reviews: res.data.reviews,
      })
      // Clear new badge locally
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, unviewedCount: 0 } : p))
      )
    }
  }

  // Filter products based on search and rating sort
  const filteredProducts = products
    .filter((p) => {
      if (!search.trim()) return true
      return p.name.toLowerCase().includes(search.toLowerCase().trim())
    })
    .sort((a, b) => {
      if (ratingFilter === "asc") return a.rating - b.rating
      if (ratingFilter === "desc") return b.rating - a.rating
      return 0
    })

  return (
    <div className="space-y-4">
      {/* Titlebar matching Laravel aiz-titlebar */}
      <div className="border-b border-gray-100 pb-3">
        <h1 className="text-xl font-bold text-gray-900">All Rating & Reviews</h1>
      </div>

      {/* Main Table Card */}
      <div className="card bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
        {/* Card Header with Filters */}
        <div className="card-header p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          <h5 className="mb-0 text-sm font-semibold text-gray-800">Product Review & Ratings</h5>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Filter by Rating */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value as "" | "desc" | "asc")}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none bg-white text-gray-700"
            >
              <option value="">Filter by Rating</option>
              <option value="desc">Rating (High &gt; Low)</option>
              <option value="asc">Rating (Low &gt; High)</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type Product Name & Hit Enter"
                className="text-xs pl-3 pr-8 py-1.5 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none text-gray-700 w-full sm:w-56"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body p-0">
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-[#f9fafb] text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4 w-2/5">Product Name</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Reviews</th>
                    <th className="py-3 px-4 text-right">Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product, idx) => (
                    <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 text-center text-gray-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 relative rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                            <Image
                              src={product.thumbnailImg || "/assets/img/placeholder.jpg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium text-gray-800 line-clamp-2">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900">{product.rating}</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= Math.round(product.rating)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {product.reviewsCount}
                          </span>
                          {product.unviewedCount > 0 && (
                            <span className="inline-block px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider text-white bg-[#d43533] rounded">
                              new
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          disabled={loadingProductId === product.id}
                          onClick={() => handleOpenReviews(product)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-medium transition-colors"
                        >
                          {loadingProductId === product.id && (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          )}
                          View Reviews
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs">
              No product reviews found.
            </div>
          )}
        </div>
      </div>

      {/* Review Details Modal */}
      {activeModalData && (
        <SellerReviewDetailsModal
          product={activeModalData.product}
          reviews={activeModalData.reviews}
          onClose={() => setActiveModalData(null)}
        />
      )}
    </div>
  )
}
