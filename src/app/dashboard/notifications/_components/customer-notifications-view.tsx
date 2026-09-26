"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { Bell, MoreVertical, Trash2, CheckCircle2, CheckCheck, Inbox } from "lucide-react"
import type { CustomerNotificationItem } from "@/services/notification-service"
import { NotificationListItem } from "./notification-list-item"
import { deleteNotificationsAction, markNotificationsReadAction } from "@/app/actions/ecommerce-actions"

interface CustomerNotificationsViewProps {
  initialNotifications: CustomerNotificationItem[]
}

export function CustomerNotificationsView({
  initialNotifications,
}: CustomerNotificationsViewProps) {
  const [notifications, setNotifications] = useState<CustomerNotificationItem[]>(initialNotifications)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "order" | "promo">("all")
  const [menuOpen, setMenuOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  // Filtered notifications based on active tab
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "unread") return !item.isRead
    if (activeTab === "order") return item.type === "order"
    if (activeTab === "promo") return item.type === "promo"
    return true
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const allSelected =
    filteredNotifications.length > 0 &&
    filteredNotifications.every((n) => selectedIds.includes(n.id))

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id))
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return
    setMenuOpen(false)

    startTransition(async () => {
      try {
        await deleteNotificationsAction(selectedIds)
        setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)))
        setSelectedIds([])
        setStatusMessage({
          type: "success",
          text: "Selected notification(s) deleted successfully.",
        })
        setTimeout(() => setStatusMessage(null), 3500)
      } catch (err) {
        console.error(err)
        setStatusMessage({
          type: "error",
          text: "Failed to delete notifications. Please try again.",
        })
      }
    })
  }

  const handleMarkAllRead = () => {
    setMenuOpen(false)
    startTransition(async () => {
      try {
        await markNotificationsReadAction()
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setStatusMessage({
          type: "success",
          text: "All notifications marked as read.",
        })
        setTimeout(() => setStatusMessage(null), 3000)
      } catch (err) {
        console.error(err)
      }
    })
  }

  const handleMarkSingleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
    markNotificationsReadAction([id]).catch(console.error)
  }

  return (
    <div className="space-y-4">
      {/* Status banner */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded px-4 py-3 text-xs font-semibold ${
            statusMessage.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <span className="font-bold">⚠</span>
          )}
          {statusMessage.text}
        </div>
      )}

      {/* Main Notifications Card (1:1 with Laravel frontend.user.customer.notification.index) */}
      <div className="rounded border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <h1 className="text-base sm:text-lg font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-[#d43533] px-2 py-0.5 text-[10px] font-bold text-white">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* 3-Dots Dropdown Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="More options"
            >
              <MoreVertical className="h-4.5 w-4.5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-md border border-gray-100 bg-white py-1 shadow-lg z-20 text-xs">
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.length === 0 || isPending}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Selection ({selectedIds.length})
                </button>
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={isPending || unreadCount === 0}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark All as Read
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Tabs & Select All bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-gray-50/60 border-b border-gray-100 text-xs">
          {/* Select all checkbox */}
          <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-gray-700 select-none">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleToggleSelectAll}
              disabled={filteredNotifications.length === 0}
              className="h-4 w-4 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
            />
            Select All
          </label>

          {/* Filter Pills */}
          <div className="flex items-center gap-1">
            {(
              [
                { id: "all", label: "All" },
                { id: "unread", label: "Unread" },
                { id: "order", label: "Orders" },
                { id: "promo", label: "Promotions" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#d43533] text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-200/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">
              <Inbox className="h-7 w-7" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">No notification found</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
              Any updates regarding your orders, tracking status, and store announcements will appear here.
            </p>
            <div className="mt-4">
              <Link
                href="/products"
                className="inline-flex rounded bg-[#d43533] px-4 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors"
              >
                Browse Store Catalog
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredNotifications.map((item) => (
              <NotificationListItem
                key={item.id}
                item={item}
                selected={selectedIds.includes(item.id)}
                onToggleSelect={handleToggleSelect}
                onMarkRead={handleMarkSingleRead}
              />
            ))}
          </ul>
        )}

        {/* Footer info */}
        {filteredNotifications.length > 0 && (
          <div className="flex items-center justify-between p-3.5 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-500">
            <span>
              Showing {filteredNotifications.length} notification{filteredNotifications.length === 1 ? "" : "s"}
            </span>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="font-bold text-red-600 hover:underline"
              >
                Delete {selectedIds.length} selected
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
