"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, Heart, Eye, ShoppingBag, Shuffle } from "lucide-react"
import { useCart } from "@/lib/context/cart-context"
import { useAuth } from "@/lib/context/auth-context"
import { QuickViewModal } from "./quick-view-modal"

export interface ProductCardProps {
  id: string
  name: string
  slug: string
  thumbnail: string
  price: number
  originalPrice?: number
  discountPercent?: number
  rating?: number
  reviewCount?: number
  badge?: string
  brand?: string
}

export function ProductCard({
  id,
  name,
  slug,
  thumbnail,
  price,
  originalPrice,
  discountPercent,
  rating = 4.8,
  reviewCount = 12,
  badge,
  brand,
}: ProductCardProps) {
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useAuth()
  const inWishlist = isInWishlist(id)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [inCompare, setInCompare] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: id,
      name,
      slug,
      thumbnail,
      price,
      quantity: 1,
    })
  }

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const stored = localStorage.getItem("active_compare_list")
      let list: any[] = stored ? JSON.parse(stored) : []
      const exists = list.some((item) => item.id === id)
      if (exists) {
        list = list.filter((item) => item.id !== id)
        setInCompare(false)
      } else {
        list.push({
          id,
          name,
          slug,
          price,
          originalPrice: originalPrice || price,
          thumbnail,
          category: "General",
          brand: brand || "Active Brand",
          rating,
        })
        setInCompare(true)
      }
      localStorage.setItem("active_compare_list", JSON.stringify(list))
      window.dispatchEvent(new Event("storage"))
    } catch {}
  }

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-md border border-gray-100 bg-white transition-all duration-200 hover:border-gray-200 hover:shadow-lg">
        {/* Thumbnail & Badges Container */}
        <Link href={`/product/${slug}`} className="relative block aspect-square w-full overflow-hidden bg-gray-50">
          <Image
            src={thumbnail}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/assets/img/placeholder.jpg"
            }}
          />

          {/* Discount Badge */}
          {discountPercent && discountPercent > 0 && (
            <span className="absolute top-2 left-2 z-10 rounded bg-[#d43533] px-1.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}

          {badge && !discountPercent && (
            <span className="absolute top-2 left-2 z-10 rounded bg-[#3490f3] px-1.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
              {badge}
            </span>
          )}

          {/* Hover Action Overlay Icons Matching Active eCommerce */}
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {/* Wishlist */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleWishlist(id)
              }}
              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              className={`flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-colors ${
                inWishlist
                  ? "bg-[#d43533] text-white"
                  : "bg-white text-gray-600 hover:bg-[#d43533] hover:text-white"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${inWishlist ? "fill-current" : ""}`} />
            </button>

            {/* Compare */}
            <button
              type="button"
              onClick={handleToggleCompare}
              title={inCompare ? "Remove from Compare" : "Add to Compare"}
              className={`flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-colors ${
                inCompare
                  ? "bg-[#1967d2] text-white"
                  : "bg-white text-gray-600 hover:bg-[#1967d2] hover:text-white"
              }`}
            >
              <Shuffle className="h-3 w-3" />
            </button>

            {/* Quick View */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setQuickViewOpen(true)
              }}
              title="Quick View"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-colors hover:bg-[#3490f3] hover:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex flex-1 flex-col p-3">
          {/* Rating Stars */}
          <div className="mb-1.5 flex items-center gap-1">
            <div className="flex items-center text-[#ffc519]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating)
                      ? "fill-[#ffc519] text-[#ffc519]"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({reviewCount})</span>
          </div>

          {/* Title */}
          <Link
            href={`/product/${slug}`}
            className="mb-2 text-xs font-semibold text-gray-800 transition-colors line-clamp-2 hover:text-[#d43533]"
            title={name}
          >
            {name}
          </Link>

          {/* Price & Cart Button */}
          <div className="mt-auto flex items-center justify-between pt-1">
            <div>
              <div className="text-sm font-bold text-[#d43533]">
                ৳{price.toLocaleString("en-BD")}
              </div>
              {originalPrice && originalPrice > price && (
                <div className="text-[11px] text-gray-400 line-through">
                  ৳{originalPrice.toLocaleString("en-BD")}
                </div>
              )}
            </div>

            {/* Quick Add to Cart button */}
            <button
              type="button"
              onClick={handleAddToCart}
              title="Add to Cart"
              className="flex h-8 w-8 items-center justify-center rounded bg-red-50 text-[#d43533] transition-colors hover:bg-[#d43533] hover:text-white"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        product={{
          id,
          name,
          slug,
          thumbnail,
          price,
          originalPrice,
          discountPercent,
          rating,
          reviewCount,
          brand,
        }}
      />
    </>
  )
}

export default ProductCard
