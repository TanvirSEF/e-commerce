"use client"

import React, { useState } from "react"
import { DollarSign, Search, Store, Calendar, TrendingUp } from "lucide-react"

interface CommissionEntry {
  id: number
  sellerName: string
  orderCode: string
  orderAmount: string
  adminCommission: string
  sellerEarning: string
  calculatedAt: string
}

const MOCK_COMMISSIONS: CommissionEntry[] = [
  {
    id: 1,
    sellerName: "TechVision MegaStore",
    orderCode: "ORD-202609-0891",
    orderAmount: "450.00",
    adminCommission: "45.00",
    sellerEarning: "405.00",
    calculatedAt: "2026-09-25 15:30:00",
  },
  {
    id: 2,
    sellerName: "Gadget Galaxy",
    orderCode: "ORD-202609-0895",
    orderAmount: "120.00",
    adminCommission: "12.00",
    sellerEarning: "108.00",
    calculatedAt: "2026-09-25 12:10:00",
  },
  {
    id: 3,
    sellerName: "Elegance Fashion House",
    orderCode: "ORD-202609-0902",
    orderAmount: "85.00",
    adminCommission: "10.20",
    sellerEarning: "74.80",
    calculatedAt: "2026-09-24 18:45:00",
  },
  {
    id: 4,
    sellerName: "TechVision MegaStore",
    orderCode: "ORD-202609-0915",
    orderAmount: "780.00",
    adminCommission: "78.00",
    sellerEarning: "702.00",
    calculatedAt: "2026-09-24 10:15:00",
  },
]

export function AdminCommissionReportView() {
  const [commissions] = useState(MOCK_COMMISSIONS)
  const [search, setSearch] = useState("")

  const filtered = commissions.filter((c) =>
    c.sellerName.toLowerCase().includes(search.toLowerCase()) ||
    c.orderCode.toLowerCase().includes(search.toLowerCase())
  )

  const totalAdminCommission = filtered.reduce((acc, c) => acc + parseFloat(c.adminCommission), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-emerald-600" />
            Seller Commission Breakdown Report
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Audit platform marketplace fees collected across third-party vendor orders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Platform Commission</span>
          <div className="text-2xl font-black text-emerald-600">${totalAdminCommission.toFixed(2)}</div>
          <span className="text-[11px] text-slate-400">Net earned marketplace revenue</span>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Recorded Multi-Vendor Orders</span>
          <div className="text-2xl font-black text-slate-900">{filtered.length}</div>
          <span className="text-[11px] text-blue-600 font-medium">Calculated per rate policy</span>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Average Take Rate</span>
          <div className="text-2xl font-black text-slate-900">10.0%</div>
          <span className="text-[11px] text-slate-400">Standard vendor commission</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by vendor or order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Entries: <span className="font-bold text-slate-900">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Seller Shop</th>
                <th className="px-4 py-3.5">Order Code</th>
                <th className="px-4 py-3.5">Order Total</th>
                <th className="px-4 py-3.5">Admin Commission (Retained)</th>
                <th className="px-4 py-3.5">Seller Balance Credited</th>
                <th className="px-4 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{c.sellerName}</td>
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-900">{c.orderCode}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">${c.orderAmount}</td>
                  <td className="px-4 py-3.5 font-bold text-emerald-600 text-base">+${c.adminCommission}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-600">${c.sellerEarning}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{c.calculatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
