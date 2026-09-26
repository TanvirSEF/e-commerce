"use client"

import React, { useState } from "react"
import { Search, Users, CheckCircle, XCircle, DollarSign, CreditCard, Shield } from "lucide-react"
import { approveAffiliateUserAction, rejectAffiliateUserAction } from "@/app/actions/ecommerce-actions"
import type { AffiliateUser } from "@/db/schema/affiliate"

interface AdminAffiliateUsersViewProps {
  users: AffiliateUser[]
}

export function AdminAffiliateUsersView({ users: initialUsers }: AdminAffiliateUsersViewProps) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState("")

  const filtered = users.filter(
    (u) =>
      u.userName.toLowerCase().includes(search.toLowerCase()) ||
      u.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      u.referralCode.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await rejectAffiliateUserAction(id)
      } else {
        await approveAffiliateUserAction(id)
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: !currentStatus } : u))
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-[#d43533]" />
            Affiliate Users & Partners
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supervise approved affiliate influencers, commission balances, and referral codes
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Affiliated Partners: <span className="font-bold text-slate-900">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Referral Code</th>
                <th className="px-4 py-3.5">Payment Details</th>
                <th className="px-4 py-3.5">Earned Balance</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Approval Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No affiliate partners registered yet.
                  </td>
                </tr>
              ) : (
                filtered.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{u.userName}</div>
                      <div className="text-xs text-slate-400">{u.userEmail}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        {u.referralCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {u.paypalEmail && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-blue-600">PayPal:</span> {u.paypalEmail}
                        </div>
                      )}
                      {u.bankInfo && (
                        <div className="flex items-center gap-1 text-slate-500 truncate max-w-xs mt-0.5">
                          <CreditCard className="w-3.5 h-3.5 shrink-0" /> {u.bankInfo}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 text-base">
                      ${u.balance}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {u.status ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleToggle(u.id, u.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          u.status
                            ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        }`}
                      >
                        {u.status ? "Suspend Partner" : "Approve Partner"}
                      </button>
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
