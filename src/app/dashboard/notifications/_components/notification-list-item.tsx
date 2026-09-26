"use client"

import React from "react"
import Link from "next/link"
import { Package, Megaphone, Bell, Wallet, ExternalLink } from "lucide-react"
import type { CustomerNotificationItem } from "@/services/notification-service"

interface NotificationListItemProps {
  item: CustomerNotificationItem
  selected: boolean
  onToggleSelect: (id: string) => void
  onMarkRead?: (id: string) => void
}

export function NotificationListItem({
  item,
  selected,
  onToggleSelect,
  onMarkRead,
}: NotificationListItemProps) {
  // Format notification message with clickable links for [[order_code]] and [[tracking_code]]
  const renderMessage = () => {
    let content: React.ReactNode = item.message

    if (item.orderCode && item.message.includes(`[[${item.orderCode}]]`)) {
      const parts = item.message.split(`[[${item.orderCode}]]`)
      content = (
        <>
          {parts[0]}
          <Link
            href={item.link || `/order-confirmed/${item.orderCode}`}
            className="font-bold text-[#d43533] hover:underline"
            onClick={() => onMarkRead?.(item.id)}
          >
            {item.orderCode}
          </Link>
          {parts[1]}
        </>
      )
    } else if (item.link) {
      content = (
        <Link
          href={item.link}
          className="hover:text-[#d43533] transition-colors"
          onClick={() => onMarkRead?.(item.id)}
        >
          {item.message}
          <ExternalLink className="inline ml-1 h-3 w-3 text-gray-400" />
        </Link>
      )
    }

    return content
  }

  // Get matching icon based on notification type
  const renderIcon = () => {
    switch (item.type) {
      case "order":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#d43533]">
            <Package className="h-4.5 w-4.5" />
          </div>
        )
      case "promo":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Megaphone className="h-4.5 w-4.5" />
          </div>
        )
      case "wallet":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Wallet className="h-4.5 w-4.5" />
          </div>
        )
      default:
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Bell className="h-4.5 w-4.5" />
          </div>
        )
    }
  }

  return (
    <li
      className={`flex items-start gap-3 py-3.5 px-4 transition-colors hover:bg-gray-50/80 border-b border-gray-100 last:border-b-0 ${
        !item.isRead ? "bg-red-50/20" : ""
      }`}
    >
      {/* Checkbox */}
      <div className="pt-1">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(item.id)}
          className="h-4 w-4 rounded border-gray-300 text-[#d43533] focus:ring-[#d43533] cursor-pointer"
        />
      </div>

      {/* Type Icon / Image */}
      {renderIcon()}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
          {!item.isRead && (
            <span className="inline-block h-2 w-2 rounded-full bg-[#d43533]" title="Unread" />
          )}
        </div>

        <p className="mt-0.5 text-xs text-gray-600 leading-relaxed line-clamp-2">
          {renderMessage()}
        </p>

        <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
          <span>{item.date}</span>
          {item.trackingCode && (
            <>
              <span>•</span>
              <Link
                href={`/track-order?code=${item.trackingCode}`}
                className="text-xs font-semibold text-[#1967d2] hover:underline"
              >
                Track: {item.trackingCode}
              </Link>
            </>
          )}
        </div>
      </div>
    </li>
  )
}
