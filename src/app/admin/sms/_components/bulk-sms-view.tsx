"use client"

import React, { useState, useTransition } from "react"
import {
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from "lucide-react"
import { sendBulkSmsAction } from "@/app/actions/ecommerce-actions"
import type { SmsGatewayConfig } from "@/services/sms-service"

interface BulkSmsViewProps {
  gateways: SmsGatewayConfig[]
}

export function BulkSmsView({ gateways }: BulkSmsViewProps) {
  const [recipientType, setRecipientType] = useState<"all_customers" | "all_sellers" | "custom">("all_customers")
  const [customNumbers, setCustomNumbers] = useState("")
  const [selectedGateway, setSelectedGateway] = useState(gateways[0]?.id || "mimsms")
  const [message, setMessage] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const charCount = message.length
  const smsSegments = Math.max(1, Math.ceil(charCount / 160))
  const estimatedRecipients =
    recipientType === "all_customers"
      ? 1420
      : recipientType === "all_sellers"
      ? 185
      : customNumbers.split(",").filter((n) => n.trim().length > 0).length

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setFeedback({ type: "error", text: "SMS message content cannot be blank." })
      return
    }

    startTransition(async () => {
      const res = await sendBulkSmsAction(recipientType, message)
      if (res.success) {
        setFeedback({
          type: "success",
          text: `Bulk SMS broadcast successfully queued for ${res.count || estimatedRecipients} recipients via ${selectedGateway.toUpperCase()}!`,
        })
        setMessage("")
      } else {
        setFeedback({ type: "error", text: "Failed to dispatch bulk SMS" })
      }
      setTimeout(() => setFeedback(null), 4000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Send className="h-6 w-6 text-[#d43533]" />
          Bulk SMS Broadcaster
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Broadcast promotional alerts, urgent notices, and announcements to customer or merchant phone numbers
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <form onSubmit={handleSend} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: 8 cols */}
        <div className="lg:col-span-8 rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
            SMS Campaign Details
          </h2>

          {/* Recipient Audience */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Select Recipient Audience <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label
                onClick={() => setRecipientType("all_customers")}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  recipientType === "all_customers"
                    ? "border-[#d43533] bg-red-50/50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#d43533]" />
                  <span className="font-bold text-xs text-gray-900">All Customers</span>
                </div>
                <span className="text-[11px] text-gray-500 mt-1 block">~1,420 registered users</span>
              </label>

              <label
                onClick={() => setRecipientType("all_sellers")}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  recipientType === "all_sellers"
                    ? "border-[#d43533] bg-red-50/50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#d43533]" />
                  <span className="font-bold text-xs text-gray-900">All Sellers</span>
                </div>
                <span className="text-[11px] text-gray-500 mt-1 block">~185 active stores</span>
              </label>

              <label
                onClick={() => setRecipientType("custom")}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  recipientType === "custom"
                    ? "border-[#d43533] bg-red-50/50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#d43533]" />
                  <span className="font-bold text-xs text-gray-900">Custom Numbers</span>
                </div>
                <span className="text-[11px] text-gray-500 mt-1 block">Specific phone list</span>
              </label>
            </div>
          </div>

          {/* Custom numbers textarea if selected */}
          {recipientType === "custom" && (
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Phone Numbers (comma separated)
              </label>
              <textarea
                rows={2}
                value={customNumbers}
                onChange={(e) => setCustomNumbers(e.target.value)}
                placeholder="01700112233, 01819223344, 01912334455"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
          )}

          {/* Gateway Selector */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              SMS Delivery Provider
            </label>
            <select
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-hidden"
            >
              {gateways.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} {g.status ? "(Active)" : "(Inactive)"}
                </option>
              ))}
            </select>
          </div>

          {/* Message Text */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs font-semibold text-gray-700">
                SMS Content <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-gray-500 font-mono">
                {charCount} chars | {smsSegments} segment(s)
              </span>
            </div>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your SMS message here. Standard SMS is 160 English characters or 70 Unicode characters..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isPending ? "Sending..." : "Send Bulk SMS"}
            </button>
          </div>
        </div>

        {/* Right Column: 4 cols Estimator */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2">
              Broadcast Summary
            </h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Audience:</span>
                <span className="font-bold text-gray-900">
                  {recipientType === "all_customers"
                    ? "Customers"
                    : recipientType === "all_sellers"
                    ? "Sellers"
                    : "Custom List"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Target Numbers:</span>
                <span className="font-mono font-bold text-blue-600">
                  {estimatedRecipients.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Segments per SMS:</span>
                <span className="font-mono">{smsSegments}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-900">
                <span>Estimated Credits:</span>
                <span className="font-mono text-[#d43533]">
                  {(estimatedRecipients * smsSegments).toLocaleString()} SMS
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
