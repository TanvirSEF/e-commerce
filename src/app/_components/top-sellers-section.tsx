import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, CheckCircle, ChevronRight, Store } from "lucide-react"
import type { TopSellerItem } from "@/services/home-service"

interface TopSellersSectionProps {
  sellers?: TopSellerItem[]
}

export function TopSellersSection({ sellers = [] }: TopSellersSectionProps) {
  if (sellers.length === 0) return null

  return (
    <section className="bg-gray-50/60 py-7">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-gray-200/70 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
              <Store className="h-4 w-4 fill-white" />
            </div>
            <h2 className="text-base font-bold text-gray-900 sm:text-lg">
              Top Verified Sellers
            </h2>
          </div>

          <Link
            href="/sellers"
            className="flex items-center gap-1 text-xs font-semibold text-[#3490f3] hover:underline"
          >
            <span>View All Sellers</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              className="group relative flex flex-col items-center rounded-xl border border-gray-100 bg-white p-5 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-red-100 hover:shadow-md"
            >
              {/* Circular Logo & Verification */}
              <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full border-2 border-gray-100 p-1 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={seller.logo || "/assets/img/placeholder.jpg"}
                  alt={seller.name}
                  fill
                  className="rounded-full object-cover"
                />
                {seller.isVerified && (
                  <div className="absolute right-0 bottom-0 rounded-full bg-white p-0.5 shadow-sm">
                    <CheckCircle className="h-5 w-5 fill-[#3490f3] text-white" />
                  </div>
                )}
              </div>

              {/* Shop Name */}
              <h3 className="line-clamp-1 text-sm font-bold text-gray-900 transition-colors group-hover:text-[#d43533]">
                <Link href={`/shop/${seller.slug}`}>{seller.name}</Link>
              </h3>

              {/* Rating */}
              <div className="mt-1.5 flex items-center justify-center gap-1 text-xs text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-gray-800">{seller.rating.toFixed(1)}</span>
                <span className="text-[11px] text-gray-400">
                  ({seller.reviewCount} reviews)
                </span>
              </div>

              {/* Visit Store Button */}
              <div className="mt-4 w-full">
                <Link
                  href={`/shop/${seller.slug}`}
                  className="inline-flex w-full items-center justify-center rounded-md border border-gray-200 bg-gray-50 py-2 text-xs font-semibold text-gray-700 transition-all hover:border-[#d43533] hover:bg-[#d43533] hover:text-white"
                >
                  Visit Store
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopSellersSection
