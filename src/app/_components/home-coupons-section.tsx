"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Ticket, Copy, Check, ChevronRight } from "lucide-react"
import type { HomeCouponItem } from "@/services/home-service"

interface HomeCouponsSectionProps {
  coupons?: HomeCouponItem[]
}

export function HomeCouponsSection({ coupons = [] }: HomeCouponsSectionProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  if (coupons.length === 0) return null

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  return (
    <section className="bg-[#292933] py-8 text-white">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          {/* Left Title & Description */}
          <div className="flex items-center gap-4 text-center lg:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#ffc519] backdrop-blur-sm">
              <Ticket className="h-8 w-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#ffc519] uppercase">
                Special Promo Deals
              </span>
              <h3 className="text-xl font-extrabold sm:text-2xl">
                Exclusive Discount Coupons
              </h3>
              <p className="mt-1 text-xs text-gray-300">
                Collect voucher codes now and enjoy instant savings at checkout.
              </p>
            </div>
          </div>

          {/* Middle Coupon Cards */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-lg border border-dashed border-white/25 bg-white/10 px-3.5 py-2.5 backdrop-blur-md transition-all hover:bg-white/15"
              >
                <div>
                  <div className="text-[10px] text-gray-300 uppercase">Save</div>
                  <div className="text-sm font-extrabold text-[#ffc519]">
                    {c.discountType === "percent" ? `${c.discount}% OFF` : `৳${c.discount} OFF`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(c.code)}
                  className="flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-bold text-gray-950 transition-colors hover:bg-gray-100"
                  title="Click to copy code"
                >
                  <span>{c.code}</span>
                  {copiedCode === c.code ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Right Action Button */}
          <div className="shrink-0">
            <Link
              href="/coupons"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/30 bg-white/10 px-5 py-2.5 text-xs font-bold text-white transition-all hover:border-white hover:bg-white hover:text-gray-900"
            >
              <span>View All Coupons</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeCouponsSection
