"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Zap } from "lucide-react"
import { ProductCard } from "@/components/product/product-card"

interface FlashDealData {
  title: string
  slug: string
  banner: string
  endDate: number
}

interface ProductItem {
  id: string
  name: string
  slug: string
  price: number
  originalPrice: number
  discountPercent: number
  rating: number
  reviewCount: number
  thumbnail: string
}

interface FlashDealDetailsViewProps {
  deal: FlashDealData
  products: ProductItem[]
}

export function FlashDealDetailsView({ deal, products }: FlashDealDetailsViewProps) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number }>({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  })

  useEffect(() => {
    const updateTime = () => {
      const diff = Math.max(0, deal.endDate - Date.now())
      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / 1000 / 60) % 60)
      const s = Math.floor((diff / 1000) % 60)
      setTimeLeft({ d, h, m, s })
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [deal.endDate])

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
            <Zap className="w-5 h-5 text-[#d43533] fill-[#d43533] mr-2" />
            {deal.title}
          </h1>
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 mt-2 md:mt-0">
            <Link href="/" className="hover:text-[#d43533] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/flash-deals" className="hover:text-[#d43533] transition-colors">
              Flash Deals
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-800">&quot;{deal.title}&quot;</span>
          </nav>
        </div>

        {/* 1:1 Layout from Active eCommerce: Sidebar Banner + Countdown vs Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Banner & Countdown Widget */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 bg-white border border-gray-200 shadow-sm overflow-hidden p-6 text-center">
              <div className="relative aspect-[4/3] w-full mb-6 bg-gray-100 rounded">
                <Image
                  src={deal.banner}
                  alt={deal.title}
                  fill
                  sizes="350px"
                  className="object-cover rounded"
                />
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-2">{deal.title}</h2>
              <p className="text-xs text-gray-500 mb-6">
                Don&apos;t miss out on these exclusive limited quantities and massive discounts!
              </p>

              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <span className="text-xs font-bold text-[#d43533] block mb-3 uppercase tracking-wider">
                  Campaign Ends In
                </span>
                <div className="flex items-center justify-center space-x-2">
                  <div className="bg-white border rounded px-3 py-2 shadow-xs min-w-[50px]">
                    <span className="text-lg font-extrabold text-[#d43533]">
                      {String(timeLeft.d).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase block text-gray-400">Days</span>
                  </div>
                  <span className="font-bold text-[#d43533]">:</span>
                  <div className="bg-white border rounded px-3 py-2 shadow-xs min-w-[50px]">
                    <span className="text-lg font-extrabold text-[#d43533]">
                      {String(timeLeft.h).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase block text-gray-400">Hours</span>
                  </div>
                  <span className="font-bold text-[#d43533]">:</span>
                  <div className="bg-white border rounded px-3 py-2 shadow-xs min-w-[50px]">
                    <span className="text-lg font-extrabold text-[#d43533]">
                      {String(timeLeft.m).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase block text-gray-400">Mins</span>
                  </div>
                  <span className="font-bold text-[#d43533]">:</span>
                  <div className="bg-white border rounded px-3 py-2 shadow-xs min-w-[50px]">
                    <span className="text-lg font-extrabold text-[#d43533]">
                      {String(timeLeft.s).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase block text-gray-400">Secs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deal Products Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  discountPercent={p.discountPercent}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                  thumbnail={p.thumbnail}
                />
              ))}
            </div>

            {products.length === 0 && (
              <div className="bg-white p-12 text-center text-gray-500 rounded border">
                No active products found in this flash deal event.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
