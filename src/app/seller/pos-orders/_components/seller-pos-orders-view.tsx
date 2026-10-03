"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ShoppingBag,
  Search,
  Printer,
  Plus,
  Eye,
  DollarSign,
  TrendingUp,
  Receipt,
} from "lucide-react"
import type { PosSale } from "@/db/schema"
import { PosOrderDetailsModal } from "./pos-order-details-modal"

interface SellerPosOrdersViewProps {
  initialSales: PosSale[]
}

export function SellerPosOrdersView({ initialSales }: SellerPosOrdersViewProps) {
  const [sales] = useState<PosSale[]>(initialSales)
  const [search, setSearch] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<string>("all")
  const [inspectSale, setInspectSale] = useState<PosSale | null>(null)

  const filtered = sales.filter((s) => {
    const matchSearch =
      !search ||
      s.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (s.customerPhone && s.customerPhone.includes(search))

    const matchPayment =
      selectedPayment === "all" ||
      s.paymentMethod.toLowerCase() === selectedPayment.toLowerCase()

    return matchSearch && matchPayment
  })

  // Calculations
  const totalSalesCount = sales.length
  const totalRevenue = sales.reduce((acc, s) => acc + (parseFloat(s.total || "0") || 0), 0)
  const avgOrder = totalSalesCount > 0 ? Math.round(totalRevenue / totalSalesCount) : 0

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-[#d43533]" />
            Vendor POS Orders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Log of walk-in counter retail sales executed through your store terminal
          </p>
        </div>
        <Link
          href="/seller/pos"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#b02a28] transition"
        >
          <Plus className="w-4 h-4" />
          Open POS Register
        </Link>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center text-[#d43533]">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-gray-500 uppercase">POS Sales Count</div>
            <div className="text-lg font-bold font-mono text-gray-900">{totalSalesCount}</div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-gray-500 uppercase">Total Revenue</div>
            <div className="text-lg font-bold font-mono text-gray-900">
              ৳{totalRevenue.toLocaleString("en-BD")}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-gray-500 uppercase">Avg Order Value</div>
            <div className="text-lg font-bold font-mono text-gray-900">
              ৳{avgOrder.toLocaleString("en-BD")}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs">
        {/* Filter Bar */}
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">
            POS Transactions ({filtered.length})
          </h2>

          <div className="flex items-center gap-2">
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 focus:border-[#d43533] focus:outline-hidden"
              aria-label="Filter by payment method"
            >
              <option value="all">All Payment Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bkash">bKash</option>
              <option value="offline">Offline</option>
            </select>

            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search code, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#d43533]"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Order Code</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No POS orders found. Open the POS register to record a sale.
                  </td>
                </tr>
              ) : (
                filtered.map((sale) => {
                  const isWalkIn =
                    !sale.customerName ||
                    sale.customerName.toLowerCase().includes("walk-in")
                  const items = sale.itemsJson || []

                  return (
                    <tr key={sale.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setInspectSale(sale)}
                            className="font-mono font-bold text-blue-600 hover:underline"
                          >
                            {sale.orderCode}
                          </button>
                          <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                            POS
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-gray-500">
                        {new Date(sale.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{sale.customerName}</div>
                        <div className="text-[10px] text-gray-400">
                          {isWalkIn ? "Walk-in Counter" : sale.customerPhone || "Registered"}
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono font-semibold">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-block bg-gray-100 text-gray-800 text-[10px] font-medium px-2 py-0.5 rounded">
                          {sale.paymentMethod}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-bold font-mono text-[#d43533]">
                        ৳{parseFloat(sale.total || "0").toLocaleString("en-BD")}
                      </td>

                      <td className="px-4 py-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Paid
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setInspectSale(sale)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            title="View Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/pos/receipt/${sale.orderCode}`}
                            target="_blank"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition"
                            title="Print Thermal Receipt"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Link>
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

      {/* Inspect Modal */}
      {inspectSale && (
        <PosOrderDetailsModal
          sale={inspectSale}
          onClose={() => setInspectSale(null)}
        />
      )}
    </div>
  )
}
