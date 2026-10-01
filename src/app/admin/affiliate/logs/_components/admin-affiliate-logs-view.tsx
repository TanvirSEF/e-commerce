"use client"

import React, { useState } from "react"
import { History, Search } from "lucide-react"
import type { AffiliateLog } from "@/db/schema/affiliate"

interface AdminAffiliateLogsViewProps {
  logs: AffiliateLog[]
}

export function AdminAffiliateLogsView({ logs }: AdminAffiliateLogsViewProps) {
  const [search, setSearch] = useState("")

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase()
    return (
      (l.affiliateUserName && l.affiliateUserName.toLowerCase().includes(q)) ||
      l.referredUserName.toLowerCase().includes(q) ||
      l.affiliateType.toLowerCase().includes(q) ||
      (l.orderCode && l.orderCode.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <History className="w-7 h-7 text-[#d43533]" />
          Affiliate Logs
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete audit trail of credited affiliate commissions, referred users, and linked order transactions
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search affiliate, customer, or order code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Total Ledger Entries: <span className="font-bold text-slate-900">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 w-12 text-slate-400">#</th>
                <th className="px-4 py-3.5">Affiliate Partner</th>
                <th className="px-4 py-3.5">Referred Customer</th>
                <th className="px-4 py-3.5">Commission Event</th>
                <th className="px-4 py-3.5">Associated Order</th>
                <th className="px-4 py-3.5">Amount Credited</th>
                <th className="px-4 py-3.5 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No commission audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((l, idx) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {l.affiliateUserName || "Partner #" + l.affiliateUserId}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{l.referredUserName}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {l.affiliateType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono font-medium text-slate-600">
                      {l.orderCode || "—"}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 text-sm">
                      +${l.amount}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-500">
                      {new Date(l.createdAt).toLocaleString()}
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
