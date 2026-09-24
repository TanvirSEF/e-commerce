"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Search, Printer, Plus } from "lucide-react"
import type { PosSale } from "@/db/schema"

interface SellerPosOrdersViewProps {
  initialSales: PosSale[]
}

export function SellerPosOrdersView({ initialSales }: SellerPosOrdersViewProps) {
  const [sales] = useState<PosSale[]>(initialSales)
  const [search, setSearch] = useState("")

  const filtered = sales.filter((s) =>
    s.orderCode.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-[#d43533]" />
            Vendor POS Orders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Record of in-store cash and POS sales executed from your store counter
          </p>
        </div>
        <Link
          href="/seller/pos"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition"
        >
          <Plus className="w-4 h-4" />
          Open Register
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-xs">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">
            Total Sales ({sales.length})
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
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No sales recorded.
                  </td>
                </tr>
              ) : (
                filtered.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{sale.orderCode}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(sale.createdAt).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{sale.customerName}</td>
                    <td className="px-4 py-3">{sale.paymentMethod}</td>
                    <td className="px-4 py-3 font-bold font-mono text-[#d43533]">৳{sale.total}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/pos/receipt/${sale.orderCode}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Print"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </Link>
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
