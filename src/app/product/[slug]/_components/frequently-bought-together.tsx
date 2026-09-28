"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, ChevronRight } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/context/cart-context"
import type { FrequentlyBoughtItem } from "@/services/frequently-bought-service"

interface FrequentlyBoughtTogetherProps {
  products: FrequentlyBoughtItem[]
}

export function FrequentlyBoughtTogether({ products }: FrequentlyBoughtTogetherProps) {
  const { addItem } = useCart()

  if (!products || products.length === 0) {
    return null
  }

  const handleQuickAdd = (p: FrequentlyBoughtItem) => {
    addItem({
      productId: String(p.id),
      name: p.name,
      slug: p.slug,
      thumbnail: p.thumbnail,
      price: p.price,
      quantity: 1,
    })
  }

  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            Frequently Bought Together
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Customers who viewed this item also bought these products
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold text-[#d43533] hover:underline flex items-center gap-0.5"
        >
          View More <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between rounded-md border border-gray-100 bg-white p-2.5 transition-all hover:border-gray-300 hover:shadow-md"
          >
            <div>
              <Link href={`/product/${item.slug}`} className="block relative aspect-square overflow-hidden rounded bg-gray-50">
                <Image
                  src={item.thumbnail || "/assets/img/placeholder.jpg"}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {item.discountPercent > 0 && (
                  <span className="absolute top-1.5 left-1.5 rounded bg-[#d43533] px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    -{item.discountPercent}%
                  </span>
                )}
              </Link>

              <h3 className="mt-2.5 text-xs font-medium text-gray-800 line-clamp-2 leading-relaxed group-hover:text-[#d43533]">
                <Link href={`/product/${item.slug}`}>{item.name}</Link>
              </h3>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#d43533]">
                  {formatPrice(item.price)}
                </span>
                {item.originalPrice > item.price && (
                  <del className="block text-[11px] font-medium text-gray-400">
                    {formatPrice(item.originalPrice)}
                  </del>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleQuickAdd(item)}
                title="Add to Cart"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-[#d43533] hover:text-white"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
