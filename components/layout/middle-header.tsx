"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, Heart, RefreshCw, Bell, User, Menu, X } from "lucide-react"

export function MiddleHeader({ onToggleMobileMenu }: { onToggleMobileMenu?: () => void }) {
  const router = useRouter()
  const [keyword, setKeyword] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (keyword.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(keyword.trim())}`)
      setSearchFocused(false)
      setMobileSearchOpen(false)
    }
  }

  const SUGGESTIONS = [
    "Men Casual Shirt",
    "Wireless Bluetooth Earbuds",
    "Smart Watch Series 8",
    "Running Sports Shoes",
    "Cotton Hoodie",
  ]

  return (
    <div className="relative z-30 border-b border-gray-100 bg-white py-3 lg:py-5">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4">
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-1 text-gray-700 hover:text-[#d43533] lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-9 w-36 sm:h-10 sm:w-44">
              <Image
                src="/assets/img/logo.png"
                alt="Active eCommerce"
                fill
                priority
                className="object-contain"
                onError={(e) => {
                  // Fallback to text if image not available
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
            <span className="hidden text-xl font-bold tracking-tight text-[#d43533] sm:inline-block">
              Active<span className="text-[#292933]">Shop</span>
            </span>
          </Link>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="mx-8 hidden max-w-[580px] flex-1 lg:block">
          <div className="relative">
            <form onSubmit={handleSearchSubmit} className="relative flex">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="I am shopping for..."
                className="h-[44px] w-full rounded-md border border-[#dfdfe6] bg-white pr-12 pl-4 text-sm text-[#292933] transition-all placeholder:text-gray-400 focus:border-[#d43533] focus:ring-1 focus:ring-[#d43533] focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#d43533]"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Quick Suggestions Dropdown */}
            {searchFocused && (
              <div className="absolute top-full left-0 z-50 mt-1.5 w-full rounded-md border border-gray-100 bg-white p-3 shadow-xl">
                <div className="mb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                  Popular Searches
                </div>
                <div className="flex flex-col gap-1">
                  {SUGGESTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={() => {
                        setKeyword(item)
                        router.push(`/products?keyword=${encodeURIComponent(item)}`)
                      }}
                      className="flex items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-gray-700 hover:bg-red-50 hover:text-[#d43533]"
                    >
                      <Search className="h-3 w-3 text-gray-400" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions (Compare, Wishlist, Notification, Account) */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-1.5 text-gray-700 hover:text-[#d43533] lg:hidden"
            aria-label="Open search input"
          >
            {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          {/* Compare (Desktop) */}
          <Link
            href="/compare"
            className="group relative hidden items-center gap-1.5 text-[#292933] transition-colors hover:text-[#d43533] lg:flex"
            title="Compare Products"
          >
            <div className="relative">
              <RefreshCw className="h-5 w-5 text-gray-500 group-hover:text-[#d43533]" />
              <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#d43533] text-[10px] font-bold text-white">
                0
              </span>
            </div>
            <span className="hidden text-xs font-medium xl:inline">Compare</span>
          </Link>

          {/* Wishlist (Desktop) */}
          <Link
            href="/dashboard/wishlist"
            className="group relative hidden items-center gap-1.5 text-[#292933] transition-colors hover:text-[#d43533] sm:flex"
            title="My Wishlist"
          >
            <div className="relative">
              <Heart className="h-5 w-5 text-gray-500 group-hover:text-[#d43533]" />
              <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#d43533] text-[10px] font-bold text-white">
                0
              </span>
            </div>
            <span className="hidden text-xs font-medium xl:inline">Wishlist</span>
          </Link>

          {/* Notifications */}
          <Link
            href="/dashboard/notifications"
            className="group relative hidden items-center text-[#292933] transition-colors hover:text-[#d43533] md:flex"
            title="Notifications"
          >
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-500 group-hover:text-[#d43533]" />
              <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#d43533] text-[10px] font-bold text-white">
                0
              </span>
            </div>
          </Link>

          {/* User Account / Auth */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 text-left"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 transition-colors hover:border-[#d43533] hover:text-[#d43533]">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden text-left xl:block">
                <div className="text-[11px] text-gray-400">Welcome,</div>
                <div className="text-xs font-semibold text-gray-800">Login / Register</div>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-md border border-gray-100 bg-white py-2 shadow-xl">
                <Link
                  href="/login"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-red-50 hover:text-[#d43533]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-red-50 hover:text-[#d43533]"
                >
                  Registration
                </Link>
                <div className="my-1 border-t border-gray-100" />
                <Link
                  href="/dashboard"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 text-xs text-gray-600 hover:bg-gray-50"
                >
                  Customer Dashboard
                </Link>
                <Link
                  href="/track-order"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 text-xs text-gray-600 hover:bg-gray-50"
                >
                  Track Order
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Input Drawer (When toggled) */}
      {mobileSearchOpen && (
        <div className="border-t border-gray-100 px-4 pt-3 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search products..."
              className="h-10 w-full rounded border border-gray-300 pr-10 pl-3 text-xs focus:border-[#d43533] focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-gray-500 hover:text-[#d43533]"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default MiddleHeader
