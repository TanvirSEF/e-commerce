"use client"

import React from "react"
import { Eye, Download, Trash2 } from "lucide-react"
import type { PreorderOrder } from "@/db/schema"

interface PreorderOrdersTableProps {
  orders: PreorderOrder[]
  selectedIds: number[]
  onToggleSelectAll: () => void
  onToggleSelectOne: (id: number) => void
  onViewOrder: (order: PreorderOrder) => void
  onDeleteOrder: (id: number) => void
}

export function PreorderOrdersTable({
  orders,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onViewOrder,
  onDeleteOrder,
}: PreorderOrdersTableProps) {
  const isAllSelected = orders.length > 0 && selectedIds.length === orders.length

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "requested":
        return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">Preorder Requested</span>
      case "accepted_requests":
        return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-sky-100 text-sky-800">Preorder Request Accepted</span>
      case "prepayment_requests":
        return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-indigo-100 text-indigo-800">Prepayment Requested</span>
      case "confirmed_prepayments":
        return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">Prepayment Accepted</span>
      case "final_preorders":
        return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">Final Order Requested</span>
      case "in_shipping":
        return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-cyan-100 text-cyan-800">In Shipping</span>
      case "delivered":
        return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">Delivered</span>
      case "refund":
        return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-teal-100 text-teal-800">Refunded</span>
      default:
        return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-semibold bg-gray-100 text-gray-600">{status}</span>
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-gray-600">
        <thead className="bg-[#f8f9fb] text-gray-700 font-semibold border-b border-gray-200">
          <tr>
            <th className="py-3 px-3 w-10">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onToggleSelectAll}
                className="w-3.5 h-3.5 text-[#d43533] rounded focus:ring-0"
              />
            </th>
            <th className="py-3 px-3">Product/Quantity</th>
            <th className="py-3 px-3">Preorder Code/Created</th>
            <th className="py-3 px-3">Price/Prepayment</th>
            <th className="py-3 px-3">Seller</th>
            <th className="py-3 px-3">Customer</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3">Refund</th>
            <th className="py-3 px-3 text-right">Options</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => {
            const isChecked = selectedIds.includes(order.id)
            return (
              <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="py-3 px-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleSelectOne(order.id)}
                    className="w-3.5 h-3.5 text-[#d43533] rounded focus:ring-0"
                  />
                </td>

                {/* Product / Quantity */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={order.productThumbnail || "/assets/img/placeholder.jpg"}
                      alt={order.productName}
                      className="w-10 h-10 rounded object-cover border border-gray-200 shrink-0"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/assets/img/placeholder.jpg"
                      }}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate max-w-[200px]" title={order.productName}>
                        {order.productName}
                      </p>
                      <p className="text-[11px] text-gray-400">QTY : {order.quantity}</p>
                    </div>
                  </div>
                </td>

                {/* Preorder Code / Created */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-gray-900">{order.orderCode}</span>
                    {!order.isViewed && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#d43533] text-white">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Created : {new Date(order.createdAt).toISOString().split("T")[0]}
                  </p>
                </td>

                {/* Price / Prepayment */}
                <td className="py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">
                  ৳{order.totalPrice} / <span className="text-emerald-600">৳{order.prepaymentPaid}</span>
                </td>

                {/* Seller */}
                <td className="py-3 px-3 font-medium text-gray-800">
                  {order.sellerName || "Inhouse"}
                </td>

                {/* Customer */}
                <td className="py-3 px-3">
                  <p className="font-semibold text-gray-900">{order.customerName}</p>
                  <p className="text-[11px] text-gray-400">{order.customerEmail}</p>
                </td>

                {/* Status */}
                <td className="py-3 px-3 whitespace-nowrap">
                  {renderStatusBadge(order.preorderStatus)}
                </td>

                {/* Refund */}
                <td className="py-3 px-3 whitespace-nowrap">
                  {order.isRefundable ? (
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Refundable
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-600">
                      No Refund
                    </span>
                  )}
                </td>

                {/* Options */}
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      title="View Details"
                      onClick={() => onViewOrder(order)}
                      className="p-1.5 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Download Invoice"
                      onClick={() => alert(`Downloading Invoice for ${order.orderCode}`)}
                      className="p-1.5 rounded-full text-cyan-600 bg-cyan-50 hover:bg-cyan-100 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Delete Order"
                      onClick={() => onDeleteOrder(order.id)}
                      className="p-1.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}

          {orders.length === 0 && (
            <tr>
              <td colSpan={9} className="py-10 text-center text-xs text-gray-400">
                No pre-orders found for the selected filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
