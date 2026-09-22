import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

const FEATURED_CATS = [
  { name: "Women Clothing", slug: "women-clothing-fashion", icon: "👗", bg: "bg-pink-50" },
  { name: "Men Clothing", slug: "men-clothing-fashion", icon: "👔", bg: "bg-blue-50" },
  { name: "Computers", slug: "computer-accessories", icon: "💻", bg: "bg-purple-50" },
  { name: "Cellphones", slug: "cellphones-tabs", icon: "📱", bg: "bg-amber-50" },
  { name: "Electronics", slug: "consumer-electronics", icon: "🎧", bg: "bg-emerald-50" },
  { name: "Beauty & Health", slug: "beauty-health-hair", icon: "💄", bg: "bg-rose-50" },
  { name: "Sports & Fitness", slug: "sports-outdoor", icon: "⚽", bg: "bg-indigo-50" },
  { name: "Home & Garden", slug: "home-garden", icon: "🏡", bg: "bg-teal-50" },
]

export function FeaturedCategories() {
  return (
    <section className="bg-gray-50/50 py-6">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Section Header */}
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900 sm:text-lg">
            Featured Categories
          </h2>
          <Link
            href="/categories"
            className="flex items-center gap-1 text-xs font-semibold text-[#3490f3] hover:underline"
          >
            <span>All Categories</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {FEATURED_CATS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-white p-3.5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-red-100 hover:shadow-md"
            >
              <div
                className={`mb-2.5 flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-transform duration-200 group-hover:scale-110 ${cat.bg}`}
              >
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700 transition-colors group-hover:text-[#d43533] line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCategories
