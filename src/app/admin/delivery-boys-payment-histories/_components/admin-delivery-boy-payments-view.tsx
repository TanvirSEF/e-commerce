"use client"

import React, { useState } from "react"
import { DollarSign, Search, CheckCircle, Calendar, CreditCard } from "lucide-react"
import type { DeliveryPayout } from "@/db/schema/delivery-boy"

interface AdminDeliveryBoyPaymentsViewProps {
  payouts: DeliveryPayout[]
}

export function AdminDeliveryBoyPaymentsView({ payouts }: AdminDeliveryBoyPaymentsViewProps) {
  const [search, setSearch] = useState("")

  const filtered = payouts.filter((p) =>
    p.deliveryBoyName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <DollarSign className="w-7 h-7 text-emerald-600" />
          Delivery Boy Payment Histories
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Historical record of disbursements paid out to delivery courier drivers
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search driver by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Total Disbursements: <span className="font-bold text-slate-900">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Courier Name</th>
                <th className="px-4 py-3.5">Amount Disbursed</th>
                <th className="px-4 py-3.5">Payment Method</th>
                <th className="px-4 py-3.5">Disbursement Date</th>
                <th className="px-4 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{p.deliveryBoyName}</td>
                  <td className="px-4 py-3.5 font-bold text-emerald-600 text-base">${p.amount}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                      <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">
                    {new Date(p.paymentDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3 h-3" /> Paid
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
