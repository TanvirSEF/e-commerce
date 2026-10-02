"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, X } from "lucide-react"
import { unfollowShopAction } from "@/app/actions/followed-seller-actions"
import type { FollowedSellerItem } from "@/services/customer-extra-service"

interface FollowedSellersViewProps {
  initialSellers?: FollowedSellerItem[]
}

export function FollowedSellersView({ initialSellers = [] }: FollowedSellersViewProps) {
  const [sellers, setSellers] = useState<FollowedSellerItem[]>(initialSellers ?? [])
  const [shopToUnfollow, setShopToUnfollow] = useState<FollowedSellerItem | null>(null)
  const [isUnfollowing, setIsUnfollowing] = useState(false)

  const handleConfirmUnfollow = async () => {
    if (!shopToUnfollow) return
    setIsUnfollowing(true)

    // Optimistic UI update
    const targetShopId = shopToUnfollow.shopId
    setSellers((prev) => prev.filter((s) => s.shopId !== targetShopId))

    try {
      await unfollowShopAction(targetShopId)
      setShopToUnfollow(null)
    } catch {
      // Revert if error
      setSellers(initialSellers)
    } finally {
      setIsUnfollowing(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce CMS Titlebar */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">Followed Sellers</h1>
      </div>

      {/* Main Body */}
      {sellers.length === 0 ? (
        /* Empty State Matching Active eCommerce 1:1 */
        <div className="rounded border border-gray-200 bg-white p-12 text-center shadow-2xs">
          <div className="relative mx-auto w-40 h-32 mb-4">
            <Image
              src="/assets/img/nothing.svg"
              alt="No followed sellers"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h3 className="text-base font-bold text-gray-800">There isn&apos;t anything added yet</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            You are not following any sellers or merchant stores yet.
          </p>
          <div className="mt-5">
            <Link
              href="/sellers"
              className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors shadow-2xs"
            >
              Explore Sellers
            </Link>
          </div>
        </div>
      ) : (
        /* 1:1 Border-Joined Grid Matching followed_sellers.blade.php 1:1 */
        <div className="rounded border border-gray-200 bg-white shadow-2xs overflow-hidden">
          <div className="border-t border-l border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sellers.map((shop) => (
              <div
                key={shop.id}
                className="border-r border-b border-gray-200 p-6 bg-white hover:shadow-lg transition-all text-center flex flex-col items-center justify-between"
              >
                {/* 130x130px Circular Logo with 1:1 Active eCommerce shadow */}
                <div>
                  <Link
                    href={`/shop/${shop.shopSlug}`}
                    className="relative block h-[130px] w-[130px] rounded-full overflow-hidden border border-[#e5e5e5] shadow-[0px_10px_20px_rgba(0,0,0,0.06)] mx-auto hover:scale-105 transition-transform bg-gray-50"
                  >
                    <Image
                      src={shop.logo || "/assets/img/placeholder.jpg"}
                      alt={shop.shopName}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.currentTarget
                        if (!target.src.includes("placeholder.jpg")) {
                          target.src = "/assets/img/placeholder.jpg"
                        }
                      }}
                    />
                  </Link>

                  {/* Shop Name */}
                  <h2 className="text-sm font-bold text-gray-900 mt-4 line-clamp-2 h-10">
                    <Link
                      href={`/shop/${shop.shopSlug}`}
                      className="hover:text-[#d43533] transition-colors"
                      title={shop.shopName}
                    >
                      {shop.shopName}
                    </Link>
                  </h2>

                  {/* Star Rating */}
                  <div className="flex items-center justify-center gap-1 mt-2 text-xs text-amber-500">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium ml-1">
                      ({shop.rating.toFixed(1)})
                    </span>
                  </div>

                  {/* Unfollow Link */}
                  <div className="mt-2.5 mb-3">
                    <button
                      type="button"
                      onClick={() => setShopToUnfollow(shop)}
                      className="text-xs font-bold text-gray-500 hover:text-[#d43533] transition-colors cursor-pointer"
                    >
                      Unfollow This Seller
                    </button>
                  </div>
                </div>

                {/* Visit Store Button Matching Laravel 1:1 */}
                <Link
                  href={`/shop/${shop.shopSlug}`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-2.5 px-4 w-full block text-center border border-gray-200 rounded-none transition-colors mt-auto"
                >
                  Visit Store
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unfollow Confirmation Modal */}
      {shopToUnfollow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="relative w-full max-w-sm rounded bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Unfollow Seller</h3>
              <button
                type="button"
                onClick={() => setShopToUnfollow(null)}
                className="rounded p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Are you sure you want to unfollow <strong className="text-gray-900">&quot;{shopToUnfollow.shopName}&quot;</strong>? You won&apos;t receive store updates or special discounts from this merchant.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShopToUnfollow(null)}
                disabled={isUnfollowing}
                className="rounded border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUnfollow}
                disabled={isUnfollowing}
                className="rounded bg-[#d43533] px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors"
              >
                {isUnfollowing ? "Unfollowing..." : "Unfollow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
