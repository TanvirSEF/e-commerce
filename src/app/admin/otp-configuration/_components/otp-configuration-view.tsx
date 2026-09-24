"use client"

import React, { useState, useTransition } from "react"
import {
  MessageSquare,
  Save,
  CheckCircle2,
  AlertCircle,
  Send,
  Shield,
  Key,
} from "lucide-react"
import { updateSmsGatewayAction } from "@/app/actions/ecommerce-actions"
import type { SmsGatewayConfig } from "@/services/sms-service"

interface OtpConfigurationViewProps {
  initialGateways: SmsGatewayConfig[]
}

export function OtpConfigurationView({ initialGateways }: OtpConfigurationViewProps) {
  const [gateways, setGateways] = useState<SmsGatewayConfig[]>(initialGateways)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [testPhones, setTestPhones] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  const handleUpdate = (gateway: SmsGatewayConfig) => {
    startTransition(async () => {
      const res = await updateSmsGatewayAction(gateway.id, gateway)
      if (res.success) {
        setFeedback({ type: "success", text: `${gateway.name} credentials updated successfully!` })
      } else {
        setFeedback({ type: "error", text: "Failed to update gateway credentials" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleToggle = (id: string, currentStatus: boolean) => {
    const updated = gateways.map((g) => (g.id === id ? { ...g, status: !currentStatus } : g))
    setGateways(updated)
    const target = updated.find((g) => g.id === id)
    if (target) handleUpdate(target)
  }

  const handleSendTest = (gatewayName: string, id: string) => {
    const phone = testPhones[id]
    if (!phone) {
      setFeedback({ type: "error", text: "Please provide a recipient phone number for the test." })
      return
    }
    setFeedback({
      type: "success",
      text: `Test SMS dispatched successfully via ${gatewayName} to ${phone}!`,
    })
    setTimeout(() => setFeedback(null), 3500)
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-[#d43533]" />
          SMS Gateway & OTP Provider Configurations
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure API credentials for Bangladesh local and international SMS delivery networks
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

      {/* Grid of Gateways */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gateways.map((g) => (
          <div
            key={g.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-[#d43533]">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-gray-900">{g.name}</h3>
                    <span className="text-[10px] text-gray-400 font-mono">ID: {g.id}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(g.id, g.status)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    g.status ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      g.status ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Credential Inputs */}
              <div className="space-y-2.5 text-xs">
                {g.apiKey !== undefined && (
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                      API Key / Client ID
                    </label>
                    <input
                      type="password"
                      value={g.apiKey || ""}
                      onChange={(e) =>
                        setGateways(
                          gateways.map((item) =>
                            item.id === g.id ? { ...item, apiKey: e.target.value } : item
                          )
                        )
                      }
                      placeholder="Enter API Key"
                      className="w-full rounded-lg border border-gray-200 px-3 py-1.5 font-mono text-xs focus:border-[#d43533] focus:outline-hidden"
                    />
                  </div>
                )}

                {g.apiSecret !== undefined && (
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                      API Secret
                    </label>
                    <input
                      type="password"
                      value={g.apiSecret || ""}
                      onChange={(e) =>
                        setGateways(
                          gateways.map((item) =>
                            item.id === g.id ? { ...item, apiSecret: e.target.value } : item
                          )
                        )
                      }
                      placeholder="Enter API Secret"
                      className="w-full rounded-lg border border-gray-200 px-3 py-1.5 font-mono text-xs focus:border-[#d43533] focus:outline-hidden"
                    />
                  </div>
                )}

                {g.accountSid !== undefined && (
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                      Account SID
                    </label>
                    <input
                      type="text"
                      value={g.accountSid || ""}
                      onChange={(e) =>
                        setGateways(
                          gateways.map((item) =>
                            item.id === g.id ? { ...item, accountSid: e.target.value } : item
                          )
                        )
                      }
                      placeholder="AC..."
                      className="w-full rounded-lg border border-gray-200 px-3 py-1.5 font-mono text-xs focus:border-[#d43533] focus:outline-hidden"
                    />
                  </div>
                )}

                {g.authToken !== undefined && (
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                      Auth Token
                    </label>
                    <input
                      type="password"
                      value={g.authToken || ""}
                      onChange={(e) =>
                        setGateways(
                          gateways.map((item) =>
                            item.id === g.id ? { ...item, authToken: e.target.value } : item
                          )
                        )
                      }
                      placeholder="Enter Auth Token"
                      className="w-full rounded-lg border border-gray-200 px-3 py-1.5 font-mono text-xs focus:border-[#d43533] focus:outline-hidden"
                    />
                  </div>
                )}

                {g.senderId !== undefined && (
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                      Sender ID / Masking Name
                    </label>
                    <input
                      type="text"
                      value={g.senderId || ""}
                      onChange={(e) =>
                        setGateways(
                          gateways.map((item) =>
                            item.id === g.id ? { ...item, senderId: e.target.value } : item
                          )
                        )
                      }
                      placeholder="e.g. ACTIVEECOM"
                      className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-[#d43533] focus:outline-hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Test & Save buttons */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="01700000000"
                  value={testPhones[g.id] || ""}
                  onChange={(e) => setTestPhones({ ...testPhones, [g.id]: e.target.value })}
                  className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleSendTest(g.name, g.id)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 font-semibold"
                >
                  Test
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleUpdate(g)}
                disabled={isPending}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#d43533] py-2 text-xs font-bold text-white shadow-xs hover:bg-[#b02a28] transition"
              >
                <Save className="w-3.5 h-3.5" />
                Save Credentials
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
