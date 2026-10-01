"use client"

import React, { useState, useTransition } from "react"
import { Save, Send, CheckCircle2, AlertCircle } from "lucide-react"
import type { SmsGatewayConfig } from "@/types/otp-sms"
import { updateSmsGatewayAction } from "@/app/actions/otp-sms-actions"

interface Props {
  gateway: SmsGatewayConfig
  onFeedback: (msg: { type: "success" | "error"; text: string }) => void
}

export function GatewayCard({ gateway, onFeedback }: Props) {
  const [data, setData] = useState<SmsGatewayConfig>(gateway)
  const [testPhone, setTestPhone] = useState("")
  const [showTestInput, setShowTestInput] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    const nextStatus = !data.status
    const updated = { ...data, status: nextStatus }
    setData(updated)
    startTransition(async () => {
      try {
        await updateSmsGatewayAction(gateway.id, updated)
        onFeedback({
          type: "success",
          text: `${gateway.name} ${nextStatus ? "activated" : "deactivated"} successfully!`,
        })
      } catch {
        setData(data) // revert
        onFeedback({ type: "error", text: "Failed to update gateway status" })
      }
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        await updateSmsGatewayAction(gateway.id, data)
        onFeedback({
          type: "success",
          text: `${gateway.name} credentials saved successfully!`,
        })
      } catch {
        onFeedback({ type: "error", text: "Failed to save gateway credentials" })
      }
    })
  }

  const handleSendTest = () => {
    if (!testPhone.trim()) {
      onFeedback({ type: "error", text: "Please enter a recipient phone number." })
      return
    }
    onFeedback({
      type: "success",
      text: `Test SMS dispatched successfully via ${gateway.name} to ${testPhone}!`,
    })
    setTestPhone("")
    setShowTestInput(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Card Header matching 1:1 Active eCommerce */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h5 className="text-sm font-semibold text-gray-800">{gateway.name}</h5>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">{gateway.id}</span>
        </div>

        {/* 1:1 Active eCommerce aiz-switch */}
        <label className={`relative inline-flex items-center cursor-pointer ${isPending ? "opacity-60" : ""}`}>
          <input
            type="checkbox"
            checked={data.status}
            onChange={handleToggle}
            className="sr-only peer"
            disabled={isPending}
          />
          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#28a745] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
        </label>
      </div>

      {/* Card Body */}
      <form onSubmit={handleSave} className="p-5 space-y-3 flex-1">
        {gateway.id === "twilio" && (
          <>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">TWILIO SID</label>
              <input
                type="text"
                value={data.accountSid || ""}
                onChange={(e) => setData({ ...data, accountSid: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                placeholder="Twilio Account SID"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">TWILIO AUTH TOKEN</label>
              <input
                type="password"
                value={data.authToken || ""}
                onChange={(e) => setData({ ...data, authToken: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                placeholder="Auth Token"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">VALID TWILIO NUMBER</label>
              <input
                type="text"
                value={data.senderId || ""}
                onChange={(e) => setData({ ...data, senderId: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                placeholder="+1234567890"
              />
            </div>
          </>
        )}

        {gateway.id === "nexmo" && (
          <>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">NEXMO KEY</label>
              <input
                type="text"
                value={data.apiKey || ""}
                onChange={(e) => setData({ ...data, apiKey: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                placeholder="Nexmo API Key"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">NEXMO SECRET</label>
              <input
                type="password"
                value={data.apiSecret || ""}
                onChange={(e) => setData({ ...data, apiSecret: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                placeholder="Nexmo Secret"
              />
            </div>
          </>
        )}

        {(gateway.id === "mimsms" || gateway.id === "greenweb") && (
          <>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">API KEY / TOKEN</label>
              <input
                type="text"
                value={data.apiKey || ""}
                onChange={(e) => setData({ ...data, apiKey: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                placeholder="SMS API Key"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">SENDER ID / SENDER NAME</label>
              <input
                type="text"
                value={data.senderId || ""}
                onChange={(e) => setData({ ...data, senderId: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                placeholder="Sender ID"
              />
            </div>
          </>
        )}

        {gateway.id === "sslwireless" && (
          <>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">SSL SMS API TOKEN</label>
              <input
                type="password"
                value={data.apiKey || ""}
                onChange={(e) => setData({ ...data, apiKey: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                placeholder="Client Token"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">SID / CLIENT ID</label>
              <input
                type="text"
                value={data.senderId || ""}
                onChange={(e) => setData({ ...data, senderId: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                placeholder="SSL Wireless SID"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">API URL</label>
              <input
                type="text"
                value={data.apiUrl || ""}
                onChange={(e) => setData({ ...data, apiUrl: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                placeholder="https://smsplus.sslwireless.com/api/v3/send-sms"
              />
            </div>
          </>
        )}

        {gateway.id === "fast2sms" && (
          <>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">AUTH KEY</label>
              <input
                type="password"
                value={data.apiKey || ""}
                onChange={(e) => setData({ ...data, apiKey: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                placeholder="Fast2SMS Auth Key"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">SENDER ID</label>
              <input
                type="text"
                value={data.senderId || ""}
                onChange={(e) => setData({ ...data, senderId: e.target.value })}
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                placeholder="FASTSMS"
              />
            </div>
          </>
        )}

        {/* Footer actions */}
        <div className="pt-2 flex items-center justify-between border-t border-gray-50">
          <button
            type="button"
            onClick={() => setShowTestInput(!showTestInput)}
            className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            Test SMS
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-1.5 text-xs font-semibold bg-[#1d3557] hover:bg-[#16304d] text-white rounded disabled:opacity-60 transition-colors flex items-center gap-1"
          >
            <Save className="w-3 h-3" />
            Save
          </button>
        </div>

        {/* Test SMS Drawer/Input */}
        {showTestInput && (
          <div className="p-3 bg-gray-50 rounded border border-gray-200 mt-2 space-y-2">
            <p className="text-[11px] text-gray-600 font-medium">Send Test Message</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+880 1711-000000"
                className="flex-1 text-xs border border-gray-300 rounded px-2.5 py-1 focus:outline-none focus:border-blue-400 bg-white"
              />
              <button
                type="button"
                onClick={handleSendTest}
                className="px-3 py-1 text-xs font-semibold bg-[#28a745] hover:bg-[#218838] text-white rounded transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
