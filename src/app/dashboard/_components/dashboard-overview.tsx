"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/context/auth-context"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { Copy, Check, ChevronRight, Plus, Trash2, Heart, ShoppingBag, Eye } from "lucide-react"
import { AddAddressModal } from "./add-address-modal"
import type { CustomerAddressItem, WishlistProductItem } from "@/services/customer-extra-service"

interface DashboardOverviewProps {
  walletBalance: number
  totalExpenditure: number
  clubPoints: number
  totalOrders: number
  shippingAddress: CustomerAddressItem | null
  billingAddress: CustomerAddressItem | null
  wishlistProducts: WishlistProductItem[]
}

export function DashboardOverview({
  walletBalance,
  totalExpenditure,
  clubPoints,
  totalOrders,
  shippingAddress: initialShipping,
  billingAddress: initialBilling,
  wishlistProducts: initialWishlist,
}: DashboardOverviewProps) {
  const { wishlist, toggleWishlist } = useAuth()
  const { totalCount, addItem } = useCart()
  const [copied, setCopied] = useState(false)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<CustomerAddressItem | null>(initialShipping)
  const [wishlistItems, setWishlistItems] = useState<WishlistProductItem[]>(initialWishlist)

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("WELCOME10")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRemoveWishlist = async (productId: number) => {
    setWishlistItems((prev) => prev.filter((p) => p.productId !== productId))
    try {
      toggleWishlist(String(productId))
    } catch {
      // rollback or ignore
    }
  }

  return (
    <div className="space-y-5">
      {/* 1. Welcome Coupon Alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded border border-[#3490F3] bg-[#f0f7ff] p-4">
        <div className="text-xs sm:text-sm text-[#1967d2]">
          Welcome Coupon <strong>10%</strong> Discount on your Purchase Within <strong>30</strong> days
          of Registration (Code: <strong>WELCOME10</strong>)
        </div>
        <button
          type="button"
          onClick={handleCopyCoupon}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-[#3490F3] px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-xs"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy coupon Code"}
        </button>
      </div>

      {/* 2. Top Row: 3 Stat Cards (Wallet, Expenditure, Club Points) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wallet Balance Card with wallet-bg.png */}
        <div
          className="relative rounded overflow-hidden p-5 shadow-xs flex flex-col justify-between min-h-[160px] text-white"
          style={{
            backgroundImage: "url('/assets/img/wallet-bg.png')",
            backgroundColor: "#1e293b",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div>
            <p className="text-xs font-normal text-gray-300 mb-2">Wallet Balance</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {formatPrice(walletBalance)}
            </h2>
          </div>
          <div>
            <hr className="border border-dashed border-white/30 my-3" />
            <Link
              href="/dashboard/wallet"
              className="text-xs font-semibold text-white/90 hover:text-white hover:underline inline-flex items-center gap-1"
            >
              + Recharge Wallet
            </Link>
          </div>
        </div>

        {/* Total Expenditure Card */}
        <div className="rounded p-5 shadow-xs bg-[#d43533] text-white flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center gap-3.5">
            {/* SVG Circle Icon Matching Laravel 1:1 */}
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div>
              <span className="text-xs text-white/80 block mb-0.5">Total Expenditure</span>
              <span className="text-xl sm:text-2xl font-bold">{formatPrice(totalExpenditure)}</span>
            </div>
          </div>
          <div className="pt-3">
            <Link
              href="/dashboard/purchase-history"
              className="text-xs text-white/90 hover:text-white font-medium inline-flex items-center gap-1 hover:underline"
            >
              View Order History
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Total Club Points Card */}
        <div className="rounded p-5 shadow-xs bg-[#ffc519] text-gray-950 flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center gap-3.5">
            {/* SVG Circle Icon Matching Laravel 1:1 */}
            <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center shrink-0 text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
            </div>
            <div>
              <span className="text-xs text-gray-800 font-medium block mb-0.5">Total Club Points</span>
              <span className="text-xl sm:text-2xl font-bold">{clubPoints} pts</span>
            </div>
          </div>
          <div className="pt-3">
            <Link
              href="/dashboard/club-points"
              className="text-xs text-gray-950 font-bold inline-flex items-center gap-1 hover:underline"
            >
              Convert Club Points
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: 3 Columns Matching Laravel 1:1 (Summary Box + Shipping Address + Billing Address) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Col 1: Count Summary Box (Stacked Cart, Wishlist, Ordered) */}
        <div className="bg-white rounded border border-gray-200 px-5 py-2 shadow-xs flex flex-col justify-between">
          {/* Cart Summary */}
          <Link
            href="/cart"
            className="flex items-center gap-3.5 py-4 border-b border-gray-100 hover:opacity-80 transition group"
          >
            <div className="w-12 h-12 rounded-full bg-[#d43533] flex items-center justify-center shrink-0 text-white shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 group-hover:text-[#d43533] transition-colors leading-none mb-1">
                {String(totalCount).padStart(2, "0")}
              </div>
              <div className="text-xs text-gray-500 font-normal">Products in Cart</div>
            </div>
          </Link>

          {/* Wishlist Summary */}
          <Link
            href="/dashboard/wishlist"
            className="flex items-center gap-3.5 py-4 border-b border-gray-100 hover:opacity-80 transition group"
          >
            <div className="w-12 h-12 rounded-full bg-[#3490f3] flex items-center justify-center shrink-0 text-white shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 group-hover:text-[#3490f3] transition-colors leading-none mb-1">
                {String(wishlistItems.length || wishlist.length).padStart(2, "0")}
              </div>
              <div className="text-xs text-gray-500 font-normal">Products in Wishlist</div>
            </div>
          </Link>

          {/* Ordered Summary */}
          <Link
            href="/dashboard/purchase-history"
            className="flex items-center gap-3.5 py-4 hover:opacity-80 transition group"
          >
            <div className="w-12 h-12 rounded-full bg-[#ffc519] flex items-center justify-center shrink-0 text-gray-950 shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 group-hover:text-[#ffc519] transition-colors leading-none mb-1">
                {String(totalOrders).padStart(2, "0")}
              </div>
              <div className="text-xs text-gray-500 font-normal">Products Ordered</div>
            </div>
          </Link>
        </div>

        {/* Col 2: Default Shipping Address Card */}
        <div className="bg-white rounded border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h6 className="text-sm font-bold text-gray-900 mb-3">Default Shipping Address</h6>
            {shippingAddress ? (
              <ul className="text-xs text-gray-700 space-y-1 mb-5 leading-relaxed">
                <li className="font-semibold text-gray-900">{shippingAddress.address},</li>
                {shippingAddress.city && (
                  <li>
                    {shippingAddress.postalCode ? `${shippingAddress.postalCode} - ` : ""}
                    {shippingAddress.city},
                  </li>
                )}
                {shippingAddress.state && <li>{shippingAddress.state},</li>}
                <li className="text-gray-600">{shippingAddress.country}.</li>
                {shippingAddress.phone && (
                  <li className="text-gray-500 pt-1 font-mono">{shippingAddress.phone}</li>
                )}
              </ul>
            ) : (
              <div className="text-xs text-gray-400 mb-6 py-2">
                No default shipping address set.
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setAddressModalOpen(true)}
            className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 transition-colors mt-auto shadow-xs"
          >
            <Plus className="w-4 h-4 font-bold" />
            Add New Address
          </button>
        </div>

        {/* Col 3: Default Billing Address Card */}
        <div className="bg-white rounded border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h6 className="text-sm font-bold text-gray-900 mb-3">Default Billing Address</h6>
            {initialBilling || shippingAddress ? (
              <ul className="text-xs text-gray-700 space-y-1 mb-5 leading-relaxed">
                <li className="font-semibold text-gray-900">
                  {(initialBilling || shippingAddress)!.address},
                </li>
                {(initialBilling || shippingAddress)!.city && (
                  <li>
                    {(initialBilling || shippingAddress)!.postalCode
                      ? `${(initialBilling || shippingAddress)!.postalCode} - `
                      : ""}
                    {(initialBilling || shippingAddress)!.city},
                  </li>
                )}
                {(initialBilling || shippingAddress)!.state && (
                  <li>{(initialBilling || shippingAddress)!.state},</li>
                )}
                <li className="text-gray-600">{(initialBilling || shippingAddress)!.country}.</li>
                {(initialBilling || shippingAddress)!.phone && (
                  <li className="text-gray-500 pt-1 font-mono">
                    {(initialBilling || shippingAddress)!.phone}
                  </li>
                )}
              </ul>
            ) : (
              <div className="text-xs text-gray-400 mb-6 py-2">
                Same as default shipping address.
              </div>
            )}
          </div>
          <Link
            href="/dashboard/profile"
            className="w-full py-2.5 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 transition-colors mt-auto"
          >
            Manage Addresses
          </Link>
        </div>
      </div>

      {/* 4. Third Section: My Wishlist Matching Laravel 1:1 */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-gray-900">My Wishlist</h3>
          <Link
            href="/dashboard/wishlist"
            className="text-xs font-bold text-blue-600 hover:text-[#d43533] transition-colors"
          >
            View All
          </Link>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
            {wishlistItems.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="group relative bg-white rounded border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between p-3"
              >
                {/* Image Container with hover zoom */}
                <div className="relative aspect-square w-full rounded overflow-hidden bg-gray-50 mb-2.5">
                  <Link href={`/product/${item.slug}`} className="block h-full w-full">
                    <Image
                      src={item.thumbnail || "/assets/img/placeholder.jpg"}
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

                  {/* Remove from Wishlist Trash Button (top-right) */}
                  <button
                    type="button"
                    onClick={() => handleRemoveWishlist(item.productId)}
                    title="Remove from wishlist"
                    className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-white/90 text-gray-400 hover:text-[#d43533] hover:bg-white flex items-center justify-center shadow-xs transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-xs font-semibold text-gray-800 hover:text-[#d43533] transition-colors line-clamp-2 leading-tight"
                  >
                    {item.name}
                  </Link>
                  <div className="text-xs font-bold text-[#d43533]">
                    {formatPrice(item.price)}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      productId: String(item.productId),
                      name: item.name,
                      slug: item.slug,
                      price: item.price,
                      thumbnail: item.thumbnail,
                      quantity: 1,
                    })
                  }
                  className="mt-3 w-full py-1.5 px-3 rounded text-[11px] font-bold border border-gray-200 text-gray-700 bg-white hover:bg-[#d43533] hover:border-[#d43533] hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-400 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <Heart className="w-6 h-6" />
            </div>
            <p className="text-xs text-gray-500">You haven&apos;t added any products to your wishlist yet.</p>
            <Link
              href="/products"
              className="inline-block px-5 py-2 rounded bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold transition shadow-xs"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>

      {/* Address Modal */}
      <AddAddressModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onAddressAdded={(newAddr) => {
          setShippingAddress(newAddr)
        }}
      />
    </div>
  )
}
