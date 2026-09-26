"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react"
import type { AffiliateWithdrawRequest } from "@/db/schema/affiliate"

interface CustomerAffiliatePaymentsViewProps {
  requests: AffiliateWithdrawRequest[]
}

export function CustomerAffiliatePaymentsView({ requests }: CustomerAffiliatePaymentsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/affiliate"
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Affiliate Payout History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review status of submitted withdrawal requests and disbursement logs
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Requested Amount</th>
                <th className="px-4 py-3.5">Submission Date</th>
                <th className="px-4 py-3.5 text-center">Disbursement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-slate-500">
                    No withdrawal requests submitted yet.
                  </td>
                </tr>
              ) : (
                requests.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 text-base">${r.amount}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {r.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Paid & Settled
                        </span>
                      ) : r.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3" /> In Review
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
    </div>
  )
}
