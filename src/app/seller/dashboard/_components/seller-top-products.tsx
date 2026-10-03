"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface ProductItem {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  rating: number
  thumbnail: string
  numOfSale: number
}

interface SellerTopProductsProps {
  products: ProductItem[]
}

export function SellerTopProducts({ products }: SellerTopProductsProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg bg-white border border-gray-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#d43533]">Top 12 Products</h3>
          <p className="text-xs text-gray-500">Your highest selling products in the catalog</p>
        </div>
        <Link
          href="/seller/products"
          className="text-xs font-semibold text-[#d43533] hover:underline"
        >
          View All Products
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {products.map((product) => (
          <div
            key={product.id}
            className="group rounded border border-gray-100 bg-white p-2.5 transition-all hover:shadow-md hover:border-gray-200 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-square w-full rounded overflow-hidden bg-gray-50 mb-2.5">
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  unoptimized
                />
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xs font-black text-[#d43533]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[10px] text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 my-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 ${
                        i < Math.round(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400">({product.numOfSale} sold)</span>
              </div>

              {/* Title */}
              <Link
                href={`/product/${product.slug}`}
                className="text-[11px] font-semibold text-gray-800 line-clamp-2 hover:text-[#d43533] transition-colors leading-tight"
                title={product.name}
              >
                {product.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
