"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid, ShoppingBag, Bell, User } from "lucide-react"
import { useCart } from "@/lib/context/cart-context"

export function MobileBottomNav() {
  const pathname = usePathname()
  const { totalCount, toggleCart } = useCart()
  const [unreadNotifCount, setUnreadNotifCount] = useState(0)

  useEffect(() => {
    const fetchUnread = () => {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setUnreadNotifCount(d.unreadCount || 0)
        })
        .catch(() => {})
    }
    fetchUnread()
    const timer = setInterval(fetchUnread, 30000)
    return () => clearInterval(timer)
  }, [])


  if (pathname.startsWith("/admin")) {
    return null
  }
  if (
    pathname.startsWith("/seller") &&
    !pathname.startsWith("/seller/login") &&
    !pathname.startsWith("/seller/register")
  ) {
    return null
  }

  const NAV_ITEMS = [
    { label: "Home", href: "/", icon: Home },
    { label: "Categories", href: "/categories", icon: Grid },
    { label: "Cart", isCart: true, icon: ShoppingBag },
    { label: "Alerts", href: "/dashboard/notifications", icon: Bell },
    { label: "Account", href: "/dashboard", icon: User },
  ]

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-gray-200 bg-white py-1 shadow-lg lg:hidden">
      <div className="grid grid-cols-5 items-center">
        {NAV_ITEMS.map((item) => {
          if (item.isCart) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={toggleCart}
                className="relative flex flex-col items-center justify-center py-1 text-gray-600 transition-colors hover:text-[#d43533]"
              >
                <div className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {totalCount > 0 && (
                    <span
                      suppressHydrationWarning
                      className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#d43533] text-[9px] font-bold text-white"
                    >
                      {totalCount}
                    </span>
                  )}
                </div>
                <span className="mt-0.5 text-[10px] font-medium">{item.label}</span>
              </button>
            )
          }

          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                isActive ? "text-[#d43533]" : "text-gray-600 hover:text-[#d43533]"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.label === "Alerts" && unreadNotifCount > 0 && (
                  <span
                    suppressHydrationWarning
                    className="absolute -top-1 -right-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#d43533] text-[9px] font-bold text-white shadow-xs"
                  >
                    {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                  </span>
                )}
              </div>
              <span className="mt-0.5 text-[10px] font-medium">{item.label}</span>
            </Link>

          )
        })}
      </div>
    </div>
  )
}

export default MobileBottomNav
