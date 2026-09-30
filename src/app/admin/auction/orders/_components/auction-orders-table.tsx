"use client"

import React from "react"
import { Eye, Trash2, CheckCircle2, Clock, Truck } from "lucide-react"
import type { AuctionOrder } from "@/db/schema/auction"

interface AuctionOrdersTableProps {
  orders: AuctionOrder[]
  onViewOrder: (order: AuctionOrder) => void
  onDeleteOrder: (id: number) => void
}

export function AuctionOrdersTable({
  orders,
  onViewOrder,
  onDeleteOrder,
}: AuctionOrdersTableProps) {
  const renderPaymentBadge = (status: string) => {
    if (status === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          Paid
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3" />
        Unpaid
      </span>
    )
  }

  const renderDeliveryBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
            Delivered
          </span>
        )
      case "on_delivery":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-cyan-50 text-cyan-700">
            <Truck className="w-3 h-3" />
            On Delivery
          </span>
        )
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700">
            Confirmed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">
            Pending
          </span>
        )
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-gray-600">
        <thead className="bg-[#f8f9fb] text-gray-700 font-semibold border-b border-gray-200">
          <tr>
            <th className="py-3 px-3 w-10">#</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Order Code</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Auction Item</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Winning Bidder</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Hammer Price</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Payment</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Fulfillment</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Date</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold text-right">Options</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((item, idx) => (
            <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
              <td className="py-3 px-3 text-gray-400 font-medium">{idx + 1}</td>
              <td className="py-3 px-3 font-mono font-bold text-gray-900">{item.orderCode}</td>
              <td className="py-3 px-3 font-medium text-gray-800 max-w-[220px] truncate" title={item.productName}>
                {item.productName}
              </td>
              <td className="py-3 px-3">
                <p className="font-semibold text-gray-900">{item.customerName}</p>
                <p className="text-[11px] text-gray-400">{item.customerEmail}</p>
              </td>
              <td className="py-3 px-3 font-bold text-[#d43533] text-sm whitespace-nowrap">
                ${item.winningBid}
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                {renderPaymentBadge(item.paymentStatus)}
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                {renderDeliveryBadge(item.deliveryStatus)}
              </td>
              <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-3 text-right whitespace-nowrap">
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    title="View Details"
                    onClick={() => onViewOrder(item)}
                    className="p-1.5 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Delete Order"
                    onClick={() => onDeleteOrder(item.id)}
                    className="p-1.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {orders.length === 0 && (
            <tr>
              <td colSpan={9} className="py-12 text-center text-xs text-gray-400">
                No auction orders recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
