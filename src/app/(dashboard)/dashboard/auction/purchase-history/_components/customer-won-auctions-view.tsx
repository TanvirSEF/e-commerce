"use client"

import React from "react"
import { Trophy, CheckCircle, Truck, Package } from "lucide-react"
import type { AuctionOrder } from "@/db/schema/auction"

interface CustomerWonAuctionsViewProps {
  orders: AuctionOrder[]
}

export function CustomerWonAuctionsView({ orders }: CustomerWonAuctionsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Won Auctions & Purchase History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review auction lots where you emerged as the highest winning bidder
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Order Code</th>
                <th className="px-4 py-3.5">Won Item</th>
                <th className="px-4 py-3.5">Winning Hammer Price</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5">Delivery</th>
                <th className="px-4 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No won auction orders recorded yet.
                  </td>
                </tr>
              ) : (
                orders.map((o, idx) => (
                  <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">{o.orderCode}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">{o.productName}</td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 text-base">
                      ${o.winningBid}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        <Truck className="w-3 h-3" />
                        {o.deliveryStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {new Date(o.createdAt).toLocaleDateString()}
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
