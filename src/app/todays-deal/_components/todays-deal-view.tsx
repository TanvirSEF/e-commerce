"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock, Flame } from "lucide-react"
import { ProductCard } from "@/components/product/product-card"
import { SeedProduct } from "@/db/seed/data"

interface TodaysDealViewProps {
  products: SeedProduct[]
}

export function TodaysDealView({ products }: TodaysDealViewProps) {
  // 24 hour countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 48 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="size-6 text-primary fill-primary animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Today&apos;s Deal</h1>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold">&ldquo;Today&apos;s Deal&rdquo;</span>
            </div>
          </div>

          {/* Deal Countdown Pill */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-red-200 shadow-xs self-start sm:self-auto">
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-600">
              <Clock className="size-4 text-primary" />
              <span>Ends In:</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <span className="bg-primary px-2 py-0.5 rounded">
                {String(timeLeft.hours).padStart(2, "0")}h
              </span>
              <span className="text-gray-400">:</span>
              <span className="bg-primary px-2 py-0.5 rounded">
                {String(timeLeft.minutes).padStart(2, "0")}m
              </span>
              <span className="text-gray-400">:</span>
              <span className="bg-primary px-2 py-0.5 rounded">
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>
        </div>

        {/* Promo Top Banner */}
        <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 bg-linear-to-r from-red-600 to-rose-700 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white uppercase tracking-wider mb-2">
              Limited 24H Discounts
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold">Exclusive Daily Super Deals</h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
              Special reduced prices valid today only. Grab your favorite fashion, electronics, and home essentials before the clock hits zero.
            </p>
          </div>
          <div className="shrink-0 text-center bg-white text-gray-900 px-6 py-3.5 rounded-lg font-bold shadow-md">
            <div className="text-xs uppercase text-gray-500">Up to</div>
            <div className="text-2xl font-black text-primary">50% OFF</div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded border border-gray-200 p-4 sm:p-6 shadow-xs">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm">No special deals available right now. Check back tomorrow!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  thumbnail={p.thumbnail}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  discountPercent={p.discountPercent}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
