"use client"

import { useState } from "react"
import { CheckCircle, Star, MapPin, Calendar, Heart, Share2 } from "lucide-react"
import { SeedShop } from "@/db/seed/data"

interface ShopHeaderProps {
  shop: SeedShop
}

export function ShopHeader({ shop }: ShopHeaderProps) {
  const [following, setFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(shop.followersCount)

  const handleToggleFollow = () => {
    if (following) {
      setFollowing(false)
      setFollowerCount((prev) => Math.max(0, prev - 1))
    } else {
      setFollowing(true)
      setFollowerCount((prev) => prev + 1)
    }
  }

  return (
    <div>
      {/* Top Cover Banner */}
      {shop.topBanner && (
        <div className="relative w-full h-40 sm:h-56 md:h-72 overflow-hidden bg-gray-100 border-b border-gray-200">
          <img
            src={shop.topBanner}
            alt={`${shop.name} Cover`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Seller Info Bar */}
      <div className="bg-[#fcfcfd] border-b border-gray-200 py-5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Identity & Basic Info */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative size-16 sm:size-20 rounded-full border border-gray-200 shadow-sm overflow-hidden bg-white shrink-0">
                <img
                  src={shop.logo}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">{shop.name}</h1>
                  {shop.verificationStatus ? (
                    <CheckCircle className="size-4 sm:size-5 text-blue-500 fill-blue-500 text-white" />
                  ) : (
                    <span className="inline-block size-4 rounded-full bg-red-500 text-white text-[10px] font-bold text-center leading-4">
                      ✕
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${
                          i < Math.floor(shop.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({shop.reviewCount} Reviews)
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin className="size-3.5 text-gray-400 shrink-0" />
                  <span className="line-clamp-1">{shop.address}</span>
                </div>
              </div>
            </div>

            {/* Meta & Actions */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-start lg:self-center">
              {/* Member Since */}
              <div className="pr-4 sm:pr-6 border-r border-gray-200">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">
                  Member Since
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-700 mt-0.5 flex items-center gap-1">
                  <Calendar className="size-3.5 text-gray-400" />
                  {shop.memberSince}
                </span>
              </div>

              {/* Follow Button */}
              <button
                onClick={handleToggleFollow}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  following
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                <Heart className={`size-3.5 ${following ? "fill-white" : ""}`} />
                <span>{following ? "Followed" : "Follow Seller"}</span>
                <span className="opacity-80 font-normal">({followerCount})</span>
              </button>

              {/* Share */}
              <button
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.share) {
                    navigator.share({ title: shop.name, url: window.location.href })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                  }
                }}
                className="p-2 border border-gray-200 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                title="Share Store"
              >
                <Share2 className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
