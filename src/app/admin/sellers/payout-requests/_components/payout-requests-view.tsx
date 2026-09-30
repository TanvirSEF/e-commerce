"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Search, ArrowLeft } from "lucide-react"
import { processWithdrawRequestAction } from "@/app/actions/ecommerce-actions"
import type { SellerWithdrawItem } from "@/services/seller-service"
import { PayoutMetricsCards } from "./payout-metrics-cards"
import { PayoutRequestsTable } from "./payout-requests-table"
import { PayoutProcessModal } from "./payout-process-modal"

interface PayoutRequestsViewProps {
  initialRequests: SellerWithdrawItem[]
}

export function PayoutRequestsView({ initialRequests }: PayoutRequestsViewProps) {
  const [requests, setRequests] = useState<SellerWithdrawItem[]>(initialRequests)
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid" | "rejected">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeModalRequest, setActiveModalRequest] = useState<SellerWithdrawItem | null>(null)
  const [processing, setProcessing] = useState(false)

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const paidRequests = requests.filter((r) => r.status === "paid")
  const totalPending = pendingRequests.reduce((sum, r) => sum + r.amount, 0)
  const totalPaid = paidRequests.reduce((sum, r) => sum + r.amount, 0)

  const handleConfirmProcess = async (
    status: "paid" | "rejected",
    data: { paymentMethod: string; transactionId?: string; adminNote?: string }
  ) => {
    if (!activeModalRequest) return
    setProcessing(true)
    try {
      const numericId = typeof activeModalRequest.id === "number" ? activeModalRequest.id : 1
      await processWithdrawRequestAction({
        requestId: numericId,
        status,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        adminNote: data.adminNote,
      })

      setRequests((prev) =>
        prev.map((r) =>
          r.id === activeModalRequest.id
            ? {
                ...r,
                status,
                paymentMethod: data.paymentMethod,
                transactionId: data.transactionId,
                adminNote: data.adminNote,
              }
            : r
        )
      )
      setActiveModalRequest(null)
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
      <PayoutMetricsCards
        pendingCount={pendingRequests.length}
        totalPending={totalPending}
        paidCount={paidRequests.length}
        totalPaid={totalPaid}
      />

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by shop or seller name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "pending" | "paid" | "rejected")}
            className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 bg-white focus:outline-hidden focus:border-[#d43533]"
          >
            <option value="all">All Request Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="paid">Approved & Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests Data Table */}
      <PayoutRequestsTable
        requests={filtered}
        onProcessRequest={(req) => setActiveModalRequest(req)}
      />

      {/* Process Modal */}
      <PayoutProcessModal
        request={activeModalRequest}
        processing={processing}
        onClose={() => setActiveModalRequest(null)}
        onConfirm={handleConfirmProcess}
      />
    </div>
  )
}
