"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/context/auth-context"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { Trash2, ShoppingCart, Heart } from "lucide-react"

// Product catalog catalogue items matching wishlist IDs
const WISHLIST_PRODUCTS = [
  {
    id: "prod-1",
    name: "Classic Men's Casual Shirt - Slim Fit Cotton",
    slug: "classic-mens-casual-shirt",
    price: 1250,
    thumbnail: "/assets/img/placeholder.jpg",
  },
  {
    id: "prod-2",
    name: "Wireless Noise-Cancelling Bluetooth Over-Ear Headphones",
    slug: "wireless-noise-cancelling-headphones",
    price: 3450,
    thumbnail: "/assets/img/placeholder.jpg",
  },
  {
    id: "prod-3",
    name: "Smart Watch with Heart Rate & AMOLED Display",
    slug: "smart-watch-heart-rate-amoled",
    price: 2890,
    thumbnail: "/assets/img/placeholder.jpg",
  },
]

export function WishlistView() {
  const { wishlist, toggleWishlist } = useAuth()
  const { addItem } = useCart()

  const displayedProducts = WISHLIST_PRODUCTS.filter((p) => wishlist.includes(p.id))

  const handleAddToCart = (product: (typeof WISHLIST_PRODUCTS)[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      thumbnail: product.thumbnail,
      price: product.price,
      quantity: 1,
    })
  }

  return (
    <div className="rounded border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Wishlist</h1>
          <p className="text-xs text-gray-500">
            {displayedProducts.length} items saved in your wishlist
          </p>
        </div>
      </div>

      {displayedProducts.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#d43533] mb-3">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-gray-800">Your wishlist is empty</h3>
          <p className="mt-1 text-xs text-gray-500">
            Explore our collections and tap the heart icon to save products for later!
          </p>
          <div className="mt-5">
            <Link
              href="/products"
              className="inline-flex rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedProducts.map((p) => (
            <div
              key={p.id}
              className="rounded border border-gray-200 bg-white p-3 flex flex-col justify-between hover:shadow-md transition-shadow relative group"
            >
              {/* Remove button */}
              <button
                type="button"
                onClick={() => toggleWishlist(p.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm z-10"
                title="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div>
                <Link
                  href={`/product/${p.slug}`}
                  className="relative block aspect-square w-full overflow-hidden rounded bg-gray-50 mb-2.5"
                >
                  <Image
                    src={p.thumbnail}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/img/placeholder.jpg"
                    }}
                  />
                </Link>

                <Link
                  href={`/product/${p.slug}`}
                  className="block text-xs font-medium text-gray-800 hover:text-[#d43533] line-clamp-2 transition-colors mb-1.5"
                >
                  {p.name}
                </Link>

                <div className="text-sm font-bold text-[#d43533] mb-3">
                  {formatPrice(p.price)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddToCart(p)}
                className="flex items-center justify-center gap-1.5 w-full rounded bg-[#d43533] py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors shadow-sm"
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
