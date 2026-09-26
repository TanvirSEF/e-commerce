"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Bell, Package, DollarSign, Store, CheckCheck, Trash2, MoreVertical } from "lucide-react"

interface SellerNotificationItem {
  id: string
  title: string
  message: string
  date: string
  type: "order" | "payout" | "verification"
  link?: string
  isRead: boolean
}

const SEED_SELLER_NOTIFICATIONS: SellerNotificationItem[] = [
  {
    id: "s-1",
    title: "New Order Placed",
    message: "Order: 20260923-847291 has been Placed by customer Rahim Ahmed",
    date: "2026-09-23 11:20 AM",
    type: "order",
    link: "/seller/orders",
    isRead: false,
  },
  {
    id: "s-2",
    title: "Payout Request Approved",
    message: "Your withdrawal request for ৳15,000 has been approved and processed.",
    date: "2026-09-21 04:15 PM",
    type: "payout",
    link: "/seller/payouts",
    isRead: true,
  },
  {
    id: "s-3",
    title: "Store Verification Verified",
    message: "Your merchant documents have been verified. You now have full seller privileges.",
    date: "2026-09-15 09:30 AM",
    type: "verification",
    link: "/seller/shop",
    isRead: true,
  },
]

export function SellerNotificationsView() {
  const [notifications, setNotifications] = useState(SEED_SELLER_NOTIFICATIONS)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const allSelected =
    notifications.length > 0 && notifications.every((n) => selectedIds.includes(n.id))

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(notifications.map((n) => n.id))
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleDeleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)))
    setSelectedIds([])
    setMenuOpen(false)
    setSuccessMsg("Selected notifications deleted.")
    setTimeout(() => setSuccessMsg(""), 3000)
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setMenuOpen(false)
    setSuccessMsg("All notifications marked as read.")
    setTimeout(() => setSuccessMsg(""), 3000)
  }

  const renderIcon = (type: SellerNotificationItem["type"]) => {
    switch (type) {
      case "order":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#d43533]">
            <Package className="h-4.5 w-4.5" />
          </div>
        )
      case "payout":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <DollarSign className="h-4.5 w-4.5" />
          </div>
        )
      default:
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Store className="h-4.5 w-4.5" />
          </div>
        )
    }
  }

  return (
    <div className="space-y-4 max-w-4xl">
      {successMsg && (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800">
          {successMsg}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#d43533]" />
            <h1 className="text-base font-bold text-slate-800">All Notifications</h1>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <MoreVertical className="h-4.5 w-4.5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-md border border-slate-100 bg-white py-1 shadow-lg z-20 text-xs">
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.length === 0}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Selection ({selectedIds.length})
                </button>
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark All as Read
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Select all bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-xs">
          <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleToggleSelectAll}
              className="h-4 w-4 rounded border-slate-300 text-[#d43533] focus:ring-[#d43533]"
            />
            Select All
          </label>
          <span className="text-slate-400">{notifications.length} total</span>
        </div>

        {/* List */}
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No notifications found.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notifications.map((item) => (
              <li
                key={item.id}
                className={`flex items-start gap-3 p-4 transition-colors hover:bg-slate-50/80 ${
                  !item.isRead ? "bg-red-50/20" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => handleToggleSelect(item.id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#d43533] focus:ring-[#d43533]"
                />
                {renderIcon(item.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-[#d43533]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {item.link ? (
                      <Link href={item.link} className="hover:text-[#d43533] transition-colors">
                        {item.message}
                      </Link>
                    ) : (
                      item.message
                    )}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-1 block">{item.date}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
