"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Clock, ArrowLeft, Search } from "lucide-react"
import type { PreorderOrder } from "@/db/schema"

interface SellerPreorderOrdersViewProps {
  initialOrders: PreorderOrder[]
}

export function SellerPreorderOrdersView({ initialOrders }: SellerPreorderOrdersViewProps) {
  const [orders] = useState<PreorderOrder[]>(initialOrders)
  const [search, setSearch] = useState("")

  const filtered = orders.filter(
    (o) =>
      o.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.productName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/seller/preorder/products"
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#d43533]" />
            Customer Pre-Order Bookings
          </h1>
          <p className="text-xs text-gray-500">Track customer deposit reservations for vendor items</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter by booking code, customer, product..."
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
              {filtered.map((order, idx) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-mono font-bold text-gray-900">{order.orderCode}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{order.customerName}</td>
                  <td className="py-3 px-4 text-gray-800">{order.productName}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-700">${order.prepaymentPaid}</td>
                  <td className="py-3 px-4 font-semibold text-amber-700">${order.remainingDue}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize bg-sky-100 text-sky-800">
                      {order.preorderStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
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
