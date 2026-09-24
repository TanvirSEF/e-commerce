"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, Zap, Check } from "lucide-react"

interface ProductSmartBarProps {
  id: string
  name: string
  slug?: string
  price: number
  originalPrice?: number
  thumbnail: string
  colors?: { name: string; hex: string }[]
  sizes?: string[]
}

export function ProductSmartBar({
  id,
  name,
  slug,
  price,
  originalPrice,
  thumbnail,
}: ProductSmartBarProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [isVisible, setIsVisible] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name,
      slug: slug || id,
      thumbnail,
      price,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addItem({
      productId: id,
      name,
      slug: slug || id,
      thumbnail,
      price,
      quantity: 1,
    })
    router.push("/checkout")
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl transition-all duration-300 transform translate-y-0">
      <div className="mx-auto max-w-[1240px] px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Product Summary Left */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={thumbnail}
            alt={name}
            className="w-11 h-11 object-cover rounded-lg border border-gray-200 flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 truncate">{name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm sm:text-base font-extrabold text-[#d43533]">
                {formatPrice(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            <span className="hidden sm:inline">{added ? "Added!" : "Add to Cart"}</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="px-4 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  )
}
