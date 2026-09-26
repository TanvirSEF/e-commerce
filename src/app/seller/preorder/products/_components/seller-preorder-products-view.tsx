"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Plus, Search, Calendar } from "lucide-react"
import type { PreorderProduct } from "@/db/schema"

interface SellerPreorderProductsViewProps {
  initialProducts: PreorderProduct[]
}

export function SellerPreorderProductsView({ initialProducts }: SellerPreorderProductsViewProps) {
  const [products] = useState<PreorderProduct[]>(initialProducts)
  const [search, setSearch] = useState("")

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#d43533]" />
            Vendor Pre-Order Catalog
          </h1>
          <p className="text-xs text-gray-500">Upcoming manufacturing runs and pre-booked batches</p>
        </div>

        <Link
          href="/seller/preorder/orders"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
        >
          Customer Bookings
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search pre-order products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#d43533] focus:outline-hidden"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-gray-200 px-5 py-3 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Pre-Order Products</span>
          <span className="text-xs font-mono text-gray-400">{filtered.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Retail Price</th>
                <th className="py-3 px-4">Deposit Amount</th>
                <th className="py-3 px-4">Estimated Delivery</th>
                <th className="py-3 px-4">Batch Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item, idx) => {
                const filledPercent = Math.min(
                  100,
                  Math.round((item.currentPreorders / item.preorderBatchLimit) * 100)
                )
                return (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                          <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 block">{item.name}</span>
                          <span className="text-[11px] font-mono text-gray-400">{item.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">${item.price}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">${item.prepaymentAmount}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        {new Date(item.releaseDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 min-w-[140px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-semibold text-gray-800">{item.currentPreorders} reserved</span>
                          <span className="text-gray-400">/ {item.preorderBatchLimit} max</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${filledPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
