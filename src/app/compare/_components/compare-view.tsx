"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Trash2, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/context/cart-context"

interface CompareItem {
  id: string
  name: string
  slug: string
  price: number
  originalPrice: number
  thumbnail: string
  category: string
  brand: string
  rating: number
}

interface CompareViewProps {
  initialItems: CompareItem[]
}

export function CompareView({ initialItems }: CompareViewProps) {
  const [items, setItems] = useState<CompareItem[]>(initialItems.slice(0, 3))
  const { addItem } = useCart()

  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = localStorage.getItem("active_compare_list")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed)
          }
        } catch {}
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id)
    setItems(updated)
    localStorage.setItem("active_compare_list", JSON.stringify(updated))
  }

  const resetCompare = () => {
    setItems([])
    localStorage.removeItem("active_compare_list")
  }

  const handleAddToCart = (product: CompareItem) => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
    })
  }

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Compare Products</h1>
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 mt-2 md:mt-0">
            <Link href="/" className="hover:text-[#d43533] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-800">&quot;Compare&quot;</span>
          </nav>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <h2 className="text-base font-bold text-gray-800">
              Comparing {items.length} Product{items.length !== 1 ? "s" : ""}
            </h2>
            {items.length > 0 && (
              <button
                type="button"
                onClick={resetCompare}
                className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
              >
                Reset Compare List
              </button>
            )}
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((prod) => (
                <div key={prod.id} className="border border-gray-200 relative group bg-white">
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(prod.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full z-10 transition-colors shadow-xs"
                    title="Remove from compare"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Name */}
                  <div className="p-4 border-b border-gray-100 min-h-[75px]">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                      Name
                    </span>
                    <Link
                      href={`/product/${prod.slug}`}
                      className="text-xs md:text-sm font-bold text-gray-800 line-clamp-2 hover:text-[#d43533] transition-colors"
                    >
                      {prod.name}
                    </Link>
                  </div>

                  {/* Image */}
                  <div className="p-4 border-b border-gray-100 text-center">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-2 text-left">
                      Image
                    </span>
                    <div className="relative w-36 h-36 mx-auto">
                      <Image
                        src={prod.thumbnail}
                        alt={prod.name}
                        fill
                        sizes="144px"
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="p-4 border-b border-gray-100">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                      Price
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold text-[#d43533]">৳{prod.price}</span>
                      {prod.originalPrice > prod.price && (
                        <del className="text-xs text-gray-400">৳{prod.originalPrice}</del>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="p-4 border-b border-gray-100">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                      Category
                    </span>
                    <span className="text-xs font-medium text-gray-700">{prod.category}</span>
                  </div>

                  {/* Brand */}
                  <div className="p-4 border-b border-gray-100">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                      Brand
                    </span>
                    <span className="text-xs font-medium text-gray-700">{prod.brand}</span>
                  </div>

                  {/* Add to Cart Action */}
                  <div className="p-4">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod)}
                      className="w-full py-2.5 bg-gray-900 hover:bg-[#d43533] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-base text-gray-600 mb-4">Your comparison list is empty.</p>
              <Link
                href="/products"
                className="inline-block px-6 py-2.5 bg-[#d43533] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#b82a28] transition-colors"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
