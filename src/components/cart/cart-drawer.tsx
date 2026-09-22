"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/context/cart-context"

export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, removeItem, updateQuantity } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-md flex-col bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#d43533]" />
              <h2 className="text-base font-bold text-gray-800">Shopping Cart</h2>
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-[#d43533]">
                {items.length}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-[#d43533]">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-800">Your cart is empty</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Looks like you haven&apos;t added any items to the cart yet.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-6 rounded bg-[#d43533] px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#9d1b1a]"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-3.5">
                    {/* Thumbnail */}
                    <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded border border-gray-100 bg-gray-50">
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/assets/img/placeholder.jpg"
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="text-xs font-medium text-gray-800 transition-colors line-clamp-2 hover:text-[#d43533]"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-[#d43533]"
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {item.variation && (
                          <div className="mt-0.5 text-[11px] text-gray-400">
                            {item.variation}
                          </div>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        {/* Quantity Counter */}
                        <div className="flex items-center rounded border border-gray-200">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-medium text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-xs font-bold text-[#d43533]">
                            ৳{(item.price * item.quantity).toLocaleString("en-BD")}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            ৳{item.price.toLocaleString("en-BD")} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50/70 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Subtotal</span>
                <span className="text-base font-bold text-gray-900">
                  ৳{subtotal.toLocaleString("en-BD")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="flex items-center justify-center rounded border border-[#d43533] bg-white py-2.5 text-xs font-bold text-[#d43533] transition-colors hover:bg-red-50"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center rounded bg-[#d43533] py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#9d1b1a]"
                >
                  Checkout Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartDrawer
