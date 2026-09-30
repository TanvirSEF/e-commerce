"use client"

import React, { useState } from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"
import type { PreorderBusinessSettings } from "@/services/preorder-service"
import { PreorderCommissionCard } from "./preorder-commission-card"
import { PreorderGeneralCard } from "./preorder-general-card"
import { PreorderInstructionsCard } from "./preorder-instructions-card"

interface AdminPreorderSettingsViewProps {
  initialSettings: PreorderBusinessSettings
}

export function AdminPreorderSettingsView({ initialSettings }: AdminPreorderSettingsViewProps) {
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleFeedback = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <h5 className="text-base font-bold text-gray-800">Preorder Settings</h5>
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

      {/* Card 1: Preorder Seller Commission */}
      <PreorderCommissionCard
        initialSellerToggle={initialSettings.sellerPreorderProduct}
        initialCommission={initialSettings.preorderSellerCommission}
        onFeedback={handleFeedback}
      />

      {/* Card 2: PreOrder Settings */}
      <PreorderGeneralCard
        initialImage={initialSettings.imageForFaqAdvertisement}
        initialShipping={initialSettings.preorderFlatRateShipping}
        onFeedback={handleFeedback}
      />

      {/* Cards 3 & 4: Preorder Instructions & Payment Instructions */}
      <PreorderInstructionsCard
        initialRequestInstruction={initialSettings.preorderRequestInstruction}
        initialPaymentInstruction={initialSettings.prePaymentInstruction}
        initialPaymentQrcode={initialSettings.imageForPaymentQrcode}
        onFeedback={handleFeedback}
      />
    </div>
  )
}
