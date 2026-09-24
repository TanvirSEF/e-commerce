"use client"

import React, { useState } from "react"
import { Bell, Send, CheckCircle2, History, Users, RefreshCw } from "lucide-react"
import { type CustomNotification } from "@/db/schema"
import { sendCustomNotificationAction } from "@/app/actions/ecommerce-actions"

interface CustomerOption {
  id: string
  name: string
  email: string
  phone?: string
}

interface NotificationsViewProps {
  customers: CustomerOption[]
  history: CustomNotification[]
}

const NOTIFICATION_TYPES = [
  { id: "Promotional", name: "Promotional Campaign / Mega Sale" },
  { id: "Order Update", name: "Order & Shipping Updates" },
  { id: "Flash Offer", name: "Limited-Time Flash Deals" },
  { id: "System Alert", name: "Important System Announcement" },
]

export function NotificationsView({
  customers,
  history: initialHistory,
}: NotificationsViewProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [notificationType, setNotificationType] = useState("Promotional")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [link, setLink] = useState("")
  const [history, setHistory] = useState(initialHistory)
  const [isSending, setIsSending] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSelectAll = () => {
    setSelectedUserIds(customers.map((c) => c.id))
  }

  const handleDeselectAll = () => {
    setSelectedUserIds([])
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setStatusMessage({ type: "error", text: "Please provide both title and notification content." })
      return
    }

    setIsSending(true)
    setStatusMessage(null)
    try {
      const recipientCount = selectedUserIds.length > 0 ? selectedUserIds.length : customers.length
      const res = await sendCustomNotificationAction({
        title: title.trim(),
        content: content.trim(),
        link: link.trim() || undefined,
        notificationType,
        recipientCount,
      })

      if (res) {
        setHistory((prev) => [res, ...prev])
        setTitle("")
        setContent("")
        setLink("")
        setSelectedUserIds([])
        setStatusMessage({
          type: "success",
          text: `Notification successfully broadcasted to ${recipientCount} customers!`,
        })
      }
    } catch {
      setStatusMessage({ type: "error", text: "Failed to broadcast notification." })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Titlebar */}
      <div className="pb-2 border-b border-gray-200">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Custom Push Notifications</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Broadcast promotional announcements and system notifications to registered customer accounts
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Send Notification Card (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#d43533]" />
            <span>Send Custom Notification</span>
          </h2>

          <form onSubmit={handleSend} className="space-y-5">
            {/* Customer Recipients */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-gray-700">
                  Target Customers ({selectedUserIds.length === 0 ? "All Customers" : `${selectedUserIds.length} Selected`})
                </label>
                <div className="space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-gray-500 hover:underline"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-2.5 max-h-36 overflow-y-auto space-y-1 bg-gray-50/50">
                {customers.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 p-1.5 hover:bg-white rounded cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(c.id)}
                      onChange={() =>
                        setSelectedUserIds((prev) =>
                          prev.includes(c.id) ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                        )
                      }
                      className="w-3.5 h-3.5 text-[#d43533] rounded border-gray-300"
                    />
                    <span className="font-medium text-gray-800">{c.name}</span>
                    <span className="text-gray-400">({c.email})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notification Type */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">
                Select Type <span className="text-red-500">*</span>
              </label>
              <select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
              >
                {NOTIFICATION_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">
                Notification Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Flash 40% Off Weekend Deals!"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
              />
            </div>

            {/* Content Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-gray-700">
                  Content <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-400">
                  {content.length}/80 chars (Best within 80)
                </span>
              </div>
              <textarea
                required
                rows={3}
                maxLength={160}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write what your push notification will display..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
              />
            </div>

            {/* Link */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">
                Target URL Link
              </label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/flash-deals or /products"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
              />
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] disabled:bg-gray-300 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Broadcasting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Notifications</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Broadcast History (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-600" />
            <span>Broadcast History ({history.length})</span>
          </h2>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No broadcast history yet.</p>
            ) : (
              history.map((h) => (
                <div
                  key={h.id}
                  className="p-3.5 bg-gray-50 border border-gray-100 rounded-lg space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 line-clamp-1">{h.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold shrink-0">
                      {h.notificationType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{h.content}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {h.recipientCount} Recipients
                    </span>
                    <span>{new Date(h.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
