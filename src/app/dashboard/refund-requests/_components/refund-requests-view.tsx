"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, Search, X, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { RefundRequestItem } from "@/services/refund-service"

interface RefundRequestsViewProps {
  initialRefunds: RefundRequestItem[]
}

type TabType = "all" | "pending" | "approved" | "rejected"

export function RefundRequestsView({ initialRefunds }: RefundRequestsViewProps) {
  const [refunds] = useState<RefundRequestItem[]>(initialRefunds)
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [search, setSearch] = useState("")
  const [selectedRefund, setSelectedRefund] = useState<RefundRequestItem | null>(null)

  const pendingCount = refunds.filter((r) => r.status === "pending").length
  const approvedCount = refunds.filter((r) => r.status === "approved").length
  const rejectedCount = refunds.filter((r) => r.status === "rejected").length

  const filtered = refunds.filter((r) => {
    if (activeTab !== "all" && r.status !== activeTab) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      r.orderCode.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce CMS Titlebar */}
      <div className="mb-2">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">Applied Refund Request</h1>
      </div>

      {/* Main Card */}
      <div className="rounded border border-gray-200 bg-white shadow-2xs overflow-hidden">
        {/* Card Header with Tabs & Search */}
        <div className="border-b border-gray-200 p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-[#d43533] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({refunds.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === "pending"
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("approved")}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === "approved"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rejected")}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === "rejected"
                  ? "bg-rose-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <input
              type="text"
              placeholder="Search by order or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-200 rounded focus:border-[#d43533] focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Content Body */}
        {filtered.length === 0 ? (
          /* Empty State Matching Active eCommerce 1:1 */
          <div className="p-12 text-center">
            <div className="relative mx-auto w-40 h-32 mb-4">
              <Image
                src="/assets/img/nothing.svg"
                alt="No refund requests"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h3 className="text-base font-bold text-gray-800">There isn&apos;t anything added yet</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
              You haven&apos;t submitted any refund or return requests yet.
            </p>
          </div>
        ) : (
          /* Table Matching Active eCommerce CMS 1:1 */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50/60 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Order Code</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-gray-400">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Link
                        href={`/dashboard/purchase-history/${item.orderCode}`}
                        className="font-mono font-semibold text-[#3490f3] hover:underline"
                      >
                        {item.orderCode}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-gray-900 line-clamp-1 max-w-xs" title={item.productName}>
                        {item.productName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">
                      {formatPrice(item.amount)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.status === "approved" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {item.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                      {item.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedRefund(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#3490f3] hover:bg-[#3490f3] hover:text-white transition-colors shadow-2xs"
                        title="View Refund Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 1:1 Active eCommerce Refund Details Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded bg-white shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900">Refund Request Details</h3>
              <button
                type="button"
                onClick={() => setSelectedRefund(null)}
                className="rounded p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-3.5 text-xs text-gray-700">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Order Code:</span>
                <span className="font-mono font-bold text-gray-900">{selectedRefund.orderCode}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Product:</span>
                <span className="font-semibold text-gray-900 text-right max-w-xs">{selectedRefund.productName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Refund Amount:</span>
                <span className="font-bold text-[#d43533]">{formatPrice(selectedRefund.amount)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Status:</span>
                <span className="font-bold capitalize">{selectedRefund.status}</span>
              </div>
              <div className="space-y-1 border-b border-gray-100 pb-2">
                <span className="text-gray-500 block">Reason for Refund:</span>
                <p className="font-medium text-gray-800 bg-gray-50 p-2.5 rounded border border-gray-200">
                  {selectedRefund.reason}
                </p>
              </div>
              {selectedRefund.details && (
                <div className="space-y-1 border-b border-gray-100 pb-2">
                  <span className="text-gray-500 block">Customer Note / Details:</span>
                  <p className="text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-200">
                    {selectedRefund.details}
                  </p>
                </div>
              )}
              {selectedRefund.adminNote && (
                <div className="space-y-1">
                  <span className="text-gray-500 block">Admin / Seller Resolution:</span>
                  <p className="text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200 font-medium">
                    {selectedRefund.adminNote}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setSelectedRefund(null)}
                className="rounded border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
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
