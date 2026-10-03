import React from "react"
import Link from "next/link"
import { Sparkles, ChevronRight } from "lucide-react"
import { ProductCard, type ProductCardProps } from "@/components/product/product-card"

interface FeaturedProductsSectionProps {
  products: ProductCardProps[]
}

export function FeaturedProductsSection({ products = [] }: FeaturedProductsSectionProps) {
  if (products.length === 0) return null

  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Header Bar */}
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                Featured Products
              </h2>
            </div>
          </div>

          <Link
            href="/featured-products"
            className="flex items-center gap-1 text-xs font-semibold text-[#3490f3] hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
          {products.map((prod) => (
            <ProductCard key={prod.id} {...prod} badge={prod.badge || "FEATURED"} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProductsSection
