"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Search,
  MoreVertical,
  Eye,
  Download,
  Printer,
  FileSpreadsheet,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { SellerOrderRow } from "@/services/order-service"

interface SellerOrdersViewProps {
  initialOrders: SellerOrderRow[]
  shopName: string
}

export function SellerOrdersView({ initialOrders, shopName }: SellerOrdersViewProps) {
  const [orders, setOrders] = useState<SellerOrderRow[]>(initialOrders)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const exportCSV = () => {
    const rowsToExport = selectedIds.length > 0
      ? orders.filter((o) => selectedIds.includes(o.id))
      : filteredOrders

    const headers = ["Order Code", "Date", "Customer", "Items", "Amount", "Delivery Status", "Payment Status", "Payment Method"]
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(",")]
        .concat(
          rowsToExport.map((o) =>
            [
              `"${o.code}"`,
              `"${o.date}"`,
              `"${o.customerName}"`,
              o.itemCount,
              o.total,
              `"${o.deliveryStatus}"`,
              `"${o.paymentStatus}"`,
              `"${o.paymentType}"`,
            ].join(",")
          )
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `seller_orders_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredOrders = orders.filter((o) => {
    if (deliveryStatusFilter !== "all" && o.deliveryStatus !== deliveryStatusFilter) return false
    if (paymentStatusFilter !== "all" && o.paymentStatus !== paymentStatusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return o.code.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="space-y-4">
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-800">All Orders</h1>
      </div>

      {/* Filter Card */}
      <div className="rounded border border-gray-200 bg-white shadow-xs">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-300 text-xs text-gray-800 focus:outline-none focus:border-[#d43533]"
            />
          </div>

          {/* Actions & Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Export
            </button>

            <select
              value={deliveryStatusFilter}
              onChange={(e) => setDeliveryStatusFilter(e.target.value)}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#d43533]"
            >
              <option value="all">Filter by delivery status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="picked_up">Picked Up</option>
              <option value="on_the_way">On The Way</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#d43533]"
            >
              <option value="all">Filter by payment status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={filteredOrders.length > 0 && selectedIds.length === filteredOrders.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
                  />
                </th>
                <th className="py-3 px-3">Order Code</th>
                <th className="py-3 px-3">Num. of Products</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Delivery Status</th>
                <th className="py-3 px-3">Payment Method</th>
                <th className="py-3 px-3">Payment Status</th>
                <th className="py-3 px-3 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isPaid = order.paymentStatus === "paid"
                  const isDelivered = order.deliveryStatus === "delivered"
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(order.id)}
                          onChange={() => toggleSelect(order.id)}
                          className="rounded border-gray-300 text-[#d43533] focus:ring-[#d43533]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/seller/orders/${order.id}`}
                            className="font-bold text-[#007bff] hover:underline"
                          >
                            {order.code}
                          </Link>
                          {!order.viewed && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-700">{order.itemCount}</td>
                      <td className="py-3 px-3">
                        <p className="font-medium text-gray-800">{order.customerName}</p>
                        <p className="text-[10px] text-gray-400">{order.customerEmail}</p>
                      </td>
                      <td className="py-3 px-3">
                        <div className="border-l-2 border-[#007bff] pl-2">
                          <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-semibold capitalize ${
                            isDelivered ? "text-emerald-600" : "text-gray-700"
                          }`}
                        >
                          {order.deliveryStatus.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3 px-3 capitalize text-gray-600">{order.paymentType}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenDropdownId(openDropdownId === order.id ? null : order.id)
                            }
                            className="w-7 h-7 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                          {openDropdownId === order.id && (
                            <div className="absolute right-0 mt-1 w-36 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 z-20 text-xs">
                              <Link
                                href={`/seller/orders/${order.id}`}
                                className="px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-500" />
                                View Order
                              </Link>
                              <Link
                                href={`/invoice/${order.code}`}
                                target="_blank"
                                className="px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                              >
                                <Download className="w-3.5 h-3.5 text-emerald-500" />
                                Download
                              </Link>
                              <Link
                                href={`/invoice-print/${order.code}`}
                                target="_blank"
                                className="px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                              >
                                <Printer className="w-3.5 h-3.5 text-purple-500" />
                                Print
                              </Link>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
