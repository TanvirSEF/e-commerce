"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { DollarSign, Search, Filter, Store, Calendar, TrendingUp } from "lucide-react"
import type { CommissionReportItem } from "@/services/report-service"

interface AdminCommissionReportViewProps {
  commissions: CommissionReportItem[]
  sellers: { id: string; name: string }[]
  currentSellerId?: string
  currentDateRange?: string
}

export function AdminCommissionReportView({
  commissions,
  sellers,
  currentSellerId,
  currentDateRange,
}: AdminCommissionReportViewProps) {
  const router = useRouter()
  const [selectedSeller, setSelectedSeller] = useState(currentSellerId || "")
  const [search, setSearch] = useState("")

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSeller) {
      router.push(`/admin/reports/commission-history?seller_id=${selectedSeller}`)
    } else {
      router.push(`/admin/reports/commission-history`)
    }
  }

  const filtered = commissions.filter(
    (c) =>
      (c.sellerName || "").toLowerCase().includes(search.toLowerCase()) ||
      c.orderCode.toLowerCase().includes(search.toLowerCase())
  )

  const totalAdminComm = filtered.reduce((acc, c) => acc + Number(c.adminCommission || 0), 0)
  const totalSellerEarnings = filtered.reduce((acc, c) => acc + Number(c.sellerEarning || 0), 0)

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[#d43533]" />
            Commission History report
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log of marketplace commissions retained by the platform versus net payouts credited to sellers
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Admin Commission</div>
            <div className="text-xl font-bold text-emerald-600">${totalAdminComm.toFixed(2)}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Seller Earnings</div>
            <div className="text-xl font-bold text-indigo-600">${totalSellerEarnings.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Main Card (1:1 with Laravel commission_history_section) */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Header Filter Form */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <form onSubmit={handleFilter} className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-800 whitespace-nowrap">
              Commission History
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                className="w-full sm:w-48 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#d43533]"
              >
                <option value="">Choose Seller</option>
                {sellers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-1"
              >
                <Filter className="w-3.5 h-3.5" /> Filter
              </button>
            </div>
          </form>
        </div>

        {/* Quick Search */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order code or seller..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Records: <span className="font-bold text-slate-800">{filtered.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs">
              <tr>
                <th className="px-4 py-3 w-16">#</th>
                <th className="px-4 py-3">Order Code</th>
                <th className="px-4 py-3">Seller Name</th>
                <th className="px-4 py-3 text-right">Admin Commission</th>
                <th className="px-4 py-3 text-right">Seller Earning</th>
                <th className="px-4 py-3 text-right">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    No commission history logs found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                      {item.orderCode}
                      {item.orderFrom === "pos" && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          POS
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {item.sellerName || "Marketplace Seller"}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-emerald-600">
                      ${item.adminCommission}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-indigo-600">
                      ${item.sellerEarning}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
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
