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
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/seller/auction/products"
          className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Gavel className="w-5 h-5 text-[#d43533]" />
            Bid History: {product.name}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Leading Bid: <span className="font-bold text-[#d43533]">${Number(product.currentBid).toFixed(2)}</span> ({bids.length} Offers Placed) • Reserve Starting: ${Number(product.startingBid).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Live Bidding Log</h2>
          <span className="text-xs text-gray-500">
            Total Bids: <span className="font-semibold text-gray-800">{bids.length}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-semibold text-gray-600 uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12 font-mono">#</th>
                <th className="py-3 px-4">Bidder</th>
                <th className="py-3 px-4">Offer Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bids.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No bids received yet for this auction item.
                  </td>
                </tr>
              ) : (
                bids.map((b, idx) => (
                  <tr
                    key={b.id}
                    className={idx === 0 ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-gray-50/80 transition-colors"}
                  >
                    <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{b.userName}</div>
                          <div className="text-[10px] text-gray-400">{b.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-sm text-gray-900">
                      ${Number(b.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {idx === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Award className="w-3 h-3 text-amber-600" />
                          Leading Bid
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">Outbid</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500 font-mono text-[11px]">
                      <div className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
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
