"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Sparkles } from "lucide-react"

interface PopupData {
  id: number
  title: string
  summary: string
  bannerUrl: string
  btnText: string
  btnBackgroundColor: string
  btnTextColor: string
  link: string
  delaySec: number
  durationSec: number
}

const DEFAULT_POPUP: PopupData = {
  id: 1,
  title: "Exclusive Eid Mega Offer - Flat 25% Off!",
  summary: "Enjoy huge discounts across our whole fashion and lifestyle collections today.",
  bannerUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80",
  btnText: "Shop The Sale",
  btnBackgroundColor: "#d43533",
  btnTextColor: "white",
  link: "/flash-deals",
  delaySec: 3,
  durationSec: 25,
}

export function StorefrontDynamicPopup() {
  const pathname = usePathname()
  const [popup, setPopup] = useState<PopupData | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Don't display inside admin or seller portals
  const isAdminOrSeller = pathname?.startsWith("/admin") || pathname?.startsWith("/seller")

  useEffect(() => {
    if (isAdminOrSeller) return

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem("huipper_dynamic_popup_dismissed")
    if (isDismissed) return

    setPopup(DEFAULT_POPUP)

    // Trigger open after delay
    const delayTimer = setTimeout(() => {
      setIsOpen(true)
    }, (DEFAULT_POPUP.delaySec || 3) * 1000)

    // Optional auto-dismiss after duration
    const dismissTimer = setTimeout(() => {
      setIsOpen(false)
    }, ((DEFAULT_POPUP.delaySec || 3) + (DEFAULT_POPUP.durationSec || 20)) * 1000)

    return () => {
      clearTimeout(delayTimer)
      clearTimeout(dismissTimer)
    }
  }, [isAdminOrSeller])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem("huipper_dynamic_popup_dismissed", "true")
  }

  if (isAdminOrSeller || !isOpen || !popup) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Banner */}
        <div className="relative h-48 w-full bg-gray-100">
          <img
            src={popup.bannerUrl}
            alt={popup.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-[11px] font-bold text-[#d43533]">
            <Sparkles className="h-3 w-3" />
            Special Limited Time Event
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug">
            {popup.title}
          </h3>

          <p className="text-xs text-gray-500 leading-relaxed">
            {popup.summary}
          </p>

          <div className="pt-2">
            <Link
              href={popup.link || "/"}
              onClick={handleClose}
              style={{
                backgroundColor: popup.btnBackgroundColor || "#d43533",
                color: popup.btnTextColor === "dark" ? "#111827" : "#ffffff",
              }}
              className="inline-block w-full py-3 rounded-xl font-bold text-xs shadow-md hover:opacity-90 transition active:scale-[0.99]"
            >
              {popup.btnText || "Shop Now"}
            </Link>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-[11px] font-medium text-gray-400 hover:text-gray-600 transition"
          >
            No thanks, maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
