"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DollarSign, Clock, CheckCircle, XCircle, Plus, X } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { sellerRequestPayoutAction } from "@/app/actions/seller-panel-actions"

interface PayoutRequest {
  id: number
  amount: number
  message: string
  status: "pending" | "paid" | "rejected"
  paymentMethod: string
  transactionId: string
  date: string
}

interface SellerPayoutsViewProps {
  initialRequests: PayoutRequest[]
  currentBalance: number
  minimumWithdrawal: number
}

export function SellerPayoutsView({ initialRequests, currentBalance, minimumWithdrawal }: SellerPayoutsViewProps) {
  const router = useRouter()
  const [requests, setRequests] = useState(initialRequests)
  useEffect(() => setRequests(initialRequests), [initialRequests])

  const [showModal, setShowModal] = useState(false)
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("bKash")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      const res = await sellerRequestPayoutAction({ amount: parseFloat(amount), message, paymentMethod })
      if (!res.success) {
        setError(res.error || "Could not submit request.")
        return
      }
      setSubmitSuccess(true)
      router.refresh()
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

  const cards = [
    { label: "Pending Balance", value: currentBalance, icon: DollarSign, tone: "bg-blue-50 text-blue-600" },
    { label: "Pending Payouts", value: totalPending, icon: Clock, tone: "bg-amber-50 text-amber-600" },
    { label: "Total Settled", value: totalPaid, icon: CheckCircle, tone: "bg-emerald-50 text-emerald-600" },
  ]

  const inputCls = "w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Money Withdraw</h1>
          <p className="text-xs text-slate-500 mt-0.5">Withdraw your store earnings to your preferred payment method</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Send Withdraw Request
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.tone}`}>
              <c.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">{c.label}</div>
              <div className="text-xl font-bold text-slate-800">{formatPrice(c.value)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 font-bold text-xs text-slate-700 uppercase tracking-wider">
          Withdraw Request History
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req, idx) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400">{idx + 1}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                    {new Date(req.date).toISOString().slice(0, 16).replace("T", " ")}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#d43533] text-sm">{formatPrice(req.amount)}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{req.paymentMethod || "—"}</td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate italic text-[11px]">{req.message || "—"}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{req.transactionId || "—"}</td>
                  <td className="py-3.5 px-4 text-right">
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
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                    No withdraw requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-800 mb-1">Send A Withdraw Request</h3>
            <p className="text-xs text-slate-500 mb-4">
              Pending Balance: <span className="font-bold text-emerald-700">{formatPrice(currentBalance)}</span>
              {minimumWithdrawal > 0 && <> · Minimum: {formatPrice(minimumWithdrawal)}</>}
            </p>

            {submitSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-center text-xs font-semibold">
                Request has been sent successfully. Awaiting admin approval.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</div>}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount <span className="text-red-500">*</span></label>
                  <input required type="number" min={minimumWithdrawal || 1} max={currentBalance} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={`${inputCls} bg-white`}>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                  <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className={inputCls} />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50 cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] disabled:opacity-60 text-white rounded text-xs font-semibold cursor-pointer">
                    {isSubmitting ? "Sending..." : "Send"}
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
