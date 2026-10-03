import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Award } from "lucide-react"
import type { TopBrandItem } from "@/services/home-service"

interface TopBrandsSectionProps {
  brands?: TopBrandItem[]
}

export function TopBrandsSection({ brands = [] }: TopBrandsSectionProps) {
  if (brands.length === 0) return null

  return (
    <section className="bg-white py-7">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">
              <Award className="h-4 w-4 fill-white" />
            </div>
            <h2 className="text-base font-bold text-gray-900 sm:text-lg">
              Top Brands
            </h2>
          </div>

          <Link
            href="/brands"
            className="flex items-center gap-1 text-xs font-semibold text-[#3490f3] hover:underline"
          >
            <span>View All Brands</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.slug}`}
              className="group flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-white p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-red-100 hover:shadow-md"
            >
              <div className="relative mb-2 h-14 w-24 overflow-hidden transition-transform duration-200 group-hover:scale-105">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.currentTarget
                    if (!target.src.includes("placeholder.jpg")) {
                      target.src = "/assets/img/placeholder.jpg"
                    }
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 transition-colors group-hover:text-[#d43533] line-clamp-1">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopBrandsSection
