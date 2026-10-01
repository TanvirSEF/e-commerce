"use client"

import React, { useState } from "react"
import { DollarSign, CheckCircle, XCircle, Search, Clock, CreditCard } from "lucide-react"
import {
  processWithdrawRequestPayoutAction,
  rejectWithdrawRequestAction,
} from "@/app/actions/ecommerce-actions"
import type { AffiliateWithdrawRequest } from "@/db/schema/affiliate"
import { AffiliateWithdrawPayModal } from "./affiliate-withdraw-pay-modal"

interface AdminAffiliateWithdrawRequestsViewProps {
  requests: AffiliateWithdrawRequest[]
}

export function AdminAffiliateWithdrawRequestsView({
  requests: initialRequests,
}: AdminAffiliateWithdrawRequestsViewProps) {
  const [requests, setRequests] = useState(initialRequests)
  const [search, setSearch] = useState("")
  const [activePayRequest, setActivePayRequest] = useState<AffiliateWithdrawRequest | null>(null)

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase()
    return (
      r.userName.toLowerCase().includes(q) ||
      r.userEmail.toLowerCase().includes(q) ||
      (r.txnCode && r.txnCode.toLowerCase().includes(q))
    )
  })

  const handlePay = async (data: {
    requestId: number
    paymentMethod: string
    paymentDetails?: string
    txnCode?: string
  }) => {
    await processWithdrawRequestPayoutAction(data)
    setRequests((prev) =>
      prev.map((r) =>
        r.id === data.requestId
          ? {
              ...r,
              status: "approved",
              paymentMethod: data.paymentMethod,
              paymentDetails: data.paymentDetails || null,
              txnCode: data.txnCode || null,
            }
          : r
      )
    )
  }

  const handleReject = async (id: number) => {
    if (!confirm("Are you sure you want to reject this withdrawal request?")) return
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
          Affiliate Withdraw Requests
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, approve, and disburse payout requests submitted by affiliated publishers
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
            Total Requests: <span className="font-bold text-slate-900">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 w-12 text-slate-400">#</th>
                <th className="px-4 py-3.5">Affiliate Partner</th>
                <th className="px-4 py-3.5">Requested Amount</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5">Disbursement Details</th>
                <th className="px-4 py-3.5">Date Submitted</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No withdrawal requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{r.userName}</div>
                      <div className="text-slate-400">{r.userEmail}</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 text-sm">
                      ${r.amount}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {r.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Paid & Approved
                        </span>
                      ) : r.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {r.paymentMethod ? (
                        <div>
                          <div className="font-medium text-slate-800">{r.paymentMethod}</div>
                          {r.txnCode && (
                            <div className="font-mono text-[10px] text-slate-400">Ref: {r.txnCode}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {r.status === "pending" ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setActivePayRequest(r)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] rounded transition-colors inline-flex items-center gap-1"
                          >
                            <DollarSign className="w-3 h-3" />
                            Pay Now
                          </button>
                          <button
                            onClick={() => handleReject(r.id)}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-medium text-[11px] rounded transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium capitalize">
                          {r.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AffiliateWithdrawPayModal
        request={activePayRequest}
        onClose={() => setActivePayRequest(null)}
        onPay={handlePay}
      />
    </div>
  )
}
