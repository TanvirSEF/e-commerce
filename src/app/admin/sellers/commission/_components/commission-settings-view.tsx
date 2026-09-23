"use client"

import React, { useState } from "react"
import { Percent, CheckCircle, Save, DollarSign, Wallet } from "lucide-react"
import { updateSellerCommissionAction } from "@/app/actions/ecommerce-actions"
import type { SellerCommissionSettings } from "@/services/settings-service"

interface CommissionSettingsViewProps {
  initialSettings: SellerCommissionSettings
}

export function CommissionSettingsView({
  initialSettings,
}: CommissionSettingsViewProps) {
  const [activation, setActivation] = useState(initialSettings.commissionActivation)
  const [commissionType, setCommissionType] = useState<
    "fixed_rate" | "seller_based" | "category_based"
  >(initialSettings.commissionType)
  const [fixedRate, setFixedRate] = useState(initialSettings.fixedCommissionRate)
  const [minWithdraw, setMinWithdraw] = useState(
    initialSettings.minimumWithdrawalAmount
  )
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateSellerCommissionAction({
        commissionActivation: activation,
        commissionType,
        fixedCommissionRate: Number(fixedRate),
        minimumWithdrawalAmount: Number(minWithdraw),
      })
      setSuccessMsg("Seller commission settings saved successfully!")
      setTimeout(() => setSuccessMsg(""), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Percent className="w-5 h-5 text-[#d43533]" />
          Seller Commission & Payout Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure marketplace platform commissions, vendor payout deductions, and minimum withdrawal thresholds
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Activation */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Seller Commission Activation
              </h2>
              <p className="text-[11px] text-slate-500">
                Enable or disable automated platform commission deductions on vendor sales
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activation}
                onChange={(e) => setActivation(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>
        </div>

        {/* Card 2: Commission Calculation Type */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-sm font-bold text-slate-800">Commission Strategy</h2>
            <p className="text-[11px] text-slate-500">
              Select how marketplace sales deductions are calculated
            </p>
          </div>

          <div className="p-5 space-y-4">
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="commissionType"
                  value="fixed_rate"
                  checked={commissionType === "fixed_rate"}
                  onChange={() => setCommissionType("fixed_rate")}
                  className="mt-0.5 text-[#d43533] focus:ring-[#d43533]"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Fixed Platform Commission Rate (%)</div>
                  <div className="text-[11px] text-slate-500">
                    A flat uniform percentage is deducted from all vendor order totals
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="commissionType"
                  value="seller_based"
                  checked={commissionType === "seller_based"}
                  onChange={() => setCommissionType("seller_based")}
                  className="mt-0.5 text-[#d43533] focus:ring-[#d43533]"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Seller-Based Custom Commission Rate</div>
                  <div className="text-[11px] text-slate-500">
                    Each individual vendor profile defines its own customized commission percentage
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="commissionType"
                  value="category_based"
                  checked={commissionType === "category_based"}
                  onChange={() => setCommissionType("category_based")}
                  className="mt-0.5 text-[#d43533] focus:ring-[#d43533]"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Category-Based Commission Rate</div>
                  <div className="text-[11px] text-slate-500">
                    Commissions vary according to product category (e.g. Fashion 10%, Electronics 5%)
                  </div>
                </div>
              </label>
            </div>

            {commissionType === "fixed_rate" && (
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Fixed Commission Rate (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative w-48">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={fixedRate}
                    onChange={(e) => setFixedRate(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none pr-8"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Minimum Withdrawal Threshold */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-sm font-bold text-slate-800">Seller Payout Withdrawal Limits</h2>
            <p className="text-[11px] text-slate-500">
              Set the minimum earned wallet threshold before vendors can submit payout requests
            </p>
          </div>

          <div className="p-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Minimum Seller Amount Withdraw (৳) <span className="text-red-500">*</span>
            </label>
            <div className="relative w-64">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">৳</span>
              <input
                type="number"
                min="0"
                step="50"
                value={minWithdraw}
                onChange={(e) => setMinWithdraw(Number(e.target.value))}
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded focus:border-[#d43533] focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Sellers with earnings below this amount will not be able to initiate bank/bKash withdrawal requests.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving Configuration..." : "Save Commission Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
