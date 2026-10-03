"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Zap, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/product/product-card"
import type { FlashDealData } from "@/services/home-service"

interface FlashDealSectionProps {
  deal: FlashDealData | null
}

export function FlashDealSection({ deal }: FlashDealSectionProps) {
  if (!deal || !deal.products || deal.products.length === 0) {
    return null
  }

  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now()
      const diff = Math.max(0, deal.endDate - now)
      const totalSeconds = Math.floor(diff / 1000)

      const days = Math.floor(totalSeconds / (3600 * 24))
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      setTimeLeft({ days, hours, minutes, seconds })
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [deal.endDate])

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
                {deal.title || "Flash Deals"}
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

          {/* Links */}
          <div className="flex items-center gap-3">
            <Link
              href={`/flash-deal/${deal.slug}`}
              className="text-xs font-semibold text-gray-600 hover:text-[#d43533]"
            >
              Deal Page
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/flash-deals"
              className="flex items-center gap-1 text-xs font-semibold text-[#d43533] transition-colors hover:text-[#9d1b1a]"
            >
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
          {deal.products.map((prod) => (
            <ProductCard key={prod.id} {...prod} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FlashDealSection
