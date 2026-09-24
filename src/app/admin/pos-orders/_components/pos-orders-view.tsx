"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ShoppingBag,
  Search,
  Printer,
  Calendar,
  ExternalLink,
  Eye,
  Plus,
} from "lucide-react"
import type { PosSale } from "@/db/schema"

interface PosOrdersViewProps {
  initialSales: PosSale[]
}

export function PosOrdersView({ initialSales }: PosOrdersViewProps) {
  const [sales] = useState<PosSale[]>(initialSales)
  const [search, setSearch] = useState("")
  const [selectedSale, setSelectedSale] = useState<PosSale | null>(null)

  const filtered = sales.filter((s) =>
    s.orderCode.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName.toLowerCase().includes(search.toLowerCase()) ||
    (s.customerPhone && s.customerPhone.includes(search))
  )

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-[#d43533]" />
            In-Store POS Orders Ledger
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit history of walk-in sales and in-store cash register transactions
          </p>
        </div>
        <Link
          href="/admin/pos"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition"
        >
          <Plus className="w-4 h-4" />
          Open POS Terminal
        </Link>
      </div>

      {/* Main Table Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">
            Total POS Sales ({sales.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search code or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#d43533]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Order Code</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No POS orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">
                      {sale.orderCode}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{sale.customerName}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{sale.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold font-mono text-[#d43533]">
                      ৳{parseFloat(sale.total || "0").toLocaleString("en-BD")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedSale(sale)}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                          title="View Lines"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Items Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  POS Order: {selectedSale.orderCode}
                </h3>
                <span className="text-[11px] text-gray-500">
                  Customer: {selectedSale.customerName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSale(null)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1 text-xs">
              {(selectedSale.itemsJson || []).map((item, i) => (
                <div key={i} className="pt-2 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-800">{item.productName}</div>
                    <div className="text-[10px] text-gray-400">
                      {item.quantity} × ৳{item.price}
                    </div>
                  </div>
                  <div className="font-bold text-gray-900">৳{item.lineTotal}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">৳{selectedSale.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="font-mono">+৳{selectedSale.tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="font-mono text-emerald-600">-৳{selectedSale.discount}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-1 font-bold text-sm">
                <span>Total:</span>
                <span className="text-[#d43533]">৳{selectedSale.total}</span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Link
                href={`/pos/receipt/${selectedSale.orderCode}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
              >
                <Printer className="w-3.5 h-3.5" />
                Thermal Receipt
              </Link>
              <button
                type="button"
                onClick={() => setSelectedSale(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200"
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
