"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Clock, ArrowLeft, Search } from "lucide-react"
import type { PreorderOrder } from "@/db/schema"

interface SellerPreorderOrdersViewProps {
  initialOrders: PreorderOrder[]
}

const TABS = [
  { id: "all", label: "All Bookings" },
  { id: "requested", label: "Requested" },
  { id: "accepted_requests", label: "Accepted" },
  { id: "prepayment_requests", label: "Prepayment" },
  { id: "confirmed_prepayments", label: "Confirmed" },
  { id: "final_preorders", label: "Final Orders" },
]

export function SellerPreorderOrdersView({ initialOrders }: SellerPreorderOrdersViewProps) {
  const [orders] = useState<PreorderOrder[]>(initialOrders)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filtered = orders.filter((o) => {
    if (activeTab !== "all" && o.preorderStatus !== activeTab) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      o.orderCode.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.productName.toLowerCase().includes(q)
    )
  })

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      requested: "bg-blue-50 text-blue-700 border-blue-200",
      accepted_requests: "bg-purple-50 text-purple-700 border-purple-200",
      prepayment_requests: "bg-amber-50 text-amber-700 border-amber-200",
      confirmed_prepayments: "bg-emerald-50 text-emerald-700 border-emerald-200",
      final_preorders: "bg-indigo-50 text-indigo-700 border-indigo-200",
    }
    return map[status] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/seller/preorder/products"
          className="p-1.5 rounded border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#d43533]" />
            Customer Pre-Order Bookings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Track customer deposit reservations for vendor items</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-[#d43533] text-white shadow-xs"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="rounded border border-gray-200 bg-white shadow-xs">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code, customer, item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-300 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
            />
          </div>
          <span className="text-xs font-medium text-gray-400">{filtered.length} bookings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 w-10">#</th>
                <th className="py-3 px-4">Booking Code</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Deposit Paid</th>
                <th className="py-3 px-4">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filtered.map((order, idx) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-[#007bff]">{order.orderCode}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900">{order.customerName}</p>
                      <p className="text-[10px] text-gray-400">{order.customerEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{order.productName}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">${order.prepaymentPaid}</td>
                    <td className="py-3 px-4 font-bold text-amber-600">${order.remainingDue}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase ${getStatusBadge(
                          order.preorderStatus
                        )}`}
                      >
                        {order.preorderStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
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
