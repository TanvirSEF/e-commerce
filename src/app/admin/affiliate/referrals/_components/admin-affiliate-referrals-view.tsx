"use client"

import React, { useState } from "react"
import { GitFork, Search } from "lucide-react"
import type { AffiliateReferral } from "@/db/schema/affiliate"

interface AdminAffiliateReferralsViewProps {
  referrals: (AffiliateReferral & { affiliateUserName?: string })[]
}

export function AdminAffiliateReferralsView({ referrals }: AdminAffiliateReferralsViewProps) {
  const [search, setSearch] = useState("")

  const filtered = referrals.filter((r) => {
    const q = search.toLowerCase()
    return (
      r.referredUserName.toLowerCase().includes(q) ||
      r.referredUserEmail.toLowerCase().includes(q) ||
      (r.referredUserPhone && r.referredUserPhone.toLowerCase().includes(q)) ||
      (r.affiliateUserName && r.affiliateUserName.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <GitFork className="w-7 h-7 text-[#d43533]" />
          Referral Users
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete directory of customers referred to the platform by your registered affiliates
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, email, or affiliate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Total Referred Customers: <span className="font-bold text-slate-900">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 w-12 text-slate-400">#</th>
                <th className="px-4 py-3.5">Name</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Email Address</th>
                <th className="px-4 py-3.5">Reffered By</th>
                <th className="px-4 py-3.5">Referral Type</th>
                <th className="px-4 py-3.5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No referred customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{r.referredUserName}</td>
                    <td className="px-4 py-3.5 text-slate-600">{r.referredUserPhone || "—"}</td>
                    <td className="px-4 py-3.5 text-slate-600">{r.referredUserEmail}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded bg-red-50 text-[#d43533] font-semibold text-[11px] border border-red-100">
                        {r.affiliateUserName || "Partner #" + r.affiliateUserId}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {r.referralType}
                      </span>
                      {r.orderCode && (
                        <span className="block font-mono text-[10px] text-slate-400 mt-0.5">
                          {r.orderCode}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString()}
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
