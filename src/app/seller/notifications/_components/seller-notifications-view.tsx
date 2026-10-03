"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  MoreVertical,
  Trash2,
  Package,
  DollarSign,
  Store,
  Clock,
  Loader2,
} from "lucide-react"
import {
  bulkDeleteSellerNotificationsAction,
  markAllSellerNotificationsReadAction,
} from "@/app/actions/seller-actions"
import type { CustomerNotificationItem } from "@/services/notification-service"

interface SellerNotificationsViewProps {
  initialNotifications: CustomerNotificationItem[]
}

export function SellerNotificationsView({
  initialNotifications,
}: SellerNotificationsViewProps) {
  const [notifications, setNotifications] = useState<CustomerNotificationItem[]>(initialNotifications)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Mark unread as read upon visiting page (matching Laravel NotificationController@index)
  useEffect(() => {
    const hasUnread = initialNotifications.some((n) => !n.isRead)
    if (hasUnread) {
      markAllSellerNotificationsReadAction().catch(() => {})
    }
  }, [initialNotifications])

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

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    setIsDeleting(true)
    const toDelete = [...selectedIds]
    setSelectedIds([])
    setMenuOpen(false)

    // Optimistic UI update
    setNotifications((prev) => prev.filter((n) => !toDelete.includes(n.id)))

    await bulkDeleteSellerNotificationsAction(toDelete)
    setIsDeleting(false)
  }

  const renderFormattedMessage = (msg: string, link?: string) => {
    const parts = msg.split(/(\[\[.*?\]\])/g)
    const content = (
      <>
        {parts.map((part, i) =>
          part.startsWith("[[") && part.endsWith("]]") ? (
            <span key={i} className="text-[#3490dc] font-medium hover:underline">
              {part.slice(2, -2)}
            </span>
          ) : (
            part
          )
        )}
      </>
    )

    if (link) {
      return (
        <Link href={link} className="hover:text-[#d43533] transition-colors text-xs text-gray-800 leading-relaxed">
          {content}
        </Link>
      )
    }

    return <span className="text-xs text-gray-800 leading-relaxed">{content}</span>
  }

  const renderIcon = (type?: string) => {
    switch (type) {
      case "order":
        return (
          <div className="w-[35px] h-[35px] rounded-full bg-red-50 text-[#d43533] flex items-center justify-center shrink-0 border border-red-100">
            <Package className="w-4 h-4" />
          </div>
        )
      case "preorder":
        return (
          <div className="w-[35px] h-[35px] rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Clock className="w-4 h-4" />
          </div>
        )
      case "payout":
        return (
          <div className="w-[35px] h-[35px] rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <DollarSign className="w-4 h-4" />
          </div>
        )
      default:
        return (
          <div className="w-[35px] h-[35px] rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Store className="w-4 h-4" />
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* Card matching Laravel seller/notification/index.blade.php */}
      <div className="card bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <h5 className="mb-0 text-sm font-semibold text-gray-900">Notifications</h5>

          {/* Ellipsis Dropdown matching Laravel btn-group */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-40 rounded-sm border border-gray-200 bg-white py-1 shadow-md z-40 text-xs">
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    disabled={selectedIds.length === 0 || isDeleting}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-40"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Delete Selection ({selectedIds.length})
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Select All Checkbox matching x-notification */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs">
          <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-gray-700">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleToggleSelectAll}
              className="w-4 h-4 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
            />
            Select All
          </label>
          <span className="text-gray-400 font-mono text-[11px]">{notifications.length} Total</span>
        </div>

        {/* Notifications List matching list-group */}
        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              No notification found
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((item) => (
                <li
                  key={item.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3 transition-colors hover:bg-gray-50/60 px-2 -mx-2 rounded"
                >
                  {/* Selection Checkbox */}
                  <div className="pt-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleToggleSelect(item.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
                    />
                  </div>

                  {/* Icon */}
                  <div className="shrink-0">{renderIcon(item.type)}</div>

                  {/* Content & Date */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-gray-900 leading-tight">
                        {item.title}
                      </p>
                      {!item.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d43533]" />
                      )}
                    </div>
                    <div className="mt-0.5">
                      {renderFormattedMessage(item.message, item.link)}
                    </div>
                    <span className="text-[11px] text-gray-400 mt-1 block font-mono">
                      {item.date}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
