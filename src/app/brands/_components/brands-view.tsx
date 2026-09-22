"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Search } from "lucide-react"

interface BrandItem {
  id: string
  name: string
  slug: string
  logo: string
  top: boolean
  productCount: number
}

interface BrandsViewProps {
  brands: BrandItem[]
}

export function BrandsView({ brands }: BrandsViewProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-2">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">All Brands</h1>
            <p className="text-xs text-gray-500 mt-1">Discover products from verified official brands</p>
          </div>
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 mt-2 md:mt-0">
            <Link href="/" className="hover:text-[#d43533] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-800">&quot;All Brands&quot;</span>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 mb-6 border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search brand name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#d43533]"
            />
          </div>
          <span className="text-xs text-gray-500 hidden sm:inline">
            Showing <strong>{filteredBrands.length}</strong> brands
          </span>
        </div>

        {/* Brands Grid (Active eCommerce 1:1 Layout) */}
        <div className="bg-white border border-gray-200 p-4 md:p-6 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 border-t border-l border-gray-100">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="border-r border-b border-gray-100 p-4 text-center group hover:shadow-md transition-shadow relative bg-white"
              >
                <Link href={`/products?brand=${brand.slug}`} className="block">
                  <div className="w-24 h-24 mx-auto relative mb-3 group-hover:scale-105 transition-transform">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  </div>
                  <p className="text-sm font-bold text-gray-800 group-hover:text-[#d43533] transition-colors">
                    {brand.name}
                  </p>
                  <span className="text-xs text-gray-400 mt-0.5 block">
                    {brand.productCount}+ Products
                  </span>
                </Link>
              </div>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm">
              No brands found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
