"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Search, Eye, Printer } from "lucide-react"

export interface AdminOrderItem {
  id: string
  code: string
  trackingCode: string
  customerName: string
  customerPhone: string
  amount: number
  deliveryStatus: string
  paymentStatus: string
  paymentType: string
  date: string
  shippingAddress: string
}

interface AdminOrdersViewProps {
  initialOrders: AdminOrderItem[]
}

const DELIVERY_STATUSES = ["all", "pending", "confirmed", "picked_up", "on_the_way", "delivered", "cancelled"]

export function AdminOrdersView({ initialOrders }: AdminOrdersViewProps) {
  const [ordersList, setOrdersList] = useState<AdminOrderItem[]>(initialOrders)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderItem | null>(null)

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, deliveryStatus: newStatus } : o))
    )
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, deliveryStatus: newStatus } : null))
    }
  }

  const handlePaymentStatusToggle = (orderId: string) => {
    setOrdersList((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, paymentStatus: o.paymentStatus === "paid" ? "unpaid" : "paid" }
          : o
      )
    )
  }

  const filtered = ordersList.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.deliveryStatus === statusFilter
    const matchesSearch =
      o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">All Orders</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage customer orders, shipments, and invoice statuses</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-xs space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 border-b border-slate-100 text-xs">
          {DELIVERY_STATUSES.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded font-semibold capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? "bg-[#d43533] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-[#d43533]"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing <strong>{filtered.length}</strong> orders
          </span>
        </div>
      </div>

      {/* Orders Table (Active eCommerce 1:1) */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order Code</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800">{order.code}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{order.customerName}</p>
                    <span className="text-[11px] text-slate-400">{order.customerPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">৳{order.amount}</td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handlePaymentStatusToggle(order.id)}
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded uppercase cursor-pointer ${
                        order.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {order.paymentStatus}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={order.deliveryStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-slate-300 rounded px-2 py-1 text-xs bg-white capitalize font-medium text-slate-800 focus:outline-none focus:border-[#d43533]"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="picked_up">Picked Up</option>
                      <option value="on_the_way">On The Way</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-1.5 text-slate-500 hover:text-[#d43533] hover:bg-red-50 rounded inline-flex items-center transition-colors"
                        title="Manage Order"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/invoice/${order.code}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded inline-flex items-center transition-colors"
                        title="Print Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No orders found under this status.
          </div>
        )}
      </div>

      {/* Invoice Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded border shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-sm font-bold text-slate-800">
                Order Details: {selectedOrder.code}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b">
                <span className="font-semibold text-slate-500">Tracking Code:</span>
                <span className="font-bold">{selectedOrder.trackingCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-semibold text-slate-500">Customer Name:</span>
                <span>{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-semibold text-slate-500">Phone:</span>
                <span>{selectedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-semibold text-slate-500">Shipping Address:</span>
                <span className="text-right max-w-xs">{selectedOrder.shippingAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-semibold text-slate-500">Payment Method:</span>
                <span className="uppercase">{selectedOrder.paymentType}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-semibold text-slate-500">Grand Total:</span>
                <span className="font-bold text-sm text-[#d43533]">৳{selectedOrder.amount}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
