"use client"

import React, { useState } from "react"
import { DollarSign, CheckCircle, XCircle, Search, Clock, CreditCard } from "lucide-react"
import { approveWithdrawRequestAction, rejectWithdrawRequestAction } from "@/app/actions/ecommerce-actions"
import type { AffiliateWithdrawRequest } from "@/db/schema/affiliate"

interface AdminAffiliateWithdrawRequestsViewProps {
  requests: AffiliateWithdrawRequest[]
}

export function AdminAffiliateWithdrawRequestsView({
  requests: initialRequests,
}: AdminAffiliateWithdrawRequestsViewProps) {
  const [requests, setRequests] = useState(initialRequests)
  const [search, setSearch] = useState("")

  const filtered = requests.filter(
    (r) =>
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase())
  )

  const handleApprove = async (id: number) => {
    try {
      await approveWithdrawRequestAction(id)
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleReject = async (id: number) => {
    try {
      await rejectWithdrawRequestAction(id)
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <DollarSign className="w-7 h-7 text-emerald-600" />
          Affiliate Withdrawal Requests
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, approve, and execute payout disbursements requested by affiliated publishers
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by affiliate name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Pending / Handled Requests: <span className="font-bold text-slate-900">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Affiliate</th>
                <th className="px-4 py-3.5">Requested Amount</th>
                <th className="px-4 py-3.5">Date Submitted</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No withdrawal requests submitted yet.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{r.userName}</div>
                      <div className="text-xs text-slate-400">{r.userEmail}</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 text-base">
                      ${r.amount}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {r.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Paid & Approved
                        </span>
                      ) : r.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {r.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(r.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors"
                          >
                            Pay & Approve
                          </button>
                          <button
                            onClick={() => handleReject(r.id)}
                            className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-medium text-xs rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Completed</span>
                      )}
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
