"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Zap, ChevronRight } from "lucide-react"
import { ProductCard, type ProductCardProps } from "@/components/product/product-card"

const FLASH_PRODUCTS: ProductCardProps[] = [
  {
    id: "fp-1",
    name: "T800 Ultra Smartwatch with Bluetooth Calling & Heart Rate",
    slug: "t800-ultra-smartwatch",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 999,
    originalPrice: 1999,
    discountPercent: 50,
    rating: 4.9,
    reviewCount: 48,
  },
  {
    id: "fp-2",
    name: "M10 Wireless TWS Bluetooth Earbuds with Digital LED Display",
    slug: "m10-wireless-earbuds",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 450,
    originalPrice: 900,
    discountPercent: 50,
    rating: 4.7,
    reviewCount: 82,
  },
  {
    id: "fp-3",
    name: "Premium Cotton Slim-Fit Casual Long Sleeve Shirt for Men",
    slug: "premium-cotton-slim-fit-shirt",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 799,
    originalPrice: 1200,
    discountPercent: 33,
    rating: 4.8,
    reviewCount: 34,
  },
  {
    id: "fp-4",
    name: "Foldable Laptop Stand Aluminum Adjustable Height Cooling Holder",
    slug: "foldable-laptop-stand-aluminum",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 650,
    originalPrice: 1100,
    discountPercent: 41,
    rating: 4.9,
    reviewCount: 29,
  },
  {
    id: "fp-5",
    name: "Multi-Pocket Travel Backpack with USB Charging Port Waterproof",
    slug: "travel-backpack-usb-charging",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1350,
    originalPrice: 2200,
    discountPercent: 39,
    rating: 4.6,
    reviewCount: 19,
  },
]

export function FlashDealSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 42,
    seconds: 18,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 }
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatUnit = (val: number) => String(val).padStart(2, "0")

  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Flash Deal Header Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          {/* Title & Countdown */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d43533] text-white">
                <Zap className="h-4 w-4 fill-white" />
              </div>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                Flash Deals
              </h2>
            </div>

            {/* Countdown Badges */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-500 font-medium">Ends in:</span>
              <div className="flex items-center gap-1 font-mono font-bold text-white">
                <span className="rounded bg-[#292933] px-2 py-1">
                  {formatUnit(timeLeft.days)}d
                </span>
                <span className="text-gray-400">:</span>
                <span className="rounded bg-[#292933] px-2 py-1">
                  {formatUnit(timeLeft.hours)}h
                </span>
                <span className="text-gray-400">:</span>
                <span className="rounded bg-[#292933] px-2 py-1">
                  {formatUnit(timeLeft.minutes)}m
                </span>
                <span className="text-gray-400">:</span>
                <span className="rounded bg-[#d43533] px-2 py-1">
                  {formatUnit(timeLeft.seconds)}s
                </span>
              </div>
            </div>
          </div>

          {/* View All Link */}
          <Link
            href="/flash-deals"
            className="flex items-center gap-1 text-xs font-semibold text-[#d43533] transition-colors hover:text-[#9d1b1a]"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
          {FLASH_PRODUCTS.map((prod) => (
            <ProductCard key={prod.id} {...prod} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FlashDealSection
