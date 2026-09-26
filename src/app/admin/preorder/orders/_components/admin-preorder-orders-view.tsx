"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { Clock, ArrowLeft, Search, CheckCircle2, AlertCircle } from "lucide-react"
import { updatePreorderOrderStatusAction } from "@/app/actions/ecommerce-actions"
import type { PreorderOrder } from "@/db/schema"

interface AdminPreorderOrdersViewProps {
  initialOrders: PreorderOrder[]
}

const TABS = [
  { id: "all", label: "All Bookings" },
  { id: "deposit_paid", label: "Deposit Paid" },
  { id: "final_payment_pending", label: "Final Payment Pending" },
  { id: "ready_to_ship", label: "Ready to Ship" },
  { id: "dispatched", label: "Dispatched" },
]

export function AdminPreorderOrdersView({ initialOrders }: AdminPreorderOrdersViewProps) {
  const [orders, setOrders] = useState<PreorderOrder[]>(initialOrders)
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (id: number, status: string) => {
    startTransition(async () => {
      const ok = await updatePreorderOrderStatusAction(id, status)
      if (ok) {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, preorderStatus: status } : o)))
        setFeedback({ type: "success", text: "Pre-order reservation status updated" })
      } else {
        setFeedback({ type: "error", text: "Failed to update status" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const filtered = orders.filter((o) => {
    const matchTab = activeTab === "all" || o.preorderStatus === activeTab
    const matchSearch =
      o.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.productName.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/preorder/products"
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#d43533]" />
            Pre-Order Reservations Ledger
          </h1>
          <p className="text-xs text-gray-500">Track advance customer deposits, remaining balances, and dispatch schedules</p>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[#d43533] text-[#d43533]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter by order code, customer, product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#d43533] focus:outline-hidden"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Order Code</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Deposit Paid</th>
                <th className="py-3 px-4">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order, idx) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-mono font-bold text-gray-900">{order.orderCode}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900 block">{order.customerName}</span>
                    <span className="text-[11px] text-gray-400">{order.customerEmail}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{order.productName}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">${order.totalPrice}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-700">${order.prepaymentPaid}</td>
                  <td className="py-3 px-4 font-semibold text-amber-700">${order.remainingDue}</td>
                  <td className="py-3 px-4 text-center">
                    <select
                      value={order.preorderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={isPending}
                      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-700 focus:border-[#d43533] focus:outline-hidden"
                    >
                      <option value="deposit_paid">Deposit Paid</option>
                      <option value="final_payment_pending">Final Payment Pending</option>
                      <option value="ready_to_ship">Ready to Ship</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-gray-400">
                    No pre-order reservations match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
