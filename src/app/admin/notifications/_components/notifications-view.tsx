"use client"

import React, { useState } from "react"
import { Bell, Send, CheckCircle2, Users, RefreshCw } from "lucide-react"
import { type CustomNotification } from "@/db/schema"
import { sendCustomNotificationAction } from "@/app/actions/ecommerce-actions"
import { NotificationHistoryTable } from "./notification-history-table"

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
      const recipientCount = selectedUserIds.length > 0 ? selectedUserIds.length : (customers.length || 1)
      const res = await sendCustomNotificationAction({
        title: title.trim(),
        content: content.trim(),
        notificationType,
        link: link.trim() || undefined,
        recipientCount,
      })

      if (res) {
        setStatusMessage({
          type: "success",
          text: `Notification dispatched successfully to ${recipientCount} recipients.`,
        })
        setTitle("")
        setContent("")
        setLink("")
        setSelectedUserIds([])
        setHistory((prev) => [res, ...prev])
      } else {
        setStatusMessage({ type: "error", text: "Failed to dispatch notifications." })
      }
    } catch {
      setStatusMessage({ type: "error", text: "Failed to dispatch notifications." })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-gray-200">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#d43533]" />
          Custom Notifications
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Send broadcast push notifications to registered customers and track campaign engagement
        </p>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {statusMessage.type === "success" && (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl shadow-xs p-6 space-y-5">
          <h2 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#d43533]" />
            Send Custom Notification
          </h2>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Customers ({selectedUserIds.length === 0 ? "All Customers" : `${selectedUserIds.length} Selected`})
                </label>
                <div className="space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-gray-500 hover:underline cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-2.5 max-h-36 overflow-y-auto space-y-1 bg-gray-50/50">
                {customers.length === 0 ? (
                  <p className="text-xs text-gray-400 py-2 text-center">No registered customers found</p>
                ) : (
                  customers.map((c) => (
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
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Select Type <span className="text-red-500">*</span>
              </label>
              <select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
              >
                {NOTIFICATION_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Notification Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Flash 40% Off Weekend Deals!"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700">
                  Content <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400">{content.length}/80 chars (Best within 80)</span>
              </div>
              <textarea
                required
                rows={3}
                maxLength={160}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write what your push notification will display..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Target URL Link</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/flash-deals or /products"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] disabled:bg-gray-300 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
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

        <div className="lg:col-span-5">
          <NotificationHistoryTable history={history} />
        </div>
      </div>
    </div>
  )
}
