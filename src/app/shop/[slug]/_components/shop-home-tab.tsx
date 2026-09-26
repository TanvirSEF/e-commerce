"use client"

import Link from "next/link"
import { ArrowRight, Tag } from "lucide-react"
import { ProductCard } from "@/components/product/product-card"
import { SeedProduct, SeedCoupon, SeedShop } from "@/db/seed/data"

interface ShopHomeTabProps {
  shop: SeedShop
  products: SeedProduct[]
  coupons: SeedCoupon[]
}

export function ShopHomeTab({ shop, products, coupons }: ShopHomeTabProps) {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 5)
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 5)

  return (
    <div className="space-y-8 py-6">
      {/* Featured Products */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Featured Products</h2>
          </div>
          <Link
            href={`/shop/${shop.slug}?tab=all-products`}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayProducts.map((p) => (
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
      </div>

      {/* Coupons Banner/List if available */}
      {coupons.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Tag className="size-5 text-amber-600" />
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Store Discount Coupons</h3>
            </div>
            <Link
              href={`/shop/${shop.slug}?tab=coupons`}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              See All Coupons
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coupons.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="bg-white border-2 border-dashed border-amber-300 rounded-md p-3.5 flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="text-xs font-bold text-amber-600 uppercase">
                    {c.discountType === "percent" ? `${c.discount}% OFF` : `৳${c.discount} OFF`}
                  </div>
                  <div className="text-xs font-mono font-bold text-gray-800 tracking-wider mt-0.5">
                    {c.code}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    Min Spend ৳{c.minBuy}
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(c.code)
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold rounded bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Store Products Preview */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">All Products from {shop.name}</h2>
          <Link
            href={`/shop/${shop.slug}?tab=all-products`}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((p) => (
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
      </div>
    </div>
  )
}
