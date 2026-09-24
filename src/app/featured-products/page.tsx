import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { getProducts } from "@/services/product-service"
import { ProductCard } from "@/components/product/product-card"
import { ChevronRight, Home, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Featured Products | Active eCommerce",
  description: "Explore hand-picked featured and trending collections on Active eCommerce",
}

interface PageProps {
  searchParams: Promise<{ sort?: string; page?: string }>
}

export default async function FeaturedProductsPage({ searchParams }: PageProps) {
  const { sort = "newest", page = "1" } = await searchParams
  const pageNum = parseInt(page, 10) || 1

  const { data: productsList, total } = await getProducts({
    featured: true,
    sort: sort as any,
    page: pageNum,
    limit: 18,
  })

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Featured Products</h1>
          </div>
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mt-2 sm:mt-0">
            <Link href="/" className="hover:text-[#d43533] transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-800">Featured Products</span>
          </nav>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-gray-600 font-medium">
            Showing <span className="font-bold text-gray-900">{productsList.length}</span> of{" "}
            <span className="font-bold text-gray-900">{total}</span> curated highlights
          </p>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 font-medium">Sort by:</label>
            <form action="/featured-products" method="GET">
              <select
                name="sort"
                defaultValue={sort}
                className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg outline-none bg-white text-gray-700"
              >
                <option value="newest">Featured First</option>
                <option value="rating">Top Rated</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
              </select>
            </form>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {productsList.map((product) => (
            <ProductCard
              key={product.id}
              id={String(product.id)}
              name={product.name}
              slug={product.slug}
              thumbnail={product.thumbnail}
              price={product.price}
              originalPrice={product.originalPrice}
              discountPercent={product.discountPercent}
              rating={product.rating}
              reviewCount={product.reviewCount}
              badge="Featured"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
