"use client"

import React from "react"
import Link from "next/link"
import { X, ChevronRight, User, ShieldCheck } from "lucide-react"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES = [
  { name: "Women Clothing & Fashion", slug: "women-clothing-fashion", icon: "👗" },
  { name: "Men Clothing & Fashion", slug: "men-clothing-fashion", icon: "👔" },
  { name: "Computer & Accessories", slug: "computer-accessories", icon: "💻" },
  { name: "Cellphones & Tabs", slug: "cellphones-tabs", icon: "📱" },
  { name: "Consumer Electronics", slug: "consumer-electronics", icon: "🎧" },
  { name: "Beauty, Health & Hair", slug: "beauty-health-hair", icon: "💄" },
  { name: "Sports & Outdoor", slug: "sports-outdoor", icon: "⚽" },
]

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 flex max-w-full pr-10">
        <div className="flex w-screen max-w-xs flex-col bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-[#00002e] px-4 py-3.5 text-white">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#d43533]">Active</span>
              <span className="text-base font-bold text-white">Shop</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Banner */}
          <div className="border-b border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm">
                <User className="h-5 w-5 text-[#d43533]" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Welcome to ActiveShop</div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#d43533]">
                  <Link href="/login" onClick={onClose} className="hover:underline">
                    Login
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link href="/register" onClick={onClose} className="hover:underline">
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {/* Quick Pages */}
            <div className="mb-4">
              <div className="mb-2 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                Browse
              </div>
              <ul className="flex flex-col gap-1">
                <li>
                  <Link
                    href="/"
                    onClick={onClose}
                    className="flex items-center justify-between rounded px-2.5 py-2 text-xs font-semibold text-gray-800 hover:bg-red-50 hover:text-[#d43533]"
                  >
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/flash-deals"
                    onClick={onClose}
                    className="flex items-center justify-between rounded px-2.5 py-2 text-xs font-semibold text-gray-800 hover:bg-red-50 hover:text-[#d43533]"
                  >
                    <span>Flash Deals</span>
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-[#d43533]">
                      HOT
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    onClick={onClose}
                    className="flex items-center justify-between rounded px-2.5 py-2 text-xs font-semibold text-gray-800 hover:bg-red-50 hover:text-[#d43533]"
                  >
                    <span>All Categories</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/brands"
                    onClick={onClose}
                    className="flex items-center justify-between rounded px-2.5 py-2 text-xs font-semibold text-gray-800 hover:bg-red-50 hover:text-[#d43533]"
                  >
                    <span>All Brands</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/coupons"
                    onClick={onClose}
                    className="flex items-center justify-between rounded px-2.5 py-2 text-xs font-semibold text-gray-800 hover:bg-red-50 hover:text-[#d43533]"
                  >
                    <span>Coupons</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="mb-4 border-t border-gray-100 pt-3">
              <div className="mb-2 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                Featured Categories
              </div>
              <ul className="flex flex-col gap-1">
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between rounded px-2.5 py-2 text-xs text-gray-700 hover:bg-red-50 hover:text-[#d43533]"
                    >
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Seller Link */}
            <div className="border-t border-gray-100 pt-3">
              <Link
                href="/seller/register"
                onClick={onClose}
                className="flex items-center gap-2 rounded bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-800"
              >
                <ShieldCheck className="h-4 w-4 text-yellow-600" />
                <span>Become a Seller</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileSidebar
