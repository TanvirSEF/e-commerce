"use client"

import React from "react"
import Link from "next/link"
import { ExternalLink, CheckCircle, Clock, XCircle } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { SellerWithdrawItem } from "@/services/seller-service"

interface PayoutRequestsTableProps {
  requests: SellerWithdrawItem[]
  onProcessRequest: (req: SellerWithdrawItem) => void
}

export function PayoutRequestsTable({
  requests,
  onProcessRequest,
}: PayoutRequestsTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Seller / Shop</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Payment Info</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((r, idx) => (
              <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-medium text-slate-500">{idx + 1}</td>
                <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{r.date}</td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-800">
                    <Link
                      href={`/shop/${r.shopSlug}`}
                      target="_blank"
                      className="hover:text-[#d43533] inline-flex items-center gap-1"
                    >
                      {r.shopName}
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </div>
                  <div className="text-[11px] text-slate-400">{r.sellerName}</div>
                </td>
                <td className="py-3.5 px-4 font-bold text-sm text-[#d43533]">
                  {formatPrice(r.amount)}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-700">{r.paymentMethod || "bKash"}</div>
                  {r.transactionId && (
                    <div className="text-[11px] text-slate-500 font-mono">
                      Ref: {r.transactionId}
                    </div>
                  )}
                  {r.message && !r.transactionId && (
                    <div className="text-[11px] text-slate-400 truncate max-w-[200px]" title={r.message}>
                      {r.message}
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  {r.status === "paid" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3 h-3" /> Paid
                    </span>
                  )}
                  {r.status === "pending" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                  {r.status === "rejected" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                      <XCircle className="w-3 h-3" /> Rejected
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {r.status === "pending" ? (
                    <button
                      onClick={() => onProcessRequest(r)}
                      className="px-3 py-1 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-[11px] font-semibold shadow-xs transition-colors"
                    >
                      Process Payout
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Settled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
