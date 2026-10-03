"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, ChevronRight, Search, ArrowRight } from "lucide-react"
import type { SeedShop } from "@/db/seed/data"

interface SellersViewProps {
  initialShops: SeedShop[]
}

export function SellersView({ initialShops = [] }: SellersViewProps) {
  const [search, setSearch] = useState("")

  const filteredShops = initialShops.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.address && s.address.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Breadcrumb Header Bar (1:1 with shop_listing.blade.php) */}
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              All Sellers
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sellers by name..."
                className="w-full rounded-md border border-gray-200 bg-white py-2 pr-9 pl-3 text-xs focus:border-[#d43533] focus:outline-none"
              />
              <Search className="absolute top-1/2 right-3 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-500">
              <Link href="/" className="transition-colors hover:text-[#d43533]">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-semibold text-gray-800">&quot;All Sellers&quot;</span>
            </nav>
          </div>
        </div>

        {/* Sellers Grid (Active eCommerce signature unified border table layout) */}
        <div className="rounded-lg bg-white p-3 shadow-xs sm:p-5">
          {filteredShops.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-base font-bold text-gray-700">No Sellers Found</h3>
              <p className="mt-1 text-xs text-gray-500">
                No verified sellers matched &ldquo;{search}&rdquo;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 border-t border-l border-gray-100 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  className="group relative flex flex-col items-center justify-between border-r border-b border-gray-100 p-6 text-center transition-all duration-300 hover:bg-gray-50/40 hover:shadow-md"
                >
                  {/* Circular Logo with Shadow & Verification Badge */}
                  <div className="relative mb-3.5 h-24 w-24 sm:h-28 sm:w-28">
                    <Link
                      href={`/shop/${shop.slug}`}
                      className="relative block h-full w-full overflow-hidden rounded-full border border-gray-200 bg-white p-1 transition-transform duration-300 group-hover:scale-105"
                      style={{
                        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      <Image
                        src={shop.logo || "/assets/img/placeholder.jpg"}
                        alt={shop.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </Link>

                    {/* Verification checkmark badge */}
                    <div className="absolute top-0 right-0 z-10 rounded-full bg-white p-0.5 shadow-xs">
                      {shop.verificationStatus ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle cx="12" cy="12" r="11" fill="#3490f3" />
                          <path
                            d="M8 12.5L10.5 15L16 9.5"
                            stroke="white"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle cx="12" cy="12" r="11" fill="#e11d48" />
                          <path
                            d="M9 9L15 15M15 9L9 15"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Shop Name */}
                  <h2 className="mb-2 h-10 line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-[#d43533]">
                    <Link href={`/shop/${shop.slug}`}>{shop.name}</Link>
                  </h2>

                  {/* Rating Stars & Review Count */}
                  <div className="mb-4 flex items-center justify-center gap-1 text-xs text-amber-500">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(shop.rating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-500">
                      ({shop.reviewCount} Reviews)
                    </span>
                  </div>

                  {/* Visit Store Button (Active eCommerce Style) */}
                  <div className="w-full">
                    <Link
                      href={`/shop/${shop.slug}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#d43533]/30 bg-red-50/50 py-2 text-xs font-bold text-[#d43533] transition-all duration-300 hover:border-[#d43533] hover:bg-[#d43533] hover:text-white"
                    >
                      <span>Visit Store</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellersView
