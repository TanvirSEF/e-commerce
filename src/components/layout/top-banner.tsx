"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"

interface TopBannerProps {
  banners?: { id: number; text: string; link?: string }[]
  backgroundColor?: string
  textColor?: string
}

export function TopBanner({
  banners = [],
  backgroundColor = "#d43533",
  textColor = "#ffffff",
}: TopBannerProps) {
  const [visible, setVisible] = useState(false)
  const [activeBanners, setActiveBanners] = useState(banners)

  useEffect(() => {
    // Only show if banners actually exist and not dismissed in session
    const dismissed = sessionStorage.getItem("top_banner_dismissed")
    if (!dismissed && banners.length > 0) {
      setVisible(true)
      setActiveBanners(banners)
    } else {
      setVisible(false)
    }
  }, [banners])

  if (!visible || activeBanners.length === 0) return null

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem("top_banner_dismissed", "true")
  }

  return (
    <div
      className="relative z-50 text-[12px] font-medium leading-none"
      style={{ backgroundColor }}
    >
      <div className="mx-auto flex h-[36px] max-w-[1240px] items-center justify-between px-4">
        {/* Banner Content (Active eCommerce CMS 1:1) */}
        <div className="flex-1 flex items-center justify-center overflow-hidden text-center">
          {activeBanners.map((b) =>
            b.link ? (
              <Link
                key={b.id}
                href={b.link}
                style={{ color: textColor }}
                className="hover:underline truncate"
              >
                {b.text}
              </Link>
            ) : (
              <span key={b.id} style={{ color: textColor }} className="truncate">
                {b.text}
              </span>
            )
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
