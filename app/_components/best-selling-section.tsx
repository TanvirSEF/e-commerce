import React from "react"
import Link from "next/link"
import { Flame, ChevronRight } from "lucide-react"
import { ProductCard, type ProductCardProps } from "@/components/product/product-card"

const BEST_SELLERS: ProductCardProps[] = [
  {
    id: "bs-1",
    name: "Noise Cancelling Over-Ear Wireless Bluetooth Headphone Pro",
    slug: "noise-cancelling-wireless-headphone",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 3450,
    originalPrice: 4200,
    discountPercent: 18,
    rating: 4.9,
    reviewCount: 94,
    badge: "HOT",
  },
  {
    id: "bs-2",
    name: "Classic Stainless Steel Quartz Men Waterproof Wrist Watch",
    slug: "classic-stainless-steel-men-watch",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1850,
    originalPrice: 2500,
    discountPercent: 26,
    rating: 4.8,
    reviewCount: 67,
  },
  {
    id: "bs-3",
    name: "Ergonomic High-Back Mesh Office & Gaming Chair Swivel",
    slug: "ergonomic-high-back-office-chair",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 6800,
    originalPrice: 8500,
    discountPercent: 20,
    rating: 4.7,
    reviewCount: 42,
  },
  {
    id: "bs-4",
    name: "Fast Charging 20000mAh Power Bank with Dual USB Ports & Type-C",
    slug: "fast-charging-20000mah-power-bank",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1250,
    originalPrice: 1750,
    discountPercent: 28,
    rating: 4.9,
    reviewCount: 112,
  },
  {
    id: "bs-5",
    name: "Breathable Lightweight Athletic Running Shoes for Men & Women",
    slug: "breathable-athletic-running-shoes",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1450,
    originalPrice: 2100,
    discountPercent: 31,
    rating: 4.8,
    reviewCount: 53,
  },
]

export function BestSellingSection() {
  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white">
              <Flame className="h-4 w-4 fill-white" />
            </div>
            <h2 className="text-base font-bold text-gray-900 sm:text-lg">
              Best Selling Products
            </h2>
          </div>

          <Link
            href="/products?sort_by=num_sale,desc"
            className="flex items-center gap-1 text-xs font-semibold text-[#d43533] transition-colors hover:text-[#9d1b1a]"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
          {BEST_SELLERS.map((prod) => (
            <ProductCard key={prod.id} {...prod} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSellingSection
