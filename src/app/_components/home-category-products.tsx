import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ProductCard, type ProductCardProps } from "@/components/product/product-card"

interface CategorySectionProps {
  title: string
  slug: string
  subcategories: { name: string; slug: string }[]
  products: ProductCardProps[]
  accentColor?: string
}

export function HomeCategoryProducts({
  title,
  slug,
  subcategories,
  products,
  accentColor = "#d43533",
}: CategorySectionProps) {
  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Category Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 pb-2.5" style={{ borderColor: accentColor }}>
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-gray-900 sm:text-lg">
              {title}
            </h2>
          </div>

          {/* Subcategories (Desktop) & View All */}
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 md:flex">
              {subcategories.slice(0, 4).map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/products?category=${sub.slug}`}
                  className="text-xs text-gray-600 transition-colors hover:text-[#d43533]"
                >
                  {sub.name}
                </Link>
              ))}
            </div>

            <Link
              href={`/products?category=${slug}`}
              className="flex items-center gap-1 text-xs font-semibold text-[#d43533] hover:underline"
            >
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
          {products.map((prod) => (
            <ProductCard key={prod.id} {...prod} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeCategoryProducts
