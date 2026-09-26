"use client"

import React, { useState } from "react"
import { CreditCard, Plus, X, Trash2, CheckCircle2 } from "lucide-react"

export interface PaymentInfo {
  id: string
  paymentType: "bank_transfer" | "bkash" | "nagad" | "others"
  bankName?: string
  accountName: string
  accountNumber: string
  routingNumber?: string
  isDefault: boolean
}

export function ProfilePaymentInfo() {
  const [paymentList, setPaymentList] = useState<PaymentInfo[]>([
    {
      id: "pay-1",
      paymentType: "bkash",
      accountName: "Tanvir Ahmed",
      accountNumber: "+880 1712 345678",
      isDefault: true,
    },
    {
      id: "pay-2",
      paymentType: "bank_transfer",
      bankName: "Dutch-Bangla Bank PLC",
      accountName: "Tanvir Ahmed",
      accountNumber: "152.120.984521",
      routingNumber: "090273829",
      isDefault: false,
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [paymentType, setPaymentType] = useState<"bank_transfer" | "bkash" | "nagad" | "others">("bkash")
  const [bankName, setBankName] = useState("")
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!accountName || !accountNumber) return

    setPaymentList([
      ...paymentList,
      {
        id: `pay-${Date.now()}`,
        paymentType,
        bankName: paymentType === "bank_transfer" ? bankName : undefined,
        accountName,
        accountNumber,
        routingNumber: paymentType === "bank_transfer" ? routingNumber : undefined,
        isDefault: paymentList.length === 0,
      },
    ])
    setShowModal(false)
    setBankName("")
    setAccountName("")
    setAccountNumber("")
    setRoutingNumber("")
  }

  const handleDelete = (id: string) => {
    setPaymentList(paymentList.filter((p) => p.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setPaymentList(
      paymentList.map((p) => ({
        ...p,
        isDefault: p.id === id,
      }))
    )
  }

  return (
    <div className="rounded border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#d43533]" />
          <div>
            <h2 className="text-base font-bold text-gray-900">Payment Information (For Refunds)</h2>
            <p className="text-xs text-gray-500">Provide bank or mobile wallet details for receiving refund payouts</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-[#1967d2] hover:bg-blue-100 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Payment Info
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentList.map((item) => (
          <div
            key={item.id}
            className={`rounded border p-4 text-xs transition-colors relative ${
              item.isDefault ? "border-[#d43533] bg-red-50/15" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900 text-sm uppercase">
                {item.paymentType === "bank_transfer" ? item.bankName || "Bank Transfer" : item.paymentType}
              </span>
              {item.isDefault && (
                <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#d43533]">
                  Default Payout
                </span>
              )}
            </div>

            <div className="space-y-0.5 text-gray-700">
              <p>
                <span className="text-gray-400">Account Holder:</span> <strong>{item.accountName}</strong>
              </p>
              <p>
                <span className="text-gray-400">Account Number:</span> {item.accountNumber}
              </p>
              {item.routingNumber && (
                <p>
                  <span className="text-gray-400">Routing:</span> {item.routingNumber}
                </p>
              )}
            </div>

            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <div>
                {!item.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(item.id)}
                    className="font-medium text-[#1967d2] hover:underline"
                  >
                    Make Default
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Delete payment info"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Payment Info */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded bg-white p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
              <CreditCard className="h-5 w-5 text-[#d43533]" />
              <h4 className="text-base font-bold text-gray-900">Add Payment Information</h4>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Payment Method Type</label>
                <select
                  value={paymentType}
                  onChange={(e: any) => setPaymentType(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                >
                  <option value="bkash">bKash Personal / Merchant</option>
                  <option value="nagad">Nagad Personal</option>
                  <option value="bank_transfer">Bank Transfer (Direct Deposit)</option>
                  <option value="others">Other Payment Method</option>
                </select>
              </div>

              {paymentType === "bank_transfer" && (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dutch-Bangla Bank, City Bank, BRAC Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Account / Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={paymentType === "bank_transfer" ? "Bank account number" : "e.g. +880 1712 345678"}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                />
              </div>

              {paymentType === "bank_transfer" && (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Routing Number</label>
                  <input
                    type="text"
                    placeholder="9-digit bank routing code"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-none"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors"
                >
                  Save Payment Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
