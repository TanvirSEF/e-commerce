"use client"

import React, { useState, useTransition } from "react"
import { Send, CheckCircle2, AlertCircle, Radio, Smartphone, Info } from "lucide-react"
import type { SmsGatewayConfig, SmsTemplateItem } from "@/types/otp-sms"
import { sendBulkSmsAction } from "@/app/actions/otp-sms-actions"

interface Props {
  gateways: SmsGatewayConfig[]
  templates: SmsTemplateItem[]
  recipientCounts: { customers: number; sellers: number }
}

export function BulkSmsView({ gateways, templates, recipientCounts }: Props) {
  const [recipientType, setRecipientType] = useState<
    "all_customers" | "all_sellers" | "custom"
  >("all_customers")
  const [customNumbers, setCustomNumbers] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [message, setMessage] = useState("")
  const [feedback, setFeedback] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()

  const activeGateway = gateways.find((g) => g.status) || gateways[0]

  const charCount = message.length
  const smsSegments = Math.max(1, Math.ceil(charCount / 160))

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ident = e.target.value
    setSelectedTemplate(ident)
    if (!ident) return
    const tmpl = templates.find((t) => t.identifier === ident)
    if (tmpl) {
      setMessage(tmpl.body)
    }
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setFeedback({ type: "error", text: "SMS message body cannot be empty." })
      return
    }
    if (recipientType === "custom" && !customNumbers.trim()) {
      setFeedback({ type: "error", text: "Please enter at least one mobile number." })
      return
    }

    startTransition(async () => {
      try {
        const res = await sendBulkSmsAction({
          recipientType,
          customNumbers: recipientType === "custom" ? customNumbers : undefined,
          message,
          gatewayId: activeGateway?.id,
        })
        setFeedback({
          type: "success",
          text: `Bulk SMS broadcast dispatched successfully to ${res.count} recipient(s)!`,
        })
        setMessage("")
        setCustomNumbers("")
        setSelectedTemplate("")
      } catch {
        setFeedback({ type: "error", text: "Failed to dispatch bulk SMS broadcast." })
      }
      setTimeout(() => setFeedback(null), 4000)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce Titlebar */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Send Bulk SMS</h1>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded border transition-all ${
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Form (2 Cols) matching backend/marketing/bulk_sms/index.blade.php */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSend} className="bg-white border border-gray-200 rounded shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h5 className="text-sm font-semibold text-gray-800">Compose Message</h5>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Recipient Selection */}
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-2">
                  Select Recipient Group <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`flex items-center gap-2 p-3 rounded border cursor-pointer transition-all ${
                      recipientType === "all_customers"
                        ? "border-[#d43533] bg-red-50/20 font-semibold text-gray-800"
                        : "border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="recipientType"
                      checked={recipientType === "all_customers"}
                      onChange={() => setRecipientType("all_customers")}
                      className="sr-only"
                    />
                    <div>
                      <p className="text-xs">All Customers</p>
                      <p className="text-[10px] text-gray-400">
                        {recipientCounts.customers} registered
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 rounded border cursor-pointer transition-all ${
                      recipientType === "all_sellers"
                        ? "border-[#d43533] bg-red-50/20 font-semibold text-gray-800"
                        : "border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="recipientType"
                      checked={recipientType === "all_sellers"}
                      onChange={() => setRecipientType("all_sellers")}
                      className="sr-only"
                    />
                    <div>
                      <p className="text-xs">All Sellers</p>
                      <p className="text-[10px] text-gray-400">
                        {recipientCounts.sellers} merchants
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 rounded border cursor-pointer transition-all ${
                      recipientType === "custom"
                        ? "border-[#d43533] bg-red-50/20 font-semibold text-gray-800"
                        : "border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="recipientType"
                      checked={recipientType === "custom"}
                      onChange={() => setRecipientType("custom")}
                      className="sr-only"
                    />
                    <div>
                      <p className="text-xs">Custom Numbers</p>
                      <p className="text-[10px] text-gray-400">Comma-separated</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Custom Mobile Numbers */}
              {recipientType === "custom" && (
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">
                    Mobile Numbers (comma separated) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={customNumbers}
                    onChange={(e) => setCustomNumbers(e.target.value)}
                    placeholder="+8801711000000, +8801812000000"
                    className="w-full text-xs border border-gray-300 rounded p-2.5 focus:outline-none focus:border-blue-400"
                    required
                  />
                </div>
              )}

              {/* Quick Template Selector */}
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Use Preset Template (Optional)
                </label>
                <select
                  value={selectedTemplate}
                  onChange={handleTemplateSelect}
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                >
                  <option value="">-- Choose a template to autofill --</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.identifier}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* SMS Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-gray-700">
                    SMS Content <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {charCount} chars | {smsSegments} SMS {charCount > 160 && "(Multi-part)"}
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type promotional or notification SMS message here..."
                  className="w-full text-xs border border-gray-300 rounded p-2.5 focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-[#1d3557] hover:bg-[#16304d] text-white rounded disabled:opacity-60 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPending ? "Sending Broadcast..." : "Send SMS"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Widget */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded shadow-sm p-5 space-y-3">
            <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-gray-500" />
              Active SMS Gateway
            </h5>
            <div className="p-3 bg-gray-50 rounded border border-gray-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Provider:</span>
                <span className="font-semibold text-gray-800">{activeGateway?.name || "None"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Sender ID:</span>
                <span className="font-mono text-[11px] text-gray-700">
                  {activeGateway?.senderId || "Default"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Gateway Status:</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-green-100 text-green-700">
                  Ready
                </span>
              </div>
            </div>
            <a
              href="/admin/otp-configuration"
              className="block text-center text-xs text-blue-600 hover:underline pt-1"
            >
              Change Gateway Settings &rarr;
            </a>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 text-xs text-blue-800 space-y-1">
            <p className="font-semibold flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> SMS Billing Notice
            </p>
            <p className="text-[11px] text-blue-700">
              Standard GSM text length is 160 characters. Messages containing Unicode characters
              (Bengali, emojis) will be segmented at 70 characters per SMS.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
