"use client"

import React, { useState, useTransition } from "react"
import { X, Wallet } from "lucide-react"
import type { AdminCustomerItem } from "@/types/customer-admin"
import { adminRechargeWalletAction } from "@/app/actions/customer-actions"

interface Props {
  customer: AdminCustomerItem
  onClose: () => void
}

export function WalletRechargeDrawer({ customer, onClose }: Props) {
  const [amount, setAmount] = useState("")
  const [trxId, setTrxId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("bKash")
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const amountNum = parseFloat(amount)
    if (!amountNum || amountNum <= 0) { setError("Please enter a valid amount."); return }
    if (!trxId.trim()) { setError("Transaction ID is required."); return }

    startTransition(async () => {
      try {
        await adminRechargeWalletAction({
          userId: customer.id,
          amount: amountNum,
          trxId: trxId.trim(),
          paymentMethod,
        })
        setSuccess(true)
      } catch {
        setError("Failed to recharge. Please try again.")
      }
    })
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#d43533]" />
            <span className="text-sm font-semibold text-gray-800">Recharge Wallet</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {success ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-gray-800">Wallet recharged!</p>
              <p className="text-xs text-gray-500 mt-1">৳{amount} added to {customer.name}'s wallet.</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-gray-50 rounded text-xs text-gray-600">
                <div className="font-semibold text-gray-800">{customer.name}</div>
                <div>{customer.email}</div>
                <div className="mt-1">Current Balance: <strong>৳{customer.balance.toLocaleString()}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Amount (৳)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Transaction ID</label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="TrxID or reference"
                  className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                />
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2 text-xs font-semibold bg-[#d43533] text-white rounded hover:bg-[#c12e2c] disabled:opacity-60 transition-colors"
              >
                {isPending ? "Processing..." : "Confirm Recharge"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
