"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  CreditCard,
  Search,
  Check,
  X,
  ExternalLink,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { updateOrderStatusAction } from "@/app/actions/ecommerce-actions"
import type { OfflinePaymentOrderRow } from "@/services/order-service"

interface OfflinePaymentsAdminViewProps {
  initialOrders: OfflinePaymentOrderRow[]
}

export function OfflinePaymentsAdminView({
  initialOrders,
}: OfflinePaymentsAdminViewProps) {
  const [orders, setOrders] = useState<OfflinePaymentOrderRow[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] =
    useState<OfflinePaymentOrderRow | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async (order: OfflinePaymentOrderRow) => {
    setIsProcessing(true)
    try {
      await updateOrderStatusAction({
        orderId: order.id,
        paymentStatus: "paid",
        deliveryStatus: "confirmed",
      })
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, paymentStatus: "paid" } : o
        )
      )
      setSelectedOrder(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const filtered = orders.filter(
    (o) =>
      o.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.trxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.senderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingCount = orders.filter((o) => o.paymentStatus === "unpaid").length
  const approvedCount = orders.filter((o) => o.paymentStatus === "paid").length

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Offline & Manual Payment Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit customer bank deposits, bKash/Nagad TrxIDs, and approve payments
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Pending Verification</div>
            <div className="text-xl font-bold text-slate-800">{pendingCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Approved Offline Payments</div>
            <div className="text-xl font-bold text-slate-800">{approvedCount}</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order code, TrxID, sender number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Order Code</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">TrxID / Ref</th>
                <th className="py-3 px-4">Sender Details</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 font-medium">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/admin/orders/${item.id}`}
                      className="font-mono font-bold text-[#d43533] hover:underline"
                    >
                      {item.code}
                    </Link>
                    <div className="text-[10px] text-slate-400">{item.date}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {item.customerName}
                    <div className="text-[11px] text-slate-500">{item.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {item.method}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 bg-slate-50 px-2 rounded">
                    {item.trxId}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {item.senderNumber}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    {formatPrice(item.amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                        item.paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.paymentStatus === "unpaid" ? (
                      <button
                        onClick={() => handleApprove(item)}
                        disabled={isProcessing}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        Approve
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
