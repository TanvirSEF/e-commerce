"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Star,
  Heart,
  RefreshCw,
  Share2,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  Ruler,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react"
import { useCart } from "@/lib/context/cart-context"
import { useAuth } from "@/lib/context/auth-context"
import { SizeGuideModal } from "./size-guide-modal"
import { SocialShareModal } from "./social-share-modal"
import { ProductSellerBox } from "./product-seller-box"
import { ProductWarrantyBadges } from "./product-warranty-badges"
import { ProductWholesaleBox } from "./product-wholesale-box"



export interface ProductDetailsData {
  id: string
  name: string
  slug: string
  sku: string
  brandName?: string
  brandSlug?: string
  price: number
  originalPrice?: number
  discountPercent?: number
  rating: number
  reviewCount: number
  stock: number
  colors?: { name: string; hex: string }[]
  sizes?: string[]
  thumbnail: string
  clubPoints?: number
  sellerName?: string
  sellerSlug?: string
  wholesaleTiers?: { minQty: number; maxQty: number; price: number }[]
}

export function ProductInfo({ product }: { product: ProductDetailsData }) {
  const router = useRouter()
  const { addItem } = useCart()

  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : ""
  )
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
  )
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [skuCopied, setSkuCopied] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isCopied, setIsCopied] = useState(false)
  const { toggleWishlist, isInWishlist } = useAuth()
  const inWishlist = isInWishlist(product.id)
  const [inCompare, setInCompare] = useState(false)
  const [compareFeedback, setCompareFeedback] = useState("")

  const handleToggleCompare = () => {
    try {
      const stored = localStorage.getItem("active_compare_list")
      let list: any[] = stored ? JSON.parse(stored) : []
      const exists = list.some((item) => item.id === product.id)
      if (exists) {
        list = list.filter((item) => item.id !== product.id)
        setInCompare(false)
        setCompareFeedback("Removed from compare")
      } else {
        list.push({
          id: product.id,
          name: product.name,
          price: product.price,
          thumbnail: product.thumbnail || "/assets/img/placeholder.jpg",
          brand: product.brandName || "Active eCommerce",
          category: "Products",
          rating: product.rating || 5,
        })
        setInCompare(true)
        setCompareFeedback("Added to compare!")
      }
      localStorage.setItem("active_compare_list", JSON.stringify(list))
      window.dispatchEvent(new Event("storage"))
      setTimeout(() => setCompareFeedback(""), 2500)
    } catch {}
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const updated = prev + delta
      return updated >= 1 && updated <= product.stock ? updated : prev
    })
  }

  const variationString = [selectedColor, selectedSize].filter(Boolean).join(" / ")

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      thumbnail: product.thumbnail,
      price: effectivePrice,
      quantity,
      variation: variationString,
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push("/checkout")
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const activeWholesaleTier = product.wholesaleTiers?.find(
    (t) => quantity >= t.minQty && quantity <= t.maxQty
  )
  const effectivePrice = activeWholesaleTier ? activeWholesaleTier.price : product.price

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Top Actions: Compare, Wishlist, Share */}
      <div className="flex items-center justify-end gap-4 border-b border-gray-100 pb-2 text-gray-500">
        <button
          type="button"
          onClick={handleToggleCompare}
          className={`flex items-center gap-1.5 transition-colors ${
            inCompare ? "font-bold text-[#d43533]" : "hover:text-[#d43533]"
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{compareFeedback || (inCompare ? "In Compare" : "Compare")}</span>
        </button>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`flex items-center gap-1.5 transition-colors ${
            inWishlist ? "font-bold text-[#d43533]" : "hover:text-[#d43533]"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${inWishlist ? "fill-current text-[#d43533]" : ""}`} />
          <span>{inWishlist ? "In Wishlist" : "Wishlist"}</span>
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 transition-colors hover:text-[#d43533]"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Share</span>
        </button>
      </div>


      {/* Product Title */}
      <h1 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
        {product.name}
      </h1>

      {/* Brand & SKU */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex flex-wrap items-center gap-3">
          {product.brandName && (
            <div>
              <span className="text-gray-400">Brand: </span>
              <Link
                href={`/products?brand=${product.brandSlug || ""}`}
                className="font-semibold text-[#3490f3] hover:underline"
              >
                {product.brandName}
              </Link>
            </div>
          )}
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">SKU: </span>
            <span className="font-mono text-gray-700">{product.sku}</span>
            <button
              type="button"
              title="Copy SKU"
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(product.sku)
                  setSkuCopied(true)
                  setTimeout(() => setSkuCopied(false), 2000)
                }
              }}
              className="text-gray-400 hover:text-gray-700"
            >
              {skuCopied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("open-product-qa"))
              }
              const el = document.getElementById("product-qa-section")
              if (el) {
                el.scrollIntoView({ behavior: "smooth" })
              }
            }}
            className="flex items-center gap-1 text-[#3490f3] hover:underline"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Ask about this product</span>
          </button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center text-[#ffc519]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-[#ffc519] text-[#ffc519]"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="font-bold text-gray-700">({product.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Price Box */}
      <div className="rounded-md border border-gray-100 bg-gray-50/70 p-4">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-extrabold text-[#d43533]">
            ৳{effectivePrice.toLocaleString("en-BD")}
          </span>
          {activeWholesaleTier ? (
            <span className="rounded bg-indigo-600 px-2 py-0.5 text-[11px] font-bold text-white">
              Wholesale Tier Applied ({activeWholesaleTier.minQty}–{activeWholesaleTier.maxQty} pcs)
            </span>
          ) : (
            <>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ৳{product.originalPrice.toLocaleString("en-BD")}
                </span>
              )}
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="rounded bg-[#d43533] px-2 py-0.5 text-[11px] font-bold text-white">
                  -{product.discountPercent}% OFF
                </span>
              )}
            </>
          )}
        </div>

        {/* Wholesale Tiers */}
        <ProductWholesaleBox tiers={product.wholesaleTiers} quantity={quantity} />


        {product.clubPoints && (
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
            <span>🪙 Earn {product.clubPoints} Club Points with this purchase</span>
          </div>
        )}
      </div>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-700">
            Color: <span className="font-bold text-gray-900">{selectedColor}</span>
          </div>
          <div className="flex gap-2">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c.name)}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                className={`h-7 w-7 rounded-full border border-gray-300 transition-all ${
                  selectedColor === c.name
                    ? "scale-110 ring-2 ring-[#d43533] ring-offset-2"
                    : "hover:scale-105"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between font-semibold text-gray-700">
            <div>
              Size: <span className="font-bold text-gray-900">{selectedSize}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowSizeGuide(true)}
              className="flex items-center gap-1 text-[11px] font-medium text-[#d43533] hover:underline"
            >
              <Ruler className="h-3 w-3" />
              <span>Size Guide</span>
            </button>
          </div>
          <div className="flex gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s)}
                className={`rounded border px-3 py-1.5 font-semibold transition-all ${
                  selectedSize === s
                    ? "border-[#d43533] bg-red-50 text-[#d43533]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Stock Availability */}
      <div>
        <div className="mb-2 font-semibold text-gray-700">Quantity:</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded border border-gray-300 bg-white">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center font-bold text-gray-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-xs font-semibold text-emerald-600">
            ({product.stock} available in stock)
          </span>
        </div>
      </div>

      {/* Subtotal preview */}
      <div className="border-t border-gray-100 pt-3">
        <span className="text-gray-500">Total Price: </span>
        <span className="text-base font-extrabold text-[#d43533]">
          ৳{(product.price * quantity).toLocaleString("en-BD")}
        </span>
      </div>

      {/* Action Buttons: Add to Cart & Buy Now */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-2 rounded bg-[#d43533] py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[#9d1b1a]"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex items-center justify-center gap-2 rounded bg-[#ffc519] py-3 text-xs font-bold text-gray-950 shadow-md transition-all hover:bg-[#dbaa17]"
        >
          <Zap className="h-4 w-4 fill-current" />
          <span>Buy Now</span>
        </button>
      </div>

      {/* Seller Box */}
      <ProductSellerBox sellerName={product.sellerName} sellerSlug={product.sellerSlug} />

      {/* Warranty & Guarantee Badges */}
      <ProductWarrantyBadges />


      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />

      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        productName={product.name}
      />
    </div>
  )
}

export default ProductInfo
