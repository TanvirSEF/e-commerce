"use client"

import React, { useState } from "react"
import { CreditCard, Plus, X, Trash2, Loader2, Check } from "lucide-react"
import type { CustomerPaymentInfoItem } from "@/services/customer-extra-service"
import {
  addCustomerPaymentInfoAction,
  deleteCustomerPaymentInfoAction,
  setDefaultPaymentInfoAction,
} from "@/app/actions/ecommerce-actions"

interface ProfilePaymentInfoProps {
  initialPaymentInfos: CustomerPaymentInfoItem[]
}

export function ProfilePaymentInfo({ initialPaymentInfos }: ProfilePaymentInfoProps) {
  const [paymentList, setPaymentList] = useState<CustomerPaymentInfoItem[]>(initialPaymentInfos)
  const [showModal, setShowModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const [paymentType, setPaymentType] = useState<"bank_transfer" | "bkash" | "nagad" | "others">("bkash")
  const [bankName, setBankName] = useState("")
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [paymentInstruction, setPaymentInstruction] = useState("")

  const notify = (msg: string) => {
    setStatusMessage(msg)
    setTimeout(() => setStatusMessage(null), 3500)
  }

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accountName || !accountNumber) return

    setIsSaving(true)
    try {
      const res = await addCustomerPaymentInfoAction({
        paymentType,
        bankName: paymentType === "bank_transfer" ? bankName : undefined,
        accountName,
        accountNumber,
        routingNumber: paymentType === "bank_transfer" ? routingNumber : undefined,
        paymentInstruction: paymentType === "others" ? paymentInstruction : undefined,
        setDefault: paymentList.length === 0,
      })

      if (res.success && res.item) {
        setPaymentList([res.item, ...paymentList])
        setShowModal(false)
        setBankName("")
        setAccountName("")
        setAccountNumber("")
        setRoutingNumber("")
        setPaymentInstruction("")
        notify("Payment information saved successfully!")
      } else {
        notify("Failed to save payment information.")
      }
    } catch {
      notify("Failed to save payment information.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return
    const prev = [...paymentList]
    setPaymentList(paymentList.filter((p) => p.id !== id))
    try {
      const res = await deleteCustomerPaymentInfoAction(id)
      if (!res.success) {
        setPaymentList(prev)
        notify("Failed to delete payment info.")
      } else {
        notify("Payment info removed.")
      }
    } catch {
      setPaymentList(prev)
      notify("Failed to delete payment info.")
    }
  }

  const handleSetDefault = async (id: number) => {
    setPaymentList(
      paymentList.map((p) => ({
        ...p,
        setDefault: p.id === id,
      }))
    )
    try {
      await setDefaultPaymentInfoAction(id)
      notify("Default refund payout method updated.")
    } catch {
      notify("Failed to set default payment info.")
    }
  }

  return (
    <div className="rounded border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#d43533]" />
          <div>
            <h2 className="text-base font-bold text-gray-900">Payment Information (For Refunds)</h2>
            <p className="text-xs text-gray-500">Provide bank or mobile wallet details for receiving refund payouts (Active eCommerce CMS)</p>
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

      {statusMessage && (
        <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 mb-4 animate-in fade-in">
          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {paymentList.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-200 rounded text-xs text-gray-500">
          No refund payment details saved yet. Add your bank or mobile wallet to expedite product refund requests.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentList.map((item) => (
            <div
              key={item.id}
              className={`rounded border p-4 text-xs transition-colors relative ${
                item.setDefault ? "border-[#d43533] bg-red-50/15" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 text-sm uppercase">
                  {item.paymentType === "bank_transfer" ? item.bankName || "Bank Transfer" : item.paymentType}
                </span>
                {item.setDefault && (
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
                    <span className="text-gray-400">Routing Number:</span> {item.routingNumber}
                  </p>
                )}
                {item.paymentInstruction && (
                  <p>
                    <span className="text-gray-400">Instructions:</span> {item.paymentInstruction}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <div>
                  {!item.setDefault && (
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
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Delete payment info"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

              {paymentType === "others" && (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Payment Instructions</label>
                  <textarea
                    rows={2}
                    placeholder="Additional payout instructions"
                    value={paymentInstruction}
                    onChange={(e) => setPaymentInstruction(e.target.value)}
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
                  disabled={isSaving}
                  className="rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Save Payment Info</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
