"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Zap } from "lucide-react"

export interface FlashDealItem {
  id: string
  title: string
  slug: string
  startDate: number
  endDate: number
  status: boolean
  featured: boolean
  banner: string
}

interface FlashDealsViewProps {
  deals: FlashDealItem[]
}

function FlashDealCountdownOverlay({ endDate }: { endDate: number }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number }>({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  })

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, endDate - Date.now())
      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / 1000 / 60) % 60)
      const s = Math.floor((diff / 1000) % 60)
      setTimeLeft({ d, h, m, s })
    }

    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [endDate])

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="flex items-center justify-center gap-2 text-center">
      <div className="flex flex-col items-center justify-center rounded-lg bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm">
        <span className="text-base font-extrabold text-[#d43533] sm:text-lg">{pad(timeLeft.d)}</span>
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Days</span>
      </div>
      <span className="text-lg font-bold text-gray-400">:</span>
      <div className="flex flex-col items-center justify-center rounded-lg bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm">
        <span className="text-base font-extrabold text-gray-900 sm:text-lg">{pad(timeLeft.h)}</span>
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Hours</span>
      </div>
      <span className="text-lg font-bold text-gray-400">:</span>
      <div className="flex flex-col items-center justify-center rounded-lg bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm">
        <span className="text-base font-extrabold text-gray-900 sm:text-lg">{pad(timeLeft.m)}</span>
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Mins</span>
      </div>
      <span className="text-lg font-bold text-gray-400">:</span>
      <div className="flex flex-col items-center justify-center rounded-lg bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm">
        <span className="text-base font-extrabold text-gray-900 sm:text-lg">{pad(timeLeft.s)}</span>
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Secs</span>
      </div>
    </div>
  )
}

export function FlashDealsView({ deals = [] }: FlashDealsViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Breadcrumb & Section Header (1:1 with all_flash_deal_list.blade.php) */}
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
              Flash Deals
            </h1>
          </div>
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/" className="transition-colors hover:text-[#d43533]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-gray-800">&quot;Flash Deals&quot;</span>
          </nav>
        </div>

        {/* Campaign Cards Grid */}
        {deals.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-xs">
            <Zap className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <h3 className="text-base font-bold text-gray-700">No Active Flash Deals</h3>
            <p className="mt-1 text-xs text-gray-500">
              Check back soon for upcoming limited-time discount campaigns.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl"
              >
                {/* Banner with Countdown Overlay */}
                <Link
                  href={`/flash-deal/${deal.slug}`}
                  className="relative block h-[260px] w-full overflow-hidden bg-gray-100 sm:h-[300px]"
                >
                  <Image
                    src={deal.banner}
                    alt={deal.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dark subtle overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d43533] px-3 py-1 text-xs font-extrabold text-white shadow-md">
                      <Zap className="h-3.5 w-3.5 fill-white" />
                      LIVE DEAL
                    </span>
                  </div>

                  {/* Centered Countdown Overlay (matching aiz-count-down-circle overlay) */}
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-10">
                    <div className="rounded-xl bg-black/30 p-3 backdrop-blur-md border border-white/20">
                      <span className="mb-2 block text-center text-[11px] font-bold text-white uppercase tracking-wider">
                        Ends in
                      </span>
                      <FlashDealCountdownOverlay endDate={deal.endDate} />
                    </div>
                  </div>
                </Link>

                {/* Card Footer Details */}
                <div className="flex flex-1 flex-col justify-between p-5 text-center">
                  <h2 className="line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-[#d43533]">
                    <Link href={`/flash-deal/${deal.slug}`}>{deal.title}</Link>
                  </h2>

                  <div className="mt-4">
                    <Link
                      href={`/flash-deal/${deal.slug}`}
                      className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-[#d43533] py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#b82a28] hover:shadow-md"
                    >
                      <span>View Products from This Deal</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FlashDealsView
