"use client"

import { useState } from "react"
import { Star, Filter, ArrowUpDown } from "lucide-react"
import { ProductCard } from "@/components/product/product-card"
import { SeedProduct } from "@/db/seed/data"

interface ShopProductsTabProps {
  products: SeedProduct[]
  title?: string
}

export function ShopProductsTab({ products, title = "All Products" }: ShopProductsTabProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<number | "">("")
  const [maxPrice, setMaxPrice] = useState<number | "">("")
  const [minRating, setMinRating] = useState<number | null>(null)
  const [sort, setSort] = useState<string>("default")

  // Extract unique categories from current products
  const categories = Array.from(new Set(products.map((p) => p.categorySlug)))

  const handleCategoryToggle = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    )
  }

  // Filter
  let filtered = products.filter((p) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.categorySlug)) {
      return false
    }
    if (minPrice !== "" && p.price < minPrice) return false
    if (maxPrice !== "" && p.price > maxPrice) return false
    if (minRating !== null && p.rating < minRating) return false
    return true
  })

  // Sort
  if (sort === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price)
  } else if (sort === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price)
  } else if (sort === "rating") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating)
  }

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500 mt-0.5">Showing {filtered.length} products</p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="size-4 text-gray-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-primary"
          >
            <option value="default">Default Sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filter Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-1.5">
                <Filter className="size-3.5 text-primary" />
                <span>Categories</span>
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="rounded border-gray-300 text-primary focus:ring-primary size-3.5"
                    />
                    <span className="capitalize">{cat.replace(/-/g, " ")}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-3">
              Price Range (৳)
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white"
              />
            </div>
          </div>

          {/* Ratings */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-3">
              Customer Rating
            </h3>
            <div className="space-y-2">
              {[5, 4, 3].map((r) => (
                <label key={r} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="shop_rating"
                    checked={minRating === r}
                    onChange={() => setMinRating(minRating === r ? null : r)}
                    className="text-primary focus:ring-primary size-3.5"
                  />
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3 ${
                          i < r ? "fill-amber-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 text-[11px]">& Up</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Products Grid */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-500 text-sm">No products found matching your filters.</p>
              <button
                onClick={() => {
                  setSelectedCategories([])
                  setMinPrice("")
                  setMaxPrice("")
                  setMinRating(null)
                }}
                className="mt-3 px-4 py-1.5 text-xs font-bold text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  thumbnail={p.thumbnail}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  discountPercent={p.discountPercent}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
