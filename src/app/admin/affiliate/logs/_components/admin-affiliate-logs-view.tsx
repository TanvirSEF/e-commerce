"use client"

import React, { useState } from "react"
import { History, Search, ArrowUpRight, DollarSign } from "lucide-react"
import type { AffiliateLog } from "@/db/schema/affiliate"

interface AdminAffiliateLogsViewProps {
  logs: AffiliateLog[]
}

export function AdminAffiliateLogsView({ logs }: AdminAffiliateLogsViewProps) {
  const [search, setSearch] = useState("")

  const filtered = logs.filter(
    (l) =>
      l.referredUserName.toLowerCase().includes(search.toLowerCase()) ||
      l.affiliateType.toLowerCase().includes(search.toLowerCase()) ||
      (l.orderCode && l.orderCode.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <History className="w-7 h-7 text-[#d43533]" />
          Affiliate Commission & Audit Logs
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete ledger of credited commissions, referring links, and associated order checkouts
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, event, or order code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Ledger Entries: <span className="font-bold text-slate-900">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Referred Customer</th>
                <th className="px-4 py-3.5">Commission Event</th>
                <th className="px-4 py-3.5">Associated Order</th>
                <th className="px-4 py-3.5">Amount Credited</th>
                <th className="px-4 py-3.5">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No commission audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((l, idx) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{l.referredUserName}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {l.affiliateType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono font-medium text-slate-600">
                      {l.orderCode || "—"}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 text-base">
                      +${l.amount}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
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
