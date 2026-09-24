"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Store, Star, CheckCircle, ExternalLink, UserMinus } from "lucide-react"
import type { FollowedSellerItem } from "@/services/customer-extra-service"

interface FollowedSellersViewProps {
  initialSellers: FollowedSellerItem[]
}

export function FollowedSellersView({ initialSellers }: FollowedSellersViewProps) {
  const [sellers, setSellers] = useState<FollowedSellerItem[]>(initialSellers)

  const handleUnfollow = (shopId: number) => {
    if (confirm("Are you sure you want to unfollow this store?")) {
      setSellers((prev) => prev.filter((s) => s.shopId !== shopId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Store className="w-5 h-5 text-[#d43533]" />
          Followed Merchant Stores
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Stay notified of new arrivals, exclusive discounts, and product drops from your favorite sellers.
        </p>
      </div>

      {sellers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <Store className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <h2 className="text-sm font-bold text-gray-800">You are not following any stores yet.</h2>
          <p className="text-xs text-gray-500 mt-1">
            Browse our top rated merchants and click &quot;Follow&quot; on their storefront to get updates.
          </p>
          <Link
            href="/sellers"
            className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Explore All Sellers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sellers.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center justify-between gap-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 relative shrink-0 border border-gray-200">
                  <Image src={shop.logo} alt={shop.shopName} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-bold text-gray-900 line-clamp-1">{shop.shopName}</h2>
                    {shop.verified && (
                      <span title="Verified Merchant">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {shop.rating}
                    </span>
                    <span>•</span>
                    <span>{shop.totalProducts} Products Listed</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    Followed since {shop.followedDate}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Link
                  href={`/shop/${shop.shopSlug}`}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Visit
                </Link>
                <button
                  type="button"
                  onClick={() => handleUnfollow(shop.shopId)}
                  className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                  title="Unfollow Store"
                >
                  <UserMinus className="w-3.5 h-3.5" />
                  Unfollow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
