import React from "react"
import Link from "next/link"
import { Flame, ChevronRight } from "lucide-react"
import { ProductCard, type ProductCardProps } from "@/components/product/product-card"

interface TodaysDealSectionProps {
  products: ProductCardProps[]
}

export function TodaysDealSection({ products = [] }: TodaysDealSectionProps) {
  if (products.length === 0) return null

  return (
    <section className="bg-amber-50/40 py-6">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Header Bar */}
        <div className="mb-4 flex items-center justify-between border-b border-amber-200/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e62e04] text-white shadow-sm">
              <Flame className="h-4 w-4 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                Today&apos;s Deal
              </h2>
            </div>
            <span className="hidden rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#e62e04] uppercase sm:inline-block">
              Limited 24h Offers
            </span>
          </div>

          <Link
            href="/todays-deal"
            className="flex items-center gap-1 text-xs font-bold text-[#e62e04] transition-colors hover:underline"
          >
            <span>View All Deals</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
          {products.map((prod) => (
            <ProductCard key={prod.id} {...prod} badge="TODAY" />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TodaysDealSection
