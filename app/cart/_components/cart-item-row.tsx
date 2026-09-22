"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus } from "lucide-react"
import { CartItem, useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"

interface CartItemRowProps {
  item: CartItem
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { removeItem, updateQuantity, setQuantity, toggleSelectItem } = useCart()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-b-0">
      {/* Selection checkbox + Image + Title */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <label className="relative flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={item.selected}
            onChange={() => toggleSelectItem(item.id)}
            className="h-4 w-4 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533] cursor-pointer"
          />
        </label>

        {/* Thumbnail */}
        <Link
          href={`/product/${item.slug}`}
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-gray-100 bg-gray-50"
        >
          <Image
            src={item.thumbnail}
            alt={item.name}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = "/assets/img/placeholder.jpg"
            }}
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0 pr-2">
          <Link
            href={`/product/${item.slug}`}
            className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#d43533] transition-colors"
          >
            {item.name}
          </Link>
          {item.variation && (
            <div className="mt-1 text-xs text-gray-500">
              <span className="text-gray-400">Variation:</span> {item.variation}
            </div>
          )}
        </div>
      </div>

      {/* Price & Tax */}
      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8">
        <div className="text-left sm:text-right min-w-[90px]">
          <div className="text-xs text-gray-400">Price</div>
          <div className="text-sm font-bold text-gray-900">{formatPrice(item.price)}</div>
          <div className="text-[11px] text-gray-400">Tax: {formatPrice(item.tax || 0)}</div>
        </div>

        {/* Quantity Stepper */}
        <div className="flex items-center rounded border border-gray-200 bg-white">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, -1)}
            disabled={item.quantity <= 1}
            className="px-2.5 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              if (!isNaN(val)) setQuantity(item.id, val)
            }}
            className="w-10 border-0 p-0 text-center text-xs font-semibold text-gray-800 focus:outline-none focus:ring-0"
          />
          <button
            type="button"
            onClick={() => updateQuantity(item.id, 1)}
            className="px-2.5 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Line Total */}
        <div className="min-w-[90px] text-right">
          <div className="text-sm font-bold text-[#d43533]">
            {formatPrice(item.price * item.quantity)}
          </div>
        </div>

        {/* Remove Button */}
        <div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="p-1.5 text-gray-400 hover:text-[#d43533] rounded hover:bg-red-50 transition-colors"
            title="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
