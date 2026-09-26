"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Search, RotateCcw, CheckCircle, XCircle, Clock, Check, X } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export interface SellerRefundRow {
  id: string
  orderCode: string
  productName: string
  customerName: string
  amount: number
  reason: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

const DEFAULT_REFUNDS: SellerRefundRow[] = [
  {
    id: "ref-1",
    orderCode: "20260923-847291",
    productName: "Classic Men's Casual Shirt - Slim Fit Cotton",
    customerName: "Mohammad Tanvir",
    amount: 1250,
    reason: "Received wrong size (ordered XL, received L).",
    status: "pending",
    createdAt: "2026-09-24",
  },
  {
    id: "ref-2",
    orderCode: "20260918-192842",
    productName: "Wireless Mechanical Gaming Keyboard RGB",
    customerName: "Rashidul Islam",
    amount: 1700,
    reason: "Defective key switch on arrival.",
    status: "approved",
    createdAt: "2026-09-19",
  },
  {
    id: "ref-3",
    orderCode: "20260830-671203",
    productName: "Fast Charging USB-C Braided Cable 2M",
    customerName: "Nusrat Jahan",
    amount: 450,
    reason: "Accidental duplicate order.",
    status: "rejected",
    createdAt: "2026-09-02",
  },
]

export function SellerRefundRequestsView() {
  const [refunds, setRefunds] = useState<SellerRefundRow[]>(DEFAULT_REFUNDS)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const handleUpdateStatus = (id: string, status: "approved" | "rejected") => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
  }

  const filtered = refunds.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        r.orderCode.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">Received Refund Requests</h1>
        <p className="text-xs text-gray-500">
          Review, approve, or reject customer return and refund claims for your store items
        </p>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Total Requests</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{refunds.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Pending Review</p>
          <p className="text-xl font-bold text-amber-600 mt-1">
            {refunds.filter((r) => r.status === "pending").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Approved</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            {refunds.filter((r) => r.status === "approved").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Rejected</p>
          <p className="text-xl font-bold text-red-600 mt-1">
            {refunds.filter((r) => r.status === "rejected").length}
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-[#d43533] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search refund claims..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-gray-300 pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
            />
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-[10px] border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Order Code</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-xs text-gray-400">
                    No refund requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-5 py-3.5 font-bold text-[#1967d2]">
                      <Link href={`/seller/orders/${r.orderCode}`} className="hover:underline">
                        {r.orderCode}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900 max-w-xs truncate">
                      {r.productName}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{r.customerName}</td>
                    <td className="px-5 py-3.5 font-bold text-[#d43533]">
                      {formatPrice(r.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 max-w-xs truncate" title={r.reason}>
                      {r.reason}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          r.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : r.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {r.status === "pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(r.id, "approved")}
                            className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                            title="Approve refund"
                          >
                            <Check className="h-3 w-3" />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(r.id, "rejected")}
                            className="inline-flex items-center gap-1 rounded bg-red-50 border border-red-200 px-2 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
                            title="Reject refund"
                          >
                            <X className="h-3 w-3" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px] italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
