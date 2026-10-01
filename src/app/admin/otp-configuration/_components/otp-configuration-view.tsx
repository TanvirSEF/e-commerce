"use client"

import React, { useState } from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"
import type { SmsGatewayConfig } from "@/types/otp-sms"
import { GatewayCard } from "./gateway-card"

interface Props {
  initialGateways: SmsGatewayConfig[]
}

export function OtpConfigurationView({ initialGateways }: Props) {
  const [feedback, setFeedback] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleFeedback = (msg: { type: "success" | "error"; text: string }) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3500)
  }

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce Titlebar */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">OTP Configurations</h1>
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

      {/* Grid of Gateway Cards matching Active eCommerce layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {initialGateways.map((gw) => (
          <GatewayCard key={gw.id} gateway={gw} onFeedback={handleFeedback} />
        ))}
      </div>
    </div>
  )
}
