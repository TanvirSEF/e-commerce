"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { MoreVertical, Settings, Eye, Download, Printer, Tag, Trash2, Plus, Minus } from "lucide-react"
import { AdminOrderListItem } from "@/services/admin-orders-service"

interface OrdersTableProps {
  orders: AdminOrderListItem[]
  selectedIds: number[]
  onToggleSelect: (id: number) => void
  onToggleSelectAll: () => void
  onQuickManage: (order: AdminOrderListItem) => void
  onDeleteSingle: (order: AdminOrderListItem) => void
}

export function OrdersTable({
  orders,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onQuickManage,
  onDeleteSingle,
}: OrdersTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null)
  const [expandedRowIds, setExpandedRowIds] = useState<number[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleRowExpand = (id: number) => {
    setExpandedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const allSelected = orders.length > 0 && orders.every((o) => selectedIds.includes(o.id))

  return (
    <div className="overflow-x-auto relative min-h-[300px]" ref={dropdownRef}>
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-[#f8f9fb] text-slate-500 font-bold uppercase text-[11px] border-b border-slate-200">
          <tr>
            <th className="py-3 px-3 w-10 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="rounded border-slate-300 text-[#d43533] focus:ring-0 cursor-pointer h-3.5 w-3.5"
              />
            </th>
            <th className="py-3 px-3 font-bold text-slate-600">Order Code</th>
            <th className="py-3 px-3 font-bold text-slate-600">Num. of Products</th>
            <th className="py-3 px-3 font-bold text-slate-600">Customer</th>
            <th className="py-3 px-3 font-bold text-slate-600">Seller</th>
            <th className="py-3 px-3 font-bold text-slate-600">Amount</th>
            <th className="py-3 px-3 font-bold text-slate-600">Delivery Status</th>
            <th className="py-3 px-3 font-bold text-slate-600">Payment method</th>
            <th className="py-3 px-3 font-bold text-slate-600">Payment Status</th>
            <th className="py-3 px-3 font-bold text-slate-600">Refund</th>
            <th className="py-3 px-3 font-bold text-slate-600 text-right">Options</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {orders.map((order) => {
            const isSelected = selectedIds.includes(order.id)
            const isDelivered = order.deliveryStatus.toLowerCase() === "delivered"
            const isPaid = order.paymentStatus.toLowerCase() === "paid"
            const isExpanded = expandedRowIds.includes(order.id)
            const isMenuOpen = activeDropdownId === order.id

            return (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-slate-50/80 transition-colors group">
                  {/* Select + Expand Column */}
                  <td className="py-3 px-3 text-center align-middle">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleRowExpand(order.id)}
                        className="w-4 h-4 bg-[#1492e6] hover:bg-blue-600 text-white rounded-xs flex items-center justify-center text-[10px] font-bold md:hidden"
                      >
                        {isExpanded ? <Minus className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                      </button>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(order.id)}
                        className="rounded border-slate-300 text-[#d43533] focus:ring-0 cursor-pointer h-3.5 w-3.5"
                      />
                    </div>
                  </td>

                  {/* Order Code */}
                  <td className="py-3 px-3 align-middle">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-bold text-[#1492e6] hover:underline"
                        >
                          {order.code}
                        </Link>
                        {!order.viewed && (
                          <span className="bg-[#17a2b8] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-xs">
                            New
                          </span>
                        )}
                      </div>
                      {order.courierTrackingCode && (
                        <p className="text-[10px] text-slate-500 font-medium">
                          Tracking: {order.courierTrackingCode}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Num. of Products */}
                  <td className="py-3 px-3 align-middle font-semibold text-slate-700">
                    {order.productCount}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-3 align-middle text-slate-700 font-medium">
                    {order.customerName}
                  </td>

                  {/* Seller */}
                  <td className="py-3 px-3 align-middle font-bold text-slate-800">
                    {order.sellerName}
                  </td>

                  {/* Amount with Blue Border */}
                  <td className="py-3 px-3 align-middle">
                    <div className="border-l-[3px] border-[#1492e6] pl-2 py-0">
                      <p className="text-[13px] font-bold text-slate-900 leading-tight">
                        ৳{order.grandTotal.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </td>

                  {/* Delivery Status */}
                  <td className="py-3 px-3 align-middle font-bold capitalize">
                    <span className={isDelivered ? "text-emerald-600" : "text-slate-800"}>
                      {order.deliveryStatus.replace(/_/g, " ")}
                    </span>
                  </td>

                  {/* Payment Method */}
                  <td className="py-3 px-3 align-middle capitalize text-slate-700 font-medium">
                    {order.paymentType.replace(/_/g, " ")}
                  </td>

                  {/* Payment Status Badge */}
                  <td className="py-3 px-3 align-middle">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        isPaid
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  {/* Refund */}
                  <td className="py-3 px-3 align-middle text-slate-500">
                    {order.hasRefund ? "1 Refund" : "No Refund"}
                  </td>

                  {/* Options 3-dots */}
                  <td className="py-3 px-3 text-right align-middle relative">
                    <button
                      type="button"
                      onClick={() => setActiveDropdownId(isMenuOpen ? null : order.id)}
                      className="w-7 h-7 inline-flex items-center justify-center rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-3 top-10 w-52 bg-white border border-slate-200 rounded shadow-xl py-1 z-40 text-left text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDropdownId(null)
                            onQuickManage(order)
                          }}
                          className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-400" />
                          <span>Quick Order Management</span>
                        </button>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>View Order</span>
                        </Link>
                        <Link
                          href={`/invoice/${order.code}?print=1`}
                          target="_blank"
                          className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          <span>Download Invoice</span>
                        </Link>
                        <Link
                          href={`/invoice/${order.code}?print=1`}
                          target="_blank"
                          className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-400" />
                          <span>Print Invoice</span>
                        </Link>
                        <Link
                          href={`/shipping-label/${order.code}?print=1`}
                          target="_blank"
                          className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <Tag className="w-3.5 h-3.5 text-slate-400" />
                          <span>Download Shipping Label</span>
                        </Link>
                        <Link
                          href={`/shipping-label/${order.code}?print=1`}
                          target="_blank"
                          className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-400" />
                          <span>Print Shipping Label</span>
                        </Link>
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDropdownId(null)
                            onDeleteSingle(order)
                          }}
                          className="w-full px-3.5 py-2 flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>

                {/* Mobile Expanded Drawer View */}
                {isExpanded && (
                  <tr className="bg-slate-50 md:hidden">
                    <td colSpan={11} className="p-3 space-y-2 border-b border-slate-200 text-xs">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-500">Date:</span>
                        <span className="text-slate-800">{order.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-500">Tracking Code:</span>
                        <span className="text-slate-800">{order.trackingCode || "N/A"}</span>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="py-16 text-center text-slate-500 space-y-2">
          <p className="text-sm font-semibold text-slate-600">No Orders found!</p>
          <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
        </div>
      )}
    </div>
  )
}
