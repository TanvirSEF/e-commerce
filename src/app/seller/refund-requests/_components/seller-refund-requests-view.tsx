"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { Search, Check, X, Eye, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { RefundRequestItem } from "@/services/refund-service"
import { sellerUpdateRefundRequestStatusAction } from "@/app/actions/ecommerce-actions"

interface SellerRefundRequestsViewProps {
  initialRefunds: RefundRequestItem[]
  stats?: {
    total: number
    pending: number
    approved: number
    rejected: number
    totalAmount: number
  }
}

export function SellerRefundRequestsView({ initialRefunds, stats: initialStats }: SellerRefundRequestsViewProps) {
  const [refunds, setRefunds] = useState<RefundRequestItem[]>(initialRefunds)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [viewReasonTarget, setViewReasonTarget] = useState<RefundRequestItem | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleUpdateStatus = (id: string, newStatus: "approved" | "rejected") => {
    startTransition(async () => {
      const res = await sellerUpdateRefundRequestStatusAction({
        requestId: id,
        status: newStatus,
        adminNote: `Updated by seller to ${newStatus}`,
      })
      if (res.success) {
        setRefunds((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        )
        showToast("success", `Refund request ${newStatus} successfully!`)
      } else {
        showToast("error", "Failed to update refund request.")
      }
    })
  }

  const filtered = refunds.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        r.orderCode?.toLowerCase().includes(q) ||
        r.productName?.toLowerCase().includes(q) ||
        r.customerName?.toLowerCase().includes(q) ||
        r.reason?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const totalCount = initialStats?.total ?? refunds.length
  const pendingCount = initialStats?.pending ?? refunds.filter((r) => r.status === "pending").length
  const approvedCount = initialStats?.approved ?? refunds.filter((r) => r.status === "approved").length
  const rejectedCount = initialStats?.rejected ?? refunds.filter((r) => r.status === "rejected").length

  return (
    <div className="space-y-4">
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-sm rounded border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {feedback.text}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Received Refund Requests</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Review, approve, or reject customer refund claims for products from your shop
        </p>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded border border-gray-200 bg-white p-3.5 shadow-xs">
          <p className="text-xs text-gray-500 font-medium">Total Requests</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{totalCount}</p>
        </div>
        <div className="rounded border border-gray-200 bg-white p-3.5 shadow-xs">
          <p className="text-xs text-gray-500 font-medium">Pending Review</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{pendingCount}</p>
        </div>
        <div className="rounded border border-gray-200 bg-white p-3.5 shadow-xs">
          <p className="text-xs text-gray-500 font-medium">Approved</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{approvedCount}</p>
        </div>
        <div className="rounded border border-gray-200 bg-white p-3.5 shadow-xs">
          <p className="text-xs text-gray-500 font-medium">Rejected</p>
          <p className="text-xl font-bold text-red-600 mt-1">{rejectedCount}</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded border border-gray-200 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order, product, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-300 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#d43533]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Order Code</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No refund requests found
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const statusColors: Record<string, string> = {
                    pending: "bg-amber-50 text-amber-700 border-amber-200",
                    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    rejected: "bg-red-50 text-red-700 border-red-200",
                  }
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 text-gray-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/seller/orders/${item.orderId || item.orderCode}`}
                          className="font-bold text-[#007bff] hover:underline"
                        >
                          {item.orderCode}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800 max-w-xs truncate">
                        {item.productName}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">{item.customerName}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{formatPrice(item.amount)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${
                            statusColors[item.status.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate max-w-[150px]">{item.reason}</span>
                          <button
                            type="button"
                            onClick={() => setViewReasonTarget(item)}
                            title="View Reason Details"
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.status === "pending" ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item.id, "approved")}
                              disabled={isPending}
                              title="Approve Refund"
                              className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item.id, "rejected")}
                              disabled={isPending}
                              title="Reject Refund"
                              className="w-7 h-7 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 capitalize">{item.status}</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reason Details Modal */}
      {viewReasonTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h4 className="text-sm font-bold text-gray-900">Refund Request Reason</h4>
              <button
                type="button"
                onClick={() => setViewReasonTarget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-3 space-y-3 text-xs">
              <div>
                <p className="text-gray-400 font-medium">Order Code</p>
                <p className="font-bold text-gray-900 mt-0.5">{viewReasonTarget.orderCode}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Reason</p>
                <p className="font-semibold text-gray-800 mt-0.5">{viewReasonTarget.reason}</p>
              </div>
              {viewReasonTarget.details && (
                <div>
                  <p className="text-gray-400 font-medium">Customer Details</p>
                  <p className="text-gray-700 bg-gray-50 p-2.5 rounded border border-gray-200 mt-0.5 whitespace-pre-wrap">
                    {viewReasonTarget.details}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setViewReasonTarget(null)}
                className="px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
