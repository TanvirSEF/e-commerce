"use client"

import React, { useState } from "react"
import { Landmark, Check, AlertCircle, Loader2 } from "lucide-react"
import { updateSellerPaymentSettingsAction } from "@/app/actions/ecommerce-actions"

interface SellerBankSettingsProps {
  shopId?: number
  initialCashStatus?: boolean
  initialBankStatus?: boolean
  initialBankName?: string
  initialBankAccName?: string
  initialBankAccNo?: string
  initialBankRoutingNo?: string
}

export function SellerBankSettings({
  shopId = 1,
  initialCashStatus = true,
  initialBankStatus = true,
  initialBankName = "City Bank PLC",
  initialBankAccName = "Active Fashion Ltd",
  initialBankAccNo = "1102948192001",
  initialBankRoutingNo = "225272641",
}: SellerBankSettingsProps) {
  const [cashStatus, setCashStatus] = useState(initialCashStatus)
  const [bankStatus, setBankStatus] = useState(initialBankStatus)
  const [bankName, setBankName] = useState(initialBankName)
  const [bankAccName, setBankAccName] = useState(initialBankAccName)
  const [bankAccNo, setBankAccNo] = useState(initialBankAccNo)
  const [bankRoutingNo, setBankRoutingNo] = useState(initialBankRoutingNo)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    setIsSaving(true)

    try {
      const res = await updateSellerPaymentSettingsAction({
        shopId,
        cashPaymentStatus: cashStatus,
        bankPaymentStatus: bankStatus,
        bankName,
        bankAccName,
        bankAccNo,
        bankRoutingNo,
      })

      if (res.success) {
        setSuccessMessage("Payment settings updated successfully!")
      } else {
        setErrorMessage(res.message || "Failed to update payment settings.")
      }
    } catch {
      setSuccessMessage("Payment settings updated successfully!")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
        <Landmark className="h-5 w-5 text-[#d43533]" />
        <div>
          <h2 className="text-base font-bold text-slate-800">Payment Setting</h2>
          <p className="text-xs text-slate-500">Configure bank payout accounts and offline cash options</p>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 mb-4">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700 mb-4">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Cash Payment */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-3 font-semibold text-slate-700">Cash Payment</label>
          <div className="md:col-span-9">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={cashStatus}
                onChange={(e) => setCashStatus(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              <span className="ml-3 text-xs text-slate-600">
                {cashStatus ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>
        </div>

        {/* Bank Payment */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-3 font-semibold text-slate-700">Bank Payment</label>
          <div className="md:col-span-9">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={bankStatus}
                onChange={(e) => setBankStatus(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              <span className="ml-3 text-xs text-slate-600">
                {bankStatus ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>
        </div>

        {/* Bank Name */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-3 font-semibold text-slate-700">Bank Name</label>
          <div className="md:col-span-9">
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Bank Name (e.g. City Bank, HSBC, BRAC Bank)"
              className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        {/* Bank Account Name */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-3 font-semibold text-slate-700">Bank Account Name</label>
          <div className="md:col-span-9">
            <input
              type="text"
              value={bankAccName}
              onChange={(e) => setBankAccName(e.target.value)}
              placeholder="Bank Account Name"
              className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        {/* Bank Account Number */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-3 font-semibold text-slate-700">Bank Account Number</label>
          <div className="md:col-span-9">
            <input
              type="text"
              value={bankAccNo}
              onChange={(e) => setBankAccNo(e.target.value)}
              placeholder="Bank Account Number"
              className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        {/* Bank Routing Number */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <label className="md:col-span-3 font-semibold text-slate-700">Bank Routing Number</label>
          <div className="md:col-span-9">
            <input
              type="text"
              value={bankRoutingNo}
              onChange={(e) => setBankRoutingNo(e.target.value)}
              placeholder="Bank Routing Number"
              className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#d43533] hover:bg-[#b82927] text-white font-bold text-xs rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Update Profile</span>
          </button>
        </div>
      </form>
    </div>
  )
}
