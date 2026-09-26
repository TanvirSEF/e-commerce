"use client"

import React, { useState } from "react"
import { GitFork, Search, Users, ExternalLink } from "lucide-react"
import type { AffiliateUser } from "@/db/schema/affiliate"

interface AdminAffiliateReferralsViewProps {
  users: AffiliateUser[]
}

export function AdminAffiliateReferralsView({ users }: AdminAffiliateReferralsViewProps) {
  const [search, setSearch] = useState("")

  const filtered = users.filter(
    (u) =>
      u.userName.toLowerCase().includes(search.toLowerCase()) ||
      u.referralCode.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <GitFork className="w-7 h-7 text-[#d43533]" />
          Affiliate Referral Trees & Channels
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor referral code link channels and network generation performance
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search partner or referral code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Active Referral Tracks: <span className="font-bold text-slate-900">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Partner Affiliate</th>
                <th className="px-4 py-3.5">Assigned Referral Link</th>
                <th className="px-4 py-3.5">Referral Code</th>
                <th className="px-4 py-3.5">Active Balance</th>
                <th className="px-4 py-3.5">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((u, idx) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-800">{u.userName}</div>
                    <div className="text-xs text-slate-400">{u.userEmail}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 select-all">
                      https://huipper.com/?ref={u.referralCode}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {u.referralCode}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-emerald-600">${u.balance}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
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
