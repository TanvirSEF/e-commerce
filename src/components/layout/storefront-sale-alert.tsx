"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { CheckCircle, X, ShoppingBag } from "lucide-react"

interface SaleAlertItem {
  id: number
  productName: string
  slug: string
  thumbnail: string
  price: string
  location: string
  timeAgo: string
}

const SAMPLE_ALERTS: SaleAlertItem[] = [
  {
    id: 1,
    productName: "Apple iPhone 15 Pro (128GB)",
    slug: "apple-iphone-15-pro",
    thumbnail: "/assets/img/products/1.jpg",
    price: "৳1,35,000",
    location: "Gulshan, Dhaka",
    timeAgo: "2 minutes ago",
  },
  {
    id: 2,
    productName: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5",
    thumbnail: "/assets/img/products/2.jpg",
    price: "৳38,500",
    location: "GEC, Chattogram",
    timeAgo: "4 minutes ago",
  },
  {
    id: 3,
    productName: "Samsung Galaxy S24 Ultra Titanium",
    slug: "samsung-galaxy-s24-ultra",
    thumbnail: "/assets/img/products/3.jpg",
    price: "৳1,42,000",
    location: "Zindabazar, Sylhet",
    timeAgo: "7 minutes ago",
  },
  {
    id: 4,
    productName: "Men's Premium Casual Slim Fit Shirt",
    slug: "mens-premium-casual-shirt",
    thumbnail: "/assets/img/products/4.jpg",
    price: "৳1,850",
    location: "Uttara, Dhaka",
    timeAgo: "11 minutes ago",
  },
]

export function StorefrontSaleAlert() {
  const pathname = usePathname()
  const [currentAlert, setCurrentAlert] = useState<SaleAlertItem | null>(null)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Don't show in admin, seller, or checkout pages
  const isAdminOrCheckout =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/seller") ||
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/shipping-label")

  useEffect(() => {
    if (isAdminOrCheckout || dismissed) return

    let alertIndex = 0
    const triggerPopup = () => {
      const alert = SAMPLE_ALERTS[alertIndex % SAMPLE_ALERTS.length]
      setCurrentAlert(alert)
      setVisible(true)
      alertIndex++

      // Hide after 5 seconds
      setTimeout(() => {
        setVisible(false)
      }, 5000)
    }

    // First popup after 4 seconds
    const initialTimer = setTimeout(triggerPopup, 4000)

    // Then interval every 14 seconds
    const interval = setInterval(triggerPopup, 14000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [isAdminOrCheckout, dismissed])

  if (isAdminOrCheckout || dismissed || !currentAlert || !visible) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm w-[calc(100vw-32px)] sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xl p-3 flex items-center gap-3 backdrop-blur-md bg-white/95">
        {/* Product Thumbnail */}
        <Link
          href={`/product/${currentAlert.slug}`}
          className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center relative"
        >
          <Image
            src={currentAlert.thumbnail}
            alt={currentAlert.productName}
            width={48}
            height={48}
            className="object-cover w-full h-full"
            onError={(e) => {
              // fallback placeholder
              ;(e.target as any).src = "/assets/img/placeholder.jpg"
            }}
          />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="text-[11px] text-gray-500 flex items-center gap-1">
            <span className="font-semibold text-gray-700">Someone in {currentAlert.location}</span>
            <span>purchased</span>
          </div>
          <Link
            href={`/product/${currentAlert.slug}`}
            className="text-xs font-bold text-gray-900 hover:text-[#d43533] line-clamp-1 block transition-colors"
          >
            {currentAlert.productName}
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
            <span>{currentAlert.timeAgo}</span>
            <span>•</span>
            <span className="text-green-600 font-medium flex items-center gap-0.5">
              <CheckCircle className="w-2.5 h-2.5" />
              Verified
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setVisible(false)
            setDismissed(true)
          }}
          className="text-gray-400 hover:text-gray-600 p-1 -mr-1"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
