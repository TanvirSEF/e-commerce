"use client"

import React, { useState } from "react"
import { Search, Trophy, CheckCircle, Clock, Truck } from "lucide-react"
import type { AuctionOrder } from "@/db/schema/auction"

interface AdminAuctionOrdersViewProps {
  orders: AuctionOrder[]
}

export function AdminAuctionOrdersView({ orders: initialOrders }: AdminAuctionOrdersViewProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState("")

  const filtered = orders.filter(
    (o) =>
      o.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.productName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-500" />
            Auction Sales & Winning Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fulfilled purchase orders generated from won auction events
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, customer, or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Won Sales: <span className="text-slate-900 font-bold">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Order Code</th>
                <th className="px-4 py-3.5">Auction Item</th>
                <th className="px-4 py-3.5">Winning Bidder</th>
                <th className="px-4 py-3.5">Hammer Price</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5">Fulfillment</th>
                <th className="px-4 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    No auction orders recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400 font-medium">{idx + 1}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">{item.orderCode}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">{item.productName}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{item.customerName}</div>
                      <div className="text-xs text-slate-400">{item.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 text-base">
                      ${item.winningBid}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        <Truck className="w-3 h-3" />
                        {item.deliveryStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
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
