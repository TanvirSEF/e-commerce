"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Zap } from "lucide-react"

interface FlashDealItem {
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

function CampaignCountdown({ targetTimestamp }: { targetTimestamp: number }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number }>({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  })

  useEffect(() => {
    const updateTime = () => {
      const diff = Math.max(0, targetTimestamp - Date.now())
      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / 1000 / 60) % 60)
      const s = Math.floor((diff / 1000) % 60)
      setTimeLeft({ d, h, m, s })
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [targetTimestamp])

  return (
    <div className="flex items-center justify-center space-x-2 text-center">
      <div className="bg-white text-gray-800 rounded px-2.5 py-1.5 shadow-sm border">
        <span className="text-base font-bold">{String(timeLeft.d).padStart(2, "0")}</span>
        <span className="text-[10px] uppercase block text-gray-500">Days</span>
      </div>
      <span className="font-bold text-gray-400">:</span>
      <div className="bg-white text-gray-800 rounded px-2.5 py-1.5 shadow-sm border">
        <span className="text-base font-bold">{String(timeLeft.h).padStart(2, "0")}</span>
        <span className="text-[10px] uppercase block text-gray-500">Hours</span>
      </div>
      <span className="font-bold text-gray-400">:</span>
      <div className="bg-white text-gray-800 rounded px-2.5 py-1.5 shadow-sm border">
        <span className="text-base font-bold">{String(timeLeft.m).padStart(2, "0")}</span>
        <span className="text-[10px] uppercase block text-gray-500">Mins</span>
      </div>
      <span className="font-bold text-gray-400">:</span>
      <div className="bg-white text-gray-800 rounded px-2.5 py-1.5 shadow-sm border">
        <span className="text-base font-bold">{String(timeLeft.s).padStart(2, "0")}</span>
        <span className="text-[10px] uppercase block text-gray-500">Secs</span>
      </div>
    </div>
  )
}

export function FlashDealsView({ deals }: FlashDealsViewProps) {
  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#d43533] text-white flex items-center justify-center">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Flash Deals</h1>
              <p className="text-xs text-gray-500">Limited time mega discount events</p>
            </div>
          </div>
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 mt-2 md:mt-0">
            <Link href="/" className="hover:text-[#d43533] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-800">&quot;Flash Deals&quot;</span>
          </nav>
        </div>

        {/* Deals Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
            >
              <Link href={`/flash-deal/${deal.slug}`} className="block relative aspect-[16/9] w-full bg-gray-100">
                <Image
                  src={deal.banner}
                  alt={deal.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#d43533] text-white text-xs font-bold px-2.5 py-1 rounded">
                  UP TO 50% OFF
                </div>
              </Link>

              <div className="p-5 text-center">
                <h2 className="text-base font-bold text-gray-900 mb-4 hover:text-[#d43533] transition-colors">
                  <Link href={`/flash-deal/${deal.slug}`}>{deal.title}</Link>
                </h2>

                <div className="bg-gray-50 p-3 rounded mb-4">
                  <span className="text-xs font-semibold text-gray-500 block mb-2">ENDS IN</span>
                  <CampaignCountdown targetTimestamp={deal.endDate} />
                </div>

                <Link
                  href={`/flash-deal/${deal.slug}`}
                  className="inline-block w-full py-2.5 bg-[#d43533] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#b82a28] transition-colors"
                >
                  View Deals &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
