"use client"

import React, { useState } from "react"
import { DollarSign, Clock, CheckCircle, XCircle, Plus, X } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { createSellerWithdrawAction } from "@/app/actions/ecommerce-actions"
import type { SellerWithdrawItem } from "@/services/seller-service"

interface SellerPayoutsViewProps {
  initialRequests: SellerWithdrawItem[]
  currentBalance: number
}

export function SellerPayoutsView({ initialRequests, currentBalance }: SellerPayoutsViewProps) {
  const [requests, setRequests] = useState<SellerWithdrawItem[]>(initialRequests)
  const [showModal, setShowModal] = useState(false)
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("bKash")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return
    setIsSubmitting(true)

    try {
      await createSellerWithdrawAction({
        shopId: 1,
        userId: "usr_seller_default_01",
        amount: parseFloat(amount),
        message,
        paymentMethod,
      })

      const newRequest: SellerWithdrawItem = {
        id: `req-${Date.now()}`,
        shopName: "Active Fashion Outlet",
        shopSlug: "active-fashion-outlet",
        sellerName: "Tanvir Ahmed",
        amount: parseFloat(amount),
        message,
        status: "pending",
        paymentMethod,
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
      }
      setRequests((prev) => [newRequest, ...prev])
      setSubmitSuccess(true)
      setTimeout(() => {
        setSubmitSuccess(false)
        setShowModal(false)
        setAmount("")
        setMessage("")
      }, 1500)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPending = requests.filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0)
  const totalPaid = requests.filter((r) => r.status === "paid").reduce((s, r) => s + r.amount, 0)

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Payout Requests</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Withdraw your store earnings to your preferred payment method
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Withdraw Request
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Available Balance</div>
            <div className="text-xl font-bold text-slate-800">{formatPrice(currentBalance)}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Pending Payouts</div>
            <div className="text-xl font-bold text-slate-800">{formatPrice(totalPending)}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Settled</div>
            <div className="text-xl font-bold text-slate-800">{formatPrice(totalPaid)}</div>
          </div>
        </div>
      </div>

      {/* Withdraw History Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 font-bold text-xs text-slate-700 uppercase tracking-wider">
          Withdrawal History
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{req.date}</td>
                  <td className="py-3.5 px-4 font-bold text-[#d43533] text-sm">
                    {formatPrice(req.amount)}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {req.paymentMethod || "bKash"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate italic text-[11px]">
                    {req.message || "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                        req.status === "paid"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : req.status === "rejected"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {req.status === "paid" && <CheckCircle className="w-3 h-3" />}
                      {req.status === "rejected" && <XCircle className="w-3 h-3" />}
                      {req.status === "pending" && <Clock className="w-3 h-3" />}
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                    {req.transactionId || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-800 mb-1">Send Withdraw Request</h3>
            <p className="text-xs text-slate-500 mb-4">
              Available Balance:{" "}
              <span className="font-bold text-emerald-700">{formatPrice(currentBalance)}</span>
            </p>

            {submitSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-center text-xs font-semibold">
                Withdraw request submitted! Awaiting admin approval.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    min="100"
                    max={currentBalance}
                    placeholder="Minimum ৳100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
                  >
                    <option value="bKash">bKash Merchant / Personal</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank Transfer">Bank Electronic Transfer</option>
                    <option value="Cash">Cash in Hand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message / Account Details
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. bKash: 01700000000 — Weekly settlement"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-semibold transition-colors"
                  >
                    {isSubmitting ? "Submitting..." : "Send Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
