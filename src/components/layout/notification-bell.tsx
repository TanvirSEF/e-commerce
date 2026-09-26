"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bell,
  Package,
  Tag,
  Info,
  Check,
  CheckCheck,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react"

export interface NotificationItem {
  id: string
  type: "order" | "promo" | "system" | "wallet"
  title: string
  message: string
  orderCode?: string
  trackingCode?: string
  link?: string
  date: string
  isRead: boolean
}

interface NotificationBellProps {
  initialUnreadCount?: number
  className?: string
  align?: "left" | "right"
  variant?: "storefront" | "admin" | "seller"
}

export function NotificationBell({
  initialUnreadCount = 0,
  className = "",
  align = "right",
  variant = "storefront",
}: NotificationBellProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "order" | "promo">("all")
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(initialUnreadCount)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const lastNotifiedIdRef = useRef<string | null>(null)

  // Fetch latest notifications from API
  const fetchNotifications = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true)
      const res = await fetch("/api/notifications", {
        headers: { "Cache-Control": "no-cache" },
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications)
        const newUnread = data.unreadCount ?? 0
        setUnreadCount(newUnread)

        // Web Notification trigger for brand new notifications
        if (
          !isInitial &&
          data.notifications.length > 0 &&
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          const newest = data.notifications[0]
          if (!newest.isRead && newest.id !== lastNotifiedIdRef.current) {
            lastNotifiedIdRef.current = newest.id
            try {
              new Notification(newest.title, {
                body: newest.message,
                icon: "/favicon.ico",
              })
            } catch {}
          }
        }
      }
    } catch (err) {
      console.warn("Realtime notification fetch error:", err)
    } finally {
      if (isInitial) setLoading(false)
    }
  }, [])

  // Initial fetch and Realtime background polling (every 25 seconds + on window focus)
  useEffect(() => {
    fetchNotifications(true)

    const interval = setInterval(() => {
      fetchNotifications(false)
    }, 25000)

    const handleFocus = () => {
      fetchNotifications(false)
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleFocus)
    }
  }, [fetchNotifications])

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Mark all as read
  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation()
    // Optimistic UI
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)

    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" }),
      })
    } catch (err) {
      console.warn("Failed to mark all read:", err)
    }
  }

  // Mark single notification as read & navigate
  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      )
      setUnreadCount((c) => Math.max(0, c - 1))
      try {
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "mark_read", id: item.id }),
        })
      } catch {}
    }
    setIsOpen(false)
    if (item.link) {
      router.push(item.link)
    }
  }

  // Filter tab notifications
  const displayedNotifications = notifications.filter((item) => {
    if (activeTab === "order") return item.type === "order"
    if (activeTab === "promo") return item.type === "promo"
    return true
  })

  const viewAllLink =
    variant === "admin"
      ? "/admin/all-notifications"
      : variant === "seller"
      ? "/seller/all-notification"
      : "/dashboard/notifications"

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center p-1 text-[#292933] transition-colors hover:text-[#d43533] focus:outline-none"
        title="Notifications"
        aria-label="Notifications"
      >
        <div className="relative">
          <Bell className="h-5 w-5 text-gray-500 group-hover:text-[#d43533] transition-colors" />
          {unreadCount > 0 ? (
            <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#d43533] text-[10px] font-bold text-white shadow-sm animate-in fade-in zoom-in duration-200">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </div>
      </button>

      {/* Real-time Interactive Dropdown Popover */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-80 sm:w-96 rounded-lg border border-gray-200 bg-white shadow-xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-150`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-slate-50/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-[#d43533]">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs font-semibold text-[#d43533] hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex border-b border-gray-100 bg-white px-2 pt-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-1.5 font-medium border-b-2 transition-colors ${
                activeTab === "all"
                  ? "border-[#d43533] text-[#d43533]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("order")}
              className={`flex-1 py-1.5 font-medium border-b-2 transition-colors ${
                activeTab === "order"
                  ? "border-[#d43533] text-[#d43533]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Orders
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("promo")}
              className={`flex-1 py-1.5 font-medium border-b-2 transition-colors ${
                activeTab === "promo"
                  ? "border-[#d43533] text-[#d43533]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Offers
            </button>
          </div>

          {/* Scrollable Notification List */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="py-8 text-center text-xs text-gray-400">Loading notifications...</div>
            ) : displayedNotifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="mx-auto h-8 w-8 text-gray-300 stroke-1" />
                <p className="mt-2 text-xs font-medium text-gray-500">No notifications found</p>
              </div>
            ) : (
              displayedNotifications.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`group relative flex cursor-pointer gap-3 p-3 transition-colors hover:bg-gray-50 ${
                    !item.isRead ? "bg-red-50/20" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="mt-0.5 shrink-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        item.type === "order"
                          ? "bg-amber-100 text-amber-600"
                          : item.type === "promo"
                          ? "bg-rose-100 text-[#d43533]"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {item.type === "order" ? (
                        <Package className="h-4 w-4" />
                      ) : item.type === "promo" ? (
                        <Sparkles className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-xs truncate ${
                          !item.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="shrink-0 text-[10px] text-gray-400">{item.date}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500 line-clamp-2">
                      {item.message}
                    </p>
                    {item.orderCode && (
                      <span className="mt-1 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono text-gray-600">
                        {item.orderCode}
                      </span>
                    )}
                  </div>

                  {/* Unread indicator */}
                  {!item.isRead && (
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#d43533]" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer View All Link */}
          <div className="border-t border-gray-100 bg-slate-50/50 p-2 text-center">
            <Link
              href={viewAllLink}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1 py-1 text-xs font-semibold text-[#d43533] hover:underline"
            >
              <span>View All Notifications</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
