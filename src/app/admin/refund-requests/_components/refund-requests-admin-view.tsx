"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  RotateCcw,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Check,
  X,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { processRefundAction } from "@/app/actions/ecommerce-actions"
import type { RefundRequestItem } from "@/services/refund-service"

interface RefundRequestsAdminViewProps {
  initialRefunds: RefundRequestItem[]
}

export function RefundRequestsAdminView({
  initialRefunds,
}: RefundRequestsAdminViewProps) {
  const [refunds, setRefunds] = useState<RefundRequestItem[]>(initialRefunds)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedRefund, setSelectedRefund] = useState<RefundRequestItem | null>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [adminNote, setAdminNote] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const filtered = refunds.filter((r) => {
    const matchesSearch =
      r.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false
    if (statusFilter !== "all" && r.status !== statusFilter) return false
    return true
  })

  const pendingCount = refunds.filter((r) => r.status === "pending").length
  const approvedCount = refunds.filter((r) => r.status === "approved").length
  const rejectedCount = refunds.filter((r) => r.status === "rejected").length

  const handleProcessAction = async () => {
    if (!selectedRefund || !actionType) return

    setIsProcessing(true)
    try {
      const newStatus = actionType === "approve" ? "approved" : "rejected"
      await processRefundAction({
        requestId: selectedRefund.id,
        status: newStatus,
        adminNote: adminNote.trim() || undefined,
      })

      setRefunds((prev) =>
        prev.map((r) =>
          r.id === selectedRefund.id
            ? { ...r, status: newStatus, adminNote: adminNote.trim() || r.adminNote }
            : r
        )
      )
      setSelectedRefund(null)
      setActionType(null)
      setAdminNote("")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#d43533]" />
            Refund & Return Requests Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit buyer return requests, inspect reasons, and issue wallet balances
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Requests</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{refunds.length}</div>
        </div>
        <div className="bg-white border border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-amber-600 uppercase">Pending Review</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
        </div>
        <div className="bg-white border border-emerald-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600 uppercase">Approved</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</div>
        </div>
        <div className="bg-white border border-red-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-red-600 uppercase">Rejected</div>
          <div className="text-2xl font-black text-red-600 mt-1">{rejectedCount}</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {/* Table Filters Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded text-xs font-semibold ${
                statusFilter === "all"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({refunds.length})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded text-xs font-semibold ${
                statusFilter === "pending"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-3 py-1.5 rounded text-xs font-semibold ${
                statusFilter === "approved"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Approved ({approvedCount})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order, buyer, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Order Code</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Product Name</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-xs text-slate-400">
                    No refund requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 text-slate-400 font-medium">{idx + 1}</td>
                    <td className="px-5 py-3 font-bold text-[#d43533] whitespace-nowrap">
                      {item.orderCode}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {item.customerName}
                    </td>
                    <td className="px-5 py-3 max-w-[200px] truncate font-medium text-slate-800">
                      {item.productName}
                    </td>
                    <td className="px-5 py-3 font-bold text-slate-900 whitespace-nowrap">
                      {formatPrice(item.amount)}
                    </td>
                    <td className="px-5 py-3 max-w-[220px]">
                      <div className="truncate font-semibold text-slate-700">{item.reason}</div>
                      {item.details && (
                        <div className="truncate text-[11px] text-slate-400 italic">
                          {item.details}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
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
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRefund(item)
                            setActionType(null)
                          }}
                          className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          title="Inspect Request"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {item.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRefund(item)
                                setActionType("approve")
                                setAdminNote("Approved and refunded to customer wallet.")
                              }}
                              className="p-1.5 rounded text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title="Approve Refund"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRefund(item)
                                setActionType("reject")
                                setAdminNote("Product does not meet return policy criteria.")
                              }}
                              className="p-1.5 rounded text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Reject Refund"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect & Approval Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#d43533]" />
                {actionType === "approve"
                  ? "Approve Refund Request"
                  : actionType === "reject"
                  ? "Reject Refund Request"
                  : "Inspect Refund Request"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedRefund(null)
                  setActionType(null)
                }}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Order Code</div>
                  <div className="font-bold text-[#d43533]">{selectedRefund.orderCode}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Amount</div>
                  <div className="font-bold text-slate-800">{formatPrice(selectedRefund.amount)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Customer</div>
                  <div className="font-medium text-slate-700">{selectedRefund.customerName}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Requested Date</div>
                  <div className="font-medium text-slate-700">{selectedRefund.date}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Product</div>
                <div className="font-bold text-slate-900">{selectedRefund.productName}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Return Reason</div>
                <div className="p-2.5 bg-amber-50/60 border border-amber-100 rounded text-slate-800 font-medium">
                  {selectedRefund.reason}
                </div>
              </div>

              {selectedRefund.details && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Buyer Explanation</div>
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded text-slate-700">
                    {selectedRefund.details}
                  </div>
                </div>
              )}

              {actionType && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Admin Note & Explanation to Customer
                  </label>
                  <textarea
                    rows={3}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:border-[#d43533] focus:outline-none"
                    placeholder="Enter approval message or reason for rejection..."
                  />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRefund(null)
                  setActionType(null)
                }}
                className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>

              {actionType ? (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProcessAction}
                  className={`px-5 py-2 rounded text-xs font-bold text-white disabled:opacity-50 ${
                    actionType === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isProcessing
                    ? "Processing..."
                    : actionType === "approve"
                    ? "Confirm Approval & Credit"
                    : "Confirm Rejection"}
                </button>
              ) : selectedRefund.status === "pending" ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActionType("reject")
                      setAdminNote("Product does not meet return policy criteria.")
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActionType("approve")
                      setAdminNote("Approved and refunded to customer wallet.")
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700"
                  >
                    Approve
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
