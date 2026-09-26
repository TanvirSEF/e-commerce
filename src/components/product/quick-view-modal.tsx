"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { X, Star, ShoppingBag, Zap, ExternalLink, Plus, Minus, Check } from "lucide-react"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"

export interface QuickViewProduct {
  id: string
  name: string
  slug: string
  thumbnail: string
  price: number
  originalPrice?: number
  discountPercent?: number
  rating?: number
  reviewCount?: number
  brand?: string
}

interface QuickViewModalProps {
  isOpen: boolean
  onClose: () => void
  product: QuickViewProduct | null
}

export function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!isOpen || !product) return null

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      thumbnail: product.thumbnail,
      price: product.price,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      thumbnail: product.thumbnail,
      price: product.price,
      quantity,
    })
    onClose()
    router.push("/checkout")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left: Product Image */}
          <div className="relative aspect-square w-full rounded-md bg-gray-50 overflow-hidden border border-gray-100">
            <Image
              src={product.thumbnail || "/assets/img/placeholder.jpg"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="absolute top-2 left-2 rounded bg-[#d43533] px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                -{product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="flex flex-col justify-between">
            <div>
              {product.brand && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#d43533]">
                  {product.brand}
                </span>
              )}

              <h2 className="text-base font-bold text-gray-900 line-clamp-2 mt-1">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-1.5 my-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(product.rating || 5)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  ({product.reviewCount || 12} reviews)
                </span>
                <span className="text-xs text-emerald-600 font-semibold ml-2">
                  • In Stock
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 my-3">
                <span className="text-2xl font-extrabold text-[#d43533]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Quantity Counter */}
              <div className="my-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Quantity:
                </label>
                <div className="flex items-center rounded border border-gray-300 w-fit">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 text-gray-600 hover:bg-gray-100"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded bg-red-50 border border-[#d43533] py-2 text-xs font-bold text-[#d43533] hover:bg-[#d43533] hover:text-white transition-colors"
                >
                  {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                  {added ? "Added to Cart!" : "Add to Cart"}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded bg-[#d43533] py-2 text-xs font-bold text-white hover:bg-[#b82a28] shadow-sm transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  Buy Now
                </button>
              </div>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-[#d43533] pt-1"
              >
                View Full Product Details
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
