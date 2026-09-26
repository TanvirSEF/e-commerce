"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"

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
      <div
        className="bg-white rounded p-3 flex items-center gap-3 border border-gray-100"
        style={{ boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.24)" }}
        role="alert"
      >
        {/* Product Thumbnail */}
        <Link
          href={`/product/${currentAlert.slug}`}
          className="w-[50px] h-[50px] rounded overflow-hidden shrink-0 block"
        >
          <Image
            src={currentAlert.thumbnail}
            alt={currentAlert.productName}
            width={50}
            height={50}
            className="object-cover w-full h-full rounded"
            onError={(e) => {
              ;(e.target as any).src = "/assets/img/placeholder.jpg"
            }}
          />
        </Link>

        {/* Info matching Laravel: <a href="url" class="text-dark font-weight-bold">Title</a> — ordered just now! */}
        <div className="flex-1 min-w-0 pr-1 text-xs text-gray-700 leading-snug">
          <Link
            href={`/product/${currentAlert.slug}`}
            className="text-gray-900 font-bold hover:text-[#d43533] line-clamp-2 inline"
          >
            {currentAlert.productName}
          </Link>
          <span className="text-gray-500 ml-1">— ordered just now!</span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setVisible(false)
            setDismissed(true)
          }}
          className="text-gray-400 hover:text-[#d43533] p-1 -mr-1 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
