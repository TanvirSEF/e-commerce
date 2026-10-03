import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Grid } from "lucide-react"

interface FeaturedCategoryItem {
  id: number
  name: string
  slug: string
  icon: string
  banner: string
}

interface FeaturedCategoriesProps {
  categories?: FeaturedCategoryItem[]
}

export function FeaturedCategories({ categories = [] }: FeaturedCategoriesProps) {
  if (categories.length === 0) return null

  return (
    <section className="bg-gray-50/50 py-6">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Section Header */}
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-50 text-[#3490f3]">
              <Grid className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-gray-900 sm:text-lg">
              Featured Categories
            </h2>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-1 text-xs font-semibold text-[#3490f3] hover:underline"
          >
            <span>All Categories</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-white p-3.5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-red-100 hover:shadow-md"
            >
              <div className="relative mb-2.5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-50 p-2 transition-transform duration-200 group-hover:scale-110">
                <Image
                  src={cat.icon || cat.banner || "/assets/img/placeholder.jpg"}
                  alt={cat.name}
                  fill
                  className="object-contain p-2"
                  onError={(e) => {
                    const target = e.currentTarget
                    if (!target.src.includes("placeholder.jpg")) {
                      target.src = "/assets/img/placeholder.jpg"
                    }
                  }}
                />
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
