"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  DollarSign,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  X,
  CreditCard,
  Building,
  Smartphone,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { processWithdrawRequestAction } from "@/app/actions/ecommerce-actions"
import type { SellerWithdrawItem } from "@/services/seller-service"

interface PayoutRequestsViewProps {
  initialRequests: SellerWithdrawItem[]
}

export function PayoutRequestsView({ initialRequests }: PayoutRequestsViewProps) {
  const [requests, setRequests] = useState<SellerWithdrawItem[]>(initialRequests)
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid" | "rejected">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeModalRequest, setActiveModalRequest] = useState<SellerWithdrawItem | null>(null)
  const [payMethod, setPayMethod] = useState("bKash")
  const [txId, setTxId] = useState("")
  const [adminNote, setAdminNote] = useState("")
  const [processing, setProcessing] = useState(false)

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPending = requests
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + r.amount, 0)
  const totalPaid = requests
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.amount, 0)

  const handleProcess = async (status: "paid" | "rejected") => {
    if (!activeModalRequest) return
    setProcessing(true)
    try {
      const numericId = typeof activeModalRequest.id === "number" ? activeModalRequest.id : 1
      await processWithdrawRequestAction({
        requestId: numericId,
        status,
        paymentMethod: payMethod,
        transactionId: txId || undefined,
        adminNote: adminNote || undefined,
      })

      setRequests((prev) =>
        prev.map((r) =>
          r.id === activeModalRequest.id
            ? {
                ...r,
                status,
                paymentMethod: payMethod,
                transactionId: txId,
                adminNote,
              }
            : r
        )
      )
      setActiveModalRequest(null)
      setTxId("")
      setAdminNote("")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/sellers"
              className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sellers
            </Link>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Seller Payout Requests</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Process settlement payouts, approve bank or mobile transfers, and record transaction IDs
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <div className="text-xs text-slate-500 font-medium">Paid Settlements</div>
            <div className="text-xl font-bold text-slate-800">{formatPrice(totalPaid)}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Requests</div>
            <div className="text-xl font-bold text-slate-800">{requests.length} requests</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by shop name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 bg-white focus:outline-none focus:border-[#d43533]"
          >
            <option value="all">All Request Status</option>
            <option value="pending">Pending Only</option>
            <option value="paid">Paid Only</option>
            <option value="rejected">Rejected Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Shop & Seller</th>
                <th className="py-3 px-4">Requested Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-500">{idx + 1}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{item.date}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800 text-sm">{item.shopName}</div>
                    <div className="text-[11px] text-slate-500">{item.sellerName}</div>
                    {item.message && (
                      <div className="text-[11px] text-slate-400 italic mt-0.5 max-w-xs truncate">
                        "{item.message}"
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#d43533] text-sm">
                    {formatPrice(item.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <span className="inline-flex items-center gap-1 font-medium">
                      {item.paymentMethod || "bKash"}
                    </span>
                    {item.transactionId && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        Tx: {item.transactionId}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                        item.status === "paid"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.status === "rejected"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.status === "paid" && <CheckCircle className="w-3 h-3" />}
                      {item.status === "rejected" && <XCircle className="w-3 h-3" />}
                      {item.status === "pending" && <Clock className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.status === "pending" ? (
                      <button
                        onClick={() => setActiveModalRequest(item)}
                        className="px-3 py-1 bg-[#d43533] hover:bg-[#b82a28] text-white text-[11px] font-semibold rounded shadow-xs transition-colors"
                      >
                        Process Payout
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveModalRequest(item)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded transition-colors"
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal */}
      {activeModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveModalRequest(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {activeModalRequest.status === "pending"
                ? "Process Withdrawal Request"
                : "Payout Details"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Shop: <span className="font-bold text-slate-700">{activeModalRequest.shopName}</span>{" "}
              | Amount:{" "}
              <span className="font-bold text-[#d43533]">
                {formatPrice(activeModalRequest.amount)}
              </span>
            </p>

            {activeModalRequest.status === "pending" ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Settlement Method
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
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
                    Transaction ID / Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TXN-BK-918239"
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admin Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any notes for the merchant..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
                  />
                </div>

                <div className="pt-2 flex justify-between gap-2">
                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => handleProcess("rejected")}
                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-semibold transition-colors"
                  >
                    Reject Request
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalRequest(null)}
                      className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={processing}
                      onClick={() => handleProcess("paid")}
                      className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-semibold transition-colors"
                    >
                      {processing ? "Processing..." : "Approve & Mark Paid"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="text-slate-500">Method: <span className="font-semibold text-slate-800">{activeModalRequest.paymentMethod}</span></div>
                  {activeModalRequest.transactionId && (
                    <div className="text-slate-500 mt-1">TxID: <span className="font-mono text-slate-800">{activeModalRequest.transactionId}</span></div>
                  )}
                  {activeModalRequest.adminNote && (
                    <div className="text-slate-500 mt-1">Note: <span className="text-slate-800">{activeModalRequest.adminNote}</span></div>
                  )}
                </div>
                <div className="text-right pt-2">
                  <button
                    onClick={() => setActiveModalRequest(null)}
                    className="px-4 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
