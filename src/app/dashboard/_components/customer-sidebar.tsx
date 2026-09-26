"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  User,
  LogOut,
  Wallet,
  Award,
  Headphones,
  MessageSquare,
  RotateCcw,
  Tag,
  Store,
  Download,
  Bell,
  Trash2,
} from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"
import { AccountDeleteModal } from "./account-delete-modal"

export function CustomerSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Purchase History", href: "/dashboard/purchase-history", icon: ShoppingBag },
    { label: "Digital Purchases", href: "/dashboard/digital-purchases", icon: Download },
    { label: "Refund Requests", href: "/dashboard/refund-requests", icon: RotateCcw },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Classified Products", href: "/dashboard/customer-products", icon: Tag },
    { label: "Followed Stores", href: "/dashboard/followed-sellers", icon: Store },
    { label: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
    { label: "My Wallet", href: "/dashboard/wallet", icon: Wallet },
    { label: "Earning Points", href: "/dashboard/club-points", icon: Award },
    { label: "Support Ticket", href: "/dashboard/support-tickets", icon: Headphones },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { label: "Manage Profile", href: "/dashboard/profile", icon: User },
  ]

  return (
    <div className="w-full rounded border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* User Header */}
      <div className="p-6 text-center border-b border-gray-100 bg-gray-50/50">
        <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-white shadow-sm bg-gray-100 mb-3">
          <Image
            src={user?.avatar || "/assets/img/avatar-place.png"}
            alt={user?.name || "Customer"}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = "/assets/img/avatar-place.png"
            }}
          />
        </div>
        <h4 className="text-sm font-bold text-gray-900">{user?.name || "Customer"}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{user?.email || user?.phone}</p>
      </div>

      {/* Nav List */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-[#d43533] text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors text-left"
        >
          <LogOut className="h-4 w-4 text-gray-500" />
          <span>Logout</span>
        </button>

        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="flex w-full items-center gap-3 px-4 py-3 rounded text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Account</span>
        </button>
      </nav>

      <AccountDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  )
}
