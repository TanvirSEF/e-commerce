"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ExternalLink, CheckCircle, Clock, XCircle, Eye, Banknote, X } from "lucide-react"
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
  const [activeMessage, setActiveMessage] = useState<SellerWithdrawItem | null>(null)

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Seller</th>
                <th className="py-3 px-4">Total Amount to Pay</th>
                <th className="py-3 px-4">Requested Amount</th>
                <th className="py-3 px-4 max-w-xs">Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No withdraw requests found.
                  </td>
                </tr>
              ) : (
                requests.map((r, idx) => (
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
                          {r.sellerName} <span className="text-slate-500 font-normal">({r.shopName})</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {formatPrice(r.amount * 1.2)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-sm text-[#d43533]">
                      {formatPrice(r.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.message ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-600 truncate max-w-[180px] block" title={r.message}>
                            {r.message}
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveMessage(r)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 shrink-0"
                            title="View Full Message"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.status === "paid" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Paid
                        </span>
                      )}
                      {r.status === "pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
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
                      <div className="inline-flex items-center gap-1">
                        {r.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => onProcessRequest(r)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-full border border-amber-200 transition-colors"
                            title="Pay Now"
                          >
                            <Banknote className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {r.message && (
                          <button
                            type="button"
                            onClick={() => setActiveMessage(r)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 transition-colors"
                            title="Message View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal (1:1 with Laravel message_modal.blade.php) */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 relative animate-in fade-in zoom-in-95 text-xs">
            <button
              onClick={() => setActiveMessage(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Withdrawal Request Message
            </h3>
            <p className="text-slate-500 mb-3">
              Submitted by <span className="font-semibold text-slate-700">{activeMessage.sellerName}</span> ({activeMessage.shopName})
            </p>
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed">
              {activeMessage.message || "No message provided."}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveMessage(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
