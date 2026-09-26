"use client"

import React, { useState } from "react"
import { Search, Trophy, CheckCircle, Truck } from "lucide-react"
import type { AuctionOrder } from "@/db/schema/auction"

interface SellerAuctionOrdersViewProps {
  orders: AuctionOrder[]
}

export function SellerAuctionOrdersView({ orders: initialOrders }: SellerAuctionOrdersViewProps) {
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Trophy className="w-7 h-7 text-amber-500" />
          Auction Winning Orders
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Winning bidders and completed sales ready for dispatch
        </p>
      </div>

      <div className="bg-[#1e293b] rounded-xl shadow-sm border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search order code or buyer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-400">
            Orders: <span className="text-white font-semibold">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f172a] text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Order Code</th>
                <th className="px-4 py-3.5">Auction Item</th>
                <th className="px-4 py-3.5">Buyer</th>
                <th className="px-4 py-3.5">Hammer Price</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    No auction orders recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3.5 font-bold text-white">{item.orderCode}</td>
                    <td className="px-4 py-3.5 text-slate-200 font-medium">{item.productName}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-white">{item.customerName}</div>
                      <div className="text-xs text-slate-400">{item.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-400 text-base">
                      ${item.winningBid}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" />
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                        <Truck className="w-3 h-3" />
                        {item.deliveryStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">
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
