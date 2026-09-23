"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  RotateCcw,
  Search,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { createRefundAction } from "@/app/actions/ecommerce-actions"
import type { RefundRequestItem } from "@/services/refund-service"

interface RefundRequestsViewProps {
  initialRefunds: RefundRequestItem[]
}

const REASON_OPTIONS = [
  "Damaged / defective item received",
  "Wrong size delivered",
  "Wrong product / color received",
  "Item missing from package",
  "Product quality not as advertised",
  "Package arrived late / damaged in transit",
  "Other",
]

export function RefundRequestsView({ initialRefunds }: RefundRequestsViewProps) {
  const [refunds, setRefunds] = useState<RefundRequestItem[]>(initialRefunds)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  // Form State
  const [orderCode, setOrderCode] = useState("")
  const [productName, setProductName] = useState("")
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState(REASON_OPTIONS[0])
  const [details, setDetails] = useState("")

  const filtered = refunds.filter(
    (r) =>
      r.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingCount = refunds.filter((r) => r.status === "pending").length
  const approvedCount = refunds.filter((r) => r.status === "approved").length
  const rejectedCount = refunds.filter((r) => r.status === "rejected").length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderCode || !productName || !amount) return

    setIsSubmitting(true)
    try {
      const res = await createRefundAction({
        orderCode,
        productName,
        userName: "Customer",
        amount: Number(amount),
        reason,
        details,
      })

      if (res.success) {
        const newRefund: RefundRequestItem = {
          id: `ref-${Date.now()}`,
          orderCode,
          productName,
          customerName: "Customer",
          shopName: "Active Fashion Outlet",
          amount: Number(amount),
          reason,
          details,
          status: "pending",
          date: new Date().toISOString().slice(0, 10),
        }
        setRefunds((prev) => [newRefund, ...prev])
        setIsModalOpen(false)
        setOrderCode("")
        setProductName("")
        setAmount("")
        setDetails("")
        setSuccessMsg("Refund request submitted successfully! Our team will review it shortly.")
        setTimeout(() => setSuccessMsg(""), 5000)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-[#d43533]" />
            Applied Refund & Return Requests
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor status of your returned products and wallet credit refunds
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#d43533] text-white text-xs font-bold rounded shadow-sm hover:bg-[#b82a28] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Request a Refund
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-black text-gray-900">{refunds.length}</div>
            <div className="text-[11px] text-gray-500 font-medium">Total Requests</div>
          </div>
        </div>

        <div className="bg-white border border-amber-200 rounded p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-black text-amber-600">{pendingCount}</div>
            <div className="text-[11px] text-gray-500 font-medium">Pending Review</div>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 rounded p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-600">{approvedCount}</div>
            <div className="text-[11px] text-gray-500 font-medium">Approved & Refunded</div>
          </div>
        </div>

        <div className="bg-white border border-red-200 rounded p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-black text-red-600">{rejectedCount}</div>
            <div className="text-[11px] text-gray-500 font-medium">Declined</div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-gray-900">Refund Requests History</h2>
          <div className="relative w-full sm:w-72">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order, product, reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/70 text-gray-700 font-bold uppercase text-[10px] border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Order Code</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                    No refund requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-5 py-3.5 font-bold text-[#d43533]">
                      <Link href={`/order-confirmed/${item.orderCode}`} className="hover:underline">
                        {item.orderCode}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800 max-w-[200px] truncate">
                      {item.productName}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-gray-900">
                      {formatPrice(item.amount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-gray-800 font-medium">{item.reason}</div>
                      {item.details && (
                        <div className="text-[11px] text-gray-500 italic mt-0.5 truncate max-w-[220px]">
                          &ldquo;{item.details}&rdquo;
                        </div>
                      )}
                      {item.adminNote && (
                        <div className="mt-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          Admin: {item.adminNote}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      {item.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Refund Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-[#d43533]" />
                Send Refund / Return Request
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Order Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20260923-847291"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Cotton Casual Shirt"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Refund Amount (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 1850"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reason for Refund <span className="text-red-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded bg-white focus:border-[#d43533] focus:outline-none"
                >
                  {REASON_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Additional Details & Explanation
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain the defect, mismatch or condition..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#d43533] text-white rounded text-xs font-bold hover:bg-[#b82a28] disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
