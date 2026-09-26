"use client"

import React, { useState } from "react"
import { DollarSign, Search, CheckCircle, Package } from "lucide-react"
import type { DeliveryCollection } from "@/db/schema/delivery-boy"

interface AdminDeliveryBoyCollectionsViewProps {
  collections: DeliveryCollection[]
}

export function AdminDeliveryBoyCollectionsView({ collections }: AdminDeliveryBoyCollectionsViewProps) {
  const [search, setSearch] = useState("")

  const filtered = collections.filter(
    (c) =>
      c.deliveryBoyName.toLowerCase().includes(search.toLowerCase()) ||
      c.orderCode.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <DollarSign className="w-7 h-7 text-[#d43533]" />
          Delivery Boy COD Collection Histories
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Record of cash on delivery funds collected by couriers from recipient buyers
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by driver or order code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Collections Logged: <span className="font-bold text-slate-900">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Courier Name</th>
                <th className="px-4 py-3.5">Delivered Order Code</th>
                <th className="px-4 py-3.5">Cash Amount Collected</th>
                <th className="px-4 py-3.5">Collection Timestamp</th>
                <th className="px-4 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{c.deliveryBoyName}</td>
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-900">{c.orderCode}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900 text-base">${c.amount}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">
                    {new Date(c.collectionDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3 h-3" /> Collected
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
