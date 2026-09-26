"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, Gavel, Award, User, DollarSign, Clock } from "lucide-react"
import type { AuctionBid, AuctionProduct } from "@/db/schema/auction"

interface AdminAuctionBidsViewProps {
  product: AuctionProduct
  bids: AuctionBid[]
}

export function AdminAuctionBidsView({ product, bids }: AdminAuctionBidsViewProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/auction/all-products"
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Gavel className="w-6 h-6 text-[#d43533]" />
            Bid History: {product.name}
          </h1>
          <p className="text-sm text-slate-500">
            Current Highest Bid: <span className="font-bold text-[#d43533]">${product.currentBid}</span> ({bids.length} Total Bids)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Bid Ledger (Descending Order)</h2>
          <span className="text-xs text-slate-500 font-medium">Starting Bid: ${product.startingBid}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Bidder</th>
                <th className="px-4 py-3.5">Bid Amount</th>
                <th className="px-4 py-3.5">Standing</th>
                <th className="px-4 py-3.5">Placed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {bids.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500">
                    No bids have been placed on this auction yet.
                  </td>
                </tr>
              ) : (
                bids.map((b, idx) => (
                  <tr key={b.id} className={idx === 0 ? "bg-amber-50/40 font-medium" : "hover:bg-slate-50/60"}>
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{b.userName}</div>
                          <div className="text-xs text-slate-400">{b.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-base text-slate-900">
                      ${b.amount}
                    </td>
                    <td className="px-4 py-3.5">
                      {idx === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          Highest Bidder
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Outbid</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(b.createdAt).toLocaleString()}
                      </div>
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
