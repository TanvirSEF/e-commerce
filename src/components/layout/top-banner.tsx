"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { X, Sparkles } from "lucide-react"

const BANNERS = [
  {
    id: 1,
    text: "⚡ Flash Deal Live! Enjoy up to 50% discount on flagship smartphones & accessories.",
    link: "/flash-deals",
    cta: "Shop Now",
  },
  {
    id: 2,
    text: "🚚 Free Shipping on all orders above $50! Use code FREESHIP at checkout.",
    link: "/coupons",
    cta: "Claim Coupon",
  },
  {
    id: 3,
    text: "🎉 New Seller Onboarding: Join 10,000+ merchants and launch your digital store today.",
    link: "/seller/register",
    cta: "Become a Seller",
  },
]

export function TopBanner() {
  const [visible, setVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem("top_banner_dismissed")
    if (!dismissed) {
      setVisible(true)
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  if (!visible) return null

  const banner = BANNERS[currentIndex]

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem("top_banner_dismissed", "true")
  }

  return (
    <div className="relative z-50 bg-[#d43533] text-white text-[12px] font-medium leading-none">
      <div className="mx-auto flex h-[36px] max-w-[1240px] items-center justify-between px-4">
        {/* Animated Banner Content */}
        <div className="flex-1 flex items-center justify-center gap-2 overflow-hidden text-center">
          <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse hidden sm:inline shrink-0" />
          <p className="truncate text-white transition-opacity duration-300">
            {banner.text}
          </p>
          {banner.link && (
            <Link
              href={banner.link}
              className="ml-2 inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white hover:bg-white hover:text-[#d43533] transition-colors shrink-0"
            >
              {banner.cta} →
            </Link>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="ml-3 rounded p-1 text-white/80 hover:text-white hover:bg-black/10 transition-colors"
          aria-label="Close Announcement"
          title="Dismiss Banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default TopBanner
