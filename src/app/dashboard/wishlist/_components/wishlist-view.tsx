"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/context/auth-context"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { Trash2, ShoppingCart } from "lucide-react"
import { removeFromWishlistAction } from "@/app/actions/wishlist-actions"
import type { WishlistProductItem } from "@/services/customer-extra-service"

interface WishlistViewProps {
  initialItems?: WishlistProductItem[]
}

export function WishlistView({ initialItems = [] }: WishlistViewProps) {
  const { removeFromWishlist } = useAuth()
  const { addItem } = useCart()
  const [items, setItems] = useState<WishlistProductItem[]>(initialItems)

  const handleRemove = async (item: WishlistProductItem) => {
    // 1. Optimistic removal from UI list
    setItems((prev) => prev.filter((i) => i.id !== item.id))

    // 2. Sync with AuthContext (so Middle Header badge updates synchronously)
    removeFromWishlist(String(item.productId), item.id)

    // 3. Persist to PostgreSQL database
    try {
      await removeFromWishlistAction(item.id, item.productId)
    } catch (err) {
      console.error("Failed to remove item from wishlist DB:", err)
    }
  }

  const handleAddToCart = (item: WishlistProductItem) => {
    addItem({
      productId: String(item.productId),
      name: item.name,
      slug: item.slug,
      thumbnail: item.thumbnail,
      price: item.price,
      quantity: 1,
    })
  }

  return (
    <div className="space-y-4">
      {/* Titlebar Matching Laravel aiz-titlebar 1:1 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Wishlist</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {items.length} {items.length === 1 ? "item" : "items"} saved in your wishlist
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        /* Empty State Matching Laravel 1:1 */
        <div className="rounded border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-xs">
          <div className="relative mx-auto w-48 h-36 mb-4">
            <Image
              src="/assets/img/nothing.svg"
              alt="Nothing in wishlist"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h3 className="text-base font-bold text-gray-800">There isn&apos;t anything added yet</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            Explore our collections and tap the heart icon to save products for later!
          </p>
          <div className="mt-5">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors shadow-xs"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        /* 5-Column Grid with Continuous Light Borders Matching Laravel view_wishlist.blade.php 1:1 */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 border-t border-l border-gray-200 bg-white shadow-xs rounded-xs overflow-hidden">
          {items.map((item) => (
            <div
              key={item.id}
              className="border-r border-b border-gray-200 p-3.5 text-center transition-shadow hover:shadow-lg bg-white relative flex flex-col justify-between group"
            >
              <div>
                {/* Product Image Box */}
                <div className="relative aspect-square w-full overflow-hidden rounded bg-gray-50 mb-3">
                  <Link href={`/product/${item.slug}`} className="block h-full w-full">
                    <Image
                      src={item.thumbnail}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.currentTarget
                        if (!target.src.includes("placeholder.jpg")) {
                          target.src = "/assets/img/placeholder.jpg"
                        }
                      }}
                    />
                  </Link>

                  {/* Remove from Wishlist Trash Icon (top-right) */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 text-gray-400 hover:text-[#d43533] hover:bg-white flex items-center justify-center shadow-xs transition z-10"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Product Title */}
                <h5 className="text-xs sm:text-sm font-medium text-gray-800 hover:text-[#d43533] line-clamp-2 transition-colors mb-2 text-center leading-snug">
                  <Link href={`/product/${item.slug}`} title={item.name}>
                    {item.name}
                  </Link>
                </h5>

                {/* Product Price & Discount */}
                <div className="text-xs sm:text-sm mb-3">
                  <span className="font-bold text-[#d43533]">{formatPrice(item.price)}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <del className="text-xs text-gray-400 font-normal ml-1.5">
                      {formatPrice(item.originalPrice)}
                    </del>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={() => handleAddToCart(item)}
                className="w-full py-2 px-3 rounded bg-[#d43533] hover:bg-[#9d1b1a] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs mt-auto"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
