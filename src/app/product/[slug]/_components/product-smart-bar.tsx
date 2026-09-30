"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, Zap, Check } from "lucide-react"

import { type SmartBarSettings } from "@/services/settings-service"

interface ProductSmartBarProps {
  id: string
  name: string
  slug?: string
  price: number
  originalPrice?: number
  thumbnail: string
  colors?: { name: string; hex: string }[]
  sizes?: string[]
  settings?: SmartBarSettings
}

export function ProductSmartBar({
  id,
  name,
  slug,
  price,
  originalPrice,
  thumbnail,
  settings,
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

  if (settings && settings.showSmartBar === false) return null
  if (!isVisible) return null

  const isBlur = settings?.backgroundDesign === "blur"
  const isLightText = settings?.textColor === "white"
  const bgColor = settings?.backgroundColor || "#ffffff"
  const btnColor = settings?.buttonColor || "#d43533"
  const btnTextWhite = settings?.buttonTextColor !== "dark"

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t shadow-2xl transition-all duration-300 transform translate-y-0 ${
        isBlur ? "backdrop-blur-md bg-opacity-85" : ""
      }`}
      style={{
        backgroundColor: bgColor,
        borderColor: isLightText ? "rgba(255,255,255,0.15)" : "#e5e7eb",
        color: isLightText ? "#ffffff" : "#1e293b",
      }}
    >
      <div className="mx-auto max-w-[1240px] px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Product Summary Left */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={thumbnail}
            alt={name}
            className="w-11 h-11 object-cover rounded-lg border border-gray-200 flex-shrink-0"
          />
          <div className="min-w-0">
            <h3
              className={`text-xs sm:text-sm font-bold truncate ${
                isLightText ? "text-white" : "text-gray-800"
              }`}
            >
              {name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm sm:text-base font-extrabold text-[#d43533]">
                {formatPrice(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span
                  className={`text-xs line-through ${
                    isLightText ? "text-gray-300" : "text-gray-400"
                  }`}
                >
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
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            <span className="hidden sm:inline">{added ? "Added!" : "Add to Cart"}</span>
          </button>
          <button
            onClick={handleBuyNow}
            style={{ backgroundColor: btnColor }}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer hover:opacity-90 ${
              btnTextWhite ? "text-white" : "text-slate-900"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  )
}
