"use client"

import { useState, useTransition, type ReactNode } from "react"
import { CheckCircle, Star, MapPin, Calendar, Heart, Share2, Loader2 } from "lucide-react"
import { SeedShop } from "@/db/seed/data"
import { toggleFollowShopAction } from "@/app/actions/ecommerce-actions"
import { useRouter } from "next/navigation"

interface ShopHeaderProps {
  shop: SeedShop
}

interface SocialLinkItem {
  name: string
  url: string
  icon: ReactNode
  className: string
}

export function ShopHeader({ shop }: ShopHeaderProps) {
  const router = useRouter()
  const [following, setFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(shop.followersCount)
  const [isPending, startTransition] = useTransition()

  const handleToggleFollow = () => {
    startTransition(async () => {
      const numericShopId = typeof shop.id === "number" ? shop.id : parseInt(String(shop.id).replace(/\D/g, ""), 10) || 1
      const res = await toggleFollowShopAction(numericShopId, following)
      if (res.requireLogin) {
        router.push("/login")
        return
      }
      if (res.success) {
        setFollowing(res.following)
        setFollowerCount((prev) => (res.following ? prev + 1 : Math.max(0, prev - 1)))
      }
    })
  }

  const socialLinks: SocialLinkItem[] = []

  if (shop.facebook) {
    socialLinks.push({
      name: "Facebook",
      url: shop.facebook.startsWith("http") ? shop.facebook : `https://${shop.facebook}`,
      icon: (
        <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      className: "border-blue-200 text-[#1877F2] bg-blue-50/70 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
    })
  }

  if (shop.twitter) {
    socialLinks.push({
      name: "Twitter / X",
      url: shop.twitter.startsWith("http") ? shop.twitter : `https://${shop.twitter}`,
      icon: (
        <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      className: "border-gray-200 text-gray-800 bg-gray-100 hover:bg-black hover:text-white hover:border-black",
    })
  }

  if (shop.instagram) {
    socialLinks.push({
      name: "Instagram",
      url: shop.instagram.startsWith("http") ? shop.instagram : `https://${shop.instagram}`,
      icon: (
        <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      className: "border-pink-200 text-[#E4405F] bg-pink-50/70 hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F]",
    })
  }

  if (shop.youtube) {
    socialLinks.push({
      name: "YouTube",
      url: shop.youtube.startsWith("http") ? shop.youtube : `https://${shop.youtube}`,
      icon: (
        <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      className: "border-red-200 text-[#FF0000] bg-red-50/70 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
    })
  }

  if (shop.google) {
    socialLinks.push({
      name: "Google / Website",
      url: shop.google.startsWith("http") ? shop.google : `https://${shop.google}`,
      icon: (
        <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
      className: "border-emerald-200 text-emerald-600 bg-emerald-50/70 hover:bg-emerald-600 hover:text-white hover:border-emerald-600",
    })
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
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 self-start lg:self-center">
              {/* Member Since */}
              <div className="pr-3 sm:pr-6 border-r border-gray-200">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">
                  Member Since
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-700 mt-0.5 flex items-center gap-1">
                  <Calendar className="size-3.5 text-gray-400" />
                  {shop.memberSince}
                </span>
              </div>

              {/* Social Media Links */}
              {socialLinks.length > 0 && (
                <div className="pr-3 sm:pr-6 border-r border-gray-200">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block mb-1">
                    Social Links
                  </span>
                  <div className="flex items-center gap-1.5">
                    {socialLinks.map((item) => (
                      <a
                        key={item.name}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={item.name}
                        className={`size-7 sm:size-8 rounded-full flex items-center justify-center transition-all shadow-xs border ${item.className}`}
                      >
                        {item.icon}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow Button */}
              <button
                onClick={handleToggleFollow}
                disabled={isPending}
                className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all shadow-xs disabled:opacity-70 ${
                  following
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                {isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Heart className={`size-3.5 ${following ? "fill-white" : ""}`} />
                )}
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
