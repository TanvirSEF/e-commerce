"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, CheckCircle, ArrowRight, Search } from "lucide-react"
import { SeedShop } from "@/db/seed/data"

interface SellersViewProps {
  initialShops: SeedShop[]
}

export function SellersView({ initialShops }: SellersViewProps) {
  const [search, setSearch] = useState("")

  const filteredShops = initialShops.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Sellers</h1>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold">&ldquo;All Sellers&rdquo;</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sellers by name..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 bg-white rounded-md focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Sellers Grid */}
        <div className="bg-white rounded border border-gray-200 p-4 sm:p-6 shadow-xs">
          {filteredShops.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm">No sellers found matching &ldquo;{search}&rdquo;</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  className="group relative flex flex-col items-center text-center p-6 border border-gray-100 rounded-lg hover:shadow-md hover:border-gray-200 transition-all duration-300 bg-white"
                >
                  {/* Shop Logo & Verification Badge */}
                  <div className="relative mb-4">
                    <Link
                      href={`/shop/${shop.slug}`}
                      className="block size-24 sm:size-28 rounded-full overflow-hidden border border-gray-200 shadow-sm p-1 bg-white group-hover:scale-105 transition-transform"
                    >
                      <img
                        src={shop.logo}
                        alt={shop.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </Link>
                    {/* Verification checkmark badge */}
                    <div className="absolute top-0 right-0 bg-white rounded-full p-0.5 shadow-xs">
                      {shop.verificationStatus ? (
                        <CheckCircle className="size-5 text-blue-500 fill-blue-500 text-white" />
                      ) : (
                        <span className="inline-block size-4 rounded-full bg-red-500 text-white text-[10px] font-bold text-center leading-4">
                          ✕
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Shop Name */}
                  <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 h-10 hover:text-primary transition-colors">
                    <Link href={`/shop/${shop.slug}`}>{shop.name}</Link>
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2 text-xs text-amber-500">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            i < Math.floor(shop.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-500 font-medium ml-1">
                      ({shop.reviewCount} Reviews)
                    </span>
                  </div>

                  {/* Address */}
                  <p className="text-[11px] text-gray-400 line-clamp-1 mb-5">
                    {shop.address}
                  </p>

                  {/* Active eCommerce style Visit Store Button */}
                  <div className="mt-auto w-full">
                    <Link
                      href={`/shop/${shop.slug}`}
                      className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full text-xs font-bold text-primary border border-primary/40 bg-primary/5 hover:bg-primary hover:text-white transition-all duration-300 group-hover:border-primary shadow-xs"
                    >
                      <span>Visit Store</span>
                      <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
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
