"use client"

import React, { useState } from "react"
import { CreditCard, Save, CheckCircle, Loader2 } from "lucide-react"
import { updatePaymentGatewaysAction } from "@/app/actions/ecommerce-actions"
import type { PaymentGatewaysSettings } from "@/services/settings-service"
import { MfsGatewayCards } from "./mfs-gateway-cards"
import { CardGatewayCards } from "./card-gateway-cards"
import { OfflineGatewayCards } from "./offline-gateway-cards"

interface PaymentGatewaysViewProps {
  initialSettings: PaymentGatewaysSettings
}

export function PaymentGatewaysView({ initialSettings }: PaymentGatewaysViewProps) {
  const [settings, setSettings] = useState<PaymentGatewaysSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const handleUpdate = (updated: Partial<PaymentGatewaysSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updatePaymentGatewaysAction(settings)
      setSuccessMsg("Payment methods & gateway configuration saved successfully!")
      setTimeout(() => setSuccessMsg(""), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#d43533]" />
          Payment Gateway Master Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Activate and configure electronic payment processors, mobile banking (bKash/Nagad), COD, and manual bank deposits
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. MFS & Mobile Banking (bKash & Nagad) + 2. Card Gateways (SSLCommerz & Stripe) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MfsGatewayCards settings={settings} onChange={handleUpdate} />
          <CardGatewayCards settings={settings} onChange={handleUpdate} />
        </div>

        {/* 3. Cash on Delivery & Manual Wire */}
        <OfflineGatewayCards settings={settings} onChange={handleUpdate} />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] shadow-sm transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving Configuration..." : "Save Payment Gateways"}
          </button>
        </div>
      </form>
    </div>
  )
}
