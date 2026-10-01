"use client"

import React, { useState } from "react"
import { Search, Users, Eye, DollarSign, Power, CheckCircle, XCircle } from "lucide-react"
import {
  updateAffiliateUserApprovalAction,
  toggleAffiliateUserStatusAction,
  payAffiliateUserAction,
} from "@/app/actions/ecommerce-actions"
import type { AffiliateUser } from "@/db/schema/affiliate"
import { AffiliateVerificationModal } from "./affiliate-verification-modal"
import { AffiliatePayModal } from "./affiliate-pay-modal"

interface AdminAffiliateUsersViewProps {
  users: AffiliateUser[]
}

export function AdminAffiliateUsersView({ users: initialUsers }: AdminAffiliateUsersViewProps) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState("")
  const [inspectUser, setInspectUser] = useState<AffiliateUser | null>(null)
  const [payingUser, setPayingUser] = useState<AffiliateUser | null>(null)

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.userName.toLowerCase().includes(q) ||
      u.userEmail.toLowerCase().includes(q) ||
      u.referralCode.toLowerCase().includes(q) ||
      (u.phone && u.phone.toLowerCase().includes(q))
    )
  })

  const handleToggleApproval = async (id: number, currentApproved: boolean) => {
    const nextVal = !currentApproved
    try {
      await updateAffiliateUserApprovalAction(id, nextVal)
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, approved: nextVal } : u)))
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    const nextVal = !currentStatus
    try {
      await toggleAffiliateUserStatusAction(id, nextVal)
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: nextVal } : u)))
    } catch (err) {
      console.error(err)
    }
  }

  const handlePay = async (data: {
    affiliateUserId: number
    amount: string
    paymentMethod: string
    paymentDetails?: string
    txnCode?: string
  }) => {
    await payAffiliateUserAction(data)
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === data.affiliateUserId) {
          const bal = Math.max(0, parseFloat(u.balance || "0") - parseFloat(data.amount)).toFixed(2)
          return { ...u, balance: bal }
        }
        return u
      })
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Users className="w-7 h-7 text-[#d43533]" />
          Affiliate Users
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review affiliate partner applications, track due balances, and execute commission disbursements
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Registered Partners: <span className="font-bold text-slate-900">{filtered.length}</span>
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
                <th className="px-4 py-3.5 text-center">Verification Info</th>
                <th className="px-4 py-3.5 text-center">Approval</th>
                <th className="px-4 py-3.5">Due Amount</th>
                <th className="px-4 py-3.5 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    No affiliate partners found matching query.
                  </td>
                </tr>
              ) : (
                filtered.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{u.userName}</div>
                      <div className="font-mono text-[10px] text-slate-400 mt-0.5">Code: {u.referralCode}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">{u.phone || "—"}</td>
                    <td className="px-4 py-3.5 text-slate-600">{u.userEmail}</td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => setInspectUser(u)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={u.approved}
                        onChange={() => handleToggleApproval(u.id, u.approved)}
                        className="w-4 h-4 rounded text-[#d43533] focus:ring-[#d43533] accent-[#d43533] cursor-pointer"
                        title={u.approved ? "Approved Partner" : "Pending Approval"}
                      />
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 text-sm">
                      ${u.balance}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setPayingUser(u)}
                          disabled={parseFloat(u.balance || "0") <= 0}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-medium text-[11px] rounded transition-colors inline-flex items-center gap-1"
                          title="Pay due commission"
                        >
                          <DollarSign className="w-3 h-3" />
                          Pay Now
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className={`p-1.5 rounded transition-colors ${
                            u.status
                              ? "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                              : "bg-rose-50 text-rose-600 hover:bg-emerald-50 hover:text-emerald-600"
                          }`}
                          title={u.status ? "Suspend Account" : "Activate Account"}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AffiliateVerificationModal user={inspectUser} onClose={() => setInspectUser(null)} />
      <AffiliatePayModal user={payingUser} onClose={() => setPayingUser(null)} onPay={handlePay} />
    </div>
  )
}
