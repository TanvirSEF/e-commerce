"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export interface NotificationItem {
  id: string
  type?: string
  title: string
  message: string
  link?: string
  image?: string
  date?: string
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
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(initialUnreadCount)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "orders" | "system">("all")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true)
      const res = await fetch(`/api/notifications?variant=${variant}`, {
        headers: { "Cache-Control": "no-cache" },
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.authenticated === false) {
        setNotifications([])
        setUnreadCount(0)
        return
      }
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount ?? 0)
      }
    } catch {
      // Keep existing notifications
    } finally {
      if (isInitial) setLoading(false)
    }
  }, [variant])

  useEffect(() => {
    fetchNotifications(true)
    const interval = setInterval(() => fetchNotifications(false), 30000)
    return () => clearInterval(interval)
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

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      )
      setUnreadCount((c) => Math.max(0, c - 1))
      try {
        await fetch(`/api/notifications?variant=${variant}`, {
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

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "orders") return n.type === "order"
    if (activeTab === "system") return n.type !== "order"
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
      {/* Bell Trigger Button matching Active eCommerce CMS 1:1 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center p-1 text-[#91919b] transition-colors hover:text-[#d43533] focus:outline-none"
        title="Notifications"
        aria-label="Notifications"
      >
        <span className="relative inline-block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14.668"
            height="16"
            viewBox="0 0 14.668 16"
            className="fill-current text-gray-500 group-hover:text-[#d43533] transition-colors"
          >
            <path
              id="_26._Notification"
              data-name="26. Notification"
              d="M8.333,16A3.34,3.34,0,0,0,11,14.667H5.666A3.34,3.34,0,0,0,8.333,16ZM15.06,9.78a2.457,2.457,0,0,1-.727-1.747V6a6,6,0,1,0-12,0V8.033A2.457,2.457,0,0,1,1.606,9.78,2.083,2.083,0,0,0,3.08,13.333H13.586A2.083,2.083,0,0,0,15.06,9.78Z"
              transform="translate(-0.999)"
            />
          </svg>
          {unreadCount > 0 ? (
            <span className="absolute -top-2 -right-2.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#d43533] text-[10px] font-bold text-white shadow-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </span>
      </button>

      {/* Active eCommerce Dropdown Menu 1:1 */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-80 sm:w-96 rounded-none border border-gray-200 bg-white shadow-lg z-50 overflow-hidden text-left`}
        >
          {/* Header */}
          <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h6 className="mb-0 text-sm font-semibold text-gray-800">Notifications</h6>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-red-100 text-[#d43533] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Admin Tabs (Active eCommerce CMS 1:1) */}
          {variant === "admin" && (
            <div className="flex border-b border-gray-200 text-xs bg-gray-50/50">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`flex-1 py-2 text-center font-medium transition-colors border-b-2 ${
                  activeTab === "all"
                    ? "border-[#d43533] text-[#d43533] font-bold bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`flex-1 py-2 text-center font-medium transition-colors border-b-2 ${
                  activeTab === "orders"
                    ? "border-[#d43533] text-[#d43533] font-bold bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Orders
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("system")}
                className={`flex-1 py-2 text-center font-medium transition-colors border-b-2 ${
                  activeTab === "system"
                    ? "border-[#d43533] text-[#d43533] font-bold bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                System
              </button>
            </div>
          )}

          {/* List */}
          <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="py-6 text-center text-xs text-gray-400">Loading...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                No notification found
              </div>
            ) : (
              filteredNotifications.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`flex items-start gap-3 p-3 transition-colors hover:bg-gray-50 cursor-pointer ${
                    !item.isRead ? "bg-red-50/15" : ""
                  }`}
                >
                  {/* Left Icon (35px Circle Image - Active eCommerce 1:1) */}
                  <div className="w-[35px] h-[35px] rounded-full overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center mt-0.5 border border-gray-100">
                    <img
                      src={item.image || "/assets/img/notification.png"}
                      alt="Notification"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/img/notification.png"
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-800 leading-relaxed line-clamp-2">
                      {item.message || item.title}
                    </p>
                    {item.date && (
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {item.date}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer View All Link */}
          <div className="text-center border-t border-gray-100 py-2.5 bg-white">
            <Link
              href={viewAllLink}
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-500 hover:text-[#d43533] transition-colors inline-block"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
