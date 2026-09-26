"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, Gavel, Award, User, Clock } from "lucide-react"
import type { AuctionBid, AuctionProduct } from "@/db/schema/auction"

interface SellerAuctionBidsViewProps {
  product: AuctionProduct
  bids: AuctionBid[]
}

export function SellerAuctionBidsView({ product, bids }: SellerAuctionBidsViewProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/seller/auction/products"
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Gavel className="w-6 h-6 text-[#d43533]" />
            Bid Activity: {product.name}
          </h1>
          <p className="text-sm text-slate-400">
            Top Bid: <span className="font-bold text-red-400">${product.currentBid}</span> ({bids.length} Offers Placed)
          </p>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-xl shadow-sm border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Live Bidding Log</h2>
          <span className="text-xs text-slate-400">Reserve Starting: ${product.startingBid}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f172a]/70 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Bidder</th>
                <th className="px-4 py-3.5">Offer Amount</th>
                <th className="px-4 py-3.5">Position</th>
                <th className="px-4 py-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {bids.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500">
                    No bids received yet.
                  </td>
                </tr>
              ) : (
                bids.map((b, idx) => (
                  <tr key={b.id} className={idx === 0 ? "bg-amber-500/10 font-medium" : "hover:bg-slate-800/40"}>
                    <td className="px-4 py-3.5 text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{b.userName}</div>
                          <div className="text-xs text-slate-400">{b.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-base text-white">
                      ${b.amount}
                    </td>
                    <td className="px-4 py-3.5">
                      {idx === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          Leading Bid
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Outbid</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
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
