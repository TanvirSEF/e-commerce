"use client"

import React, { useState } from "react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Download, ExternalLink, Package, Search, RotateCcw } from "lucide-react"

const ALL_ORDERS = [
  {
    code: "20260923-847291",
    date: "23 Sep 2026",
    amount: 4760,
    deliveryStatus: "on_the_way",
    paymentStatus: "paid",
    paymentType: "Cash on Delivery",
    itemsCount: 2,
  },
  {
    code: "20260918-192842",
    date: "18 Sep 2026",
    amount: 1250,
    deliveryStatus: "delivered",
    paymentStatus: "paid",
    paymentType: "bKash",
    itemsCount: 1,
  },
  {
    code: "20260830-671203",
    date: "30 Aug 2026",
    amount: 2440,
    deliveryStatus: "delivered",
    paymentStatus: "paid",
    paymentType: "Nagad",
    itemsCount: 1,
  },
  {
    code: "20260812-451928",
    date: "12 Aug 2026",
    amount: 5120,
    deliveryStatus: "delivered",
    paymentStatus: "paid",
    paymentType: "Cards (Stripe)",
    itemsCount: 3,
  },
]

interface PurchaseHistoryViewProps {
  initialOrders?: any[]
}

export function PurchaseHistoryView({ initialOrders }: PurchaseHistoryViewProps) {
  const [filter, setFilter] = useState("")

  const ordersList = initialOrders && initialOrders.length > 0 ? initialOrders : ALL_ORDERS

  const filteredOrders = ordersList.filter((o) =>
    (o.code || "").toLowerCase().includes(filter.toLowerCase()) ||
    (o.deliveryStatus || "").toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="rounded border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-gray-100">
        <div>
          <h1 className="text-base font-bold text-gray-900">Purchase History</h1>
          <p className="text-xs text-gray-500">Track and review all previous purchases</p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by order code..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded border border-gray-300 pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
          />
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50/70 text-gray-700 font-bold uppercase text-[10px] border-b border-gray-100">
            <tr>
              <th className="px-5 py-3">#</th>
              <th className="px-5 py-3">Code</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Delivery Status</th>
              <th className="px-5 py-3">Payment Status</th>
              <th className="px-5 py-3 text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-xs text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, idx) => (
                <tr key={order.code} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5 text-gray-400 font-medium">{idx + 1}</td>
                  <td className="px-5 py-3.5 font-bold text-[#d43533]">
                    <Link href={`/order-confirmed/${order.code}`} className="hover:underline">
                      {order.code}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{order.date}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900">{formatPrice(order.amount)}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        order.deliveryStatus === "delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.deliveryStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="rounded p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                        title="Print invoice"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/track-order?code=${order.code}`}
                        className="rounded p-1 text-gray-400 hover:text-[#1967d2] hover:bg-blue-50"
                        title="Track order"
                      >
                        <Package className="h-4 w-4" />
                      </Link>
                      {order.deliveryStatus === "delivered" && (
                        <Link
                          href={`/dashboard/refund-requests`}
                          className="rounded p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                          title="Request Refund / Return"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        href={`/order-confirmed/${order.code}`}
                        className="rounded p-1 text-gray-400 hover:text-[#d43533] hover:bg-red-50"
                        title="View details"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
