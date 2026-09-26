"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Gavel, Clock, Trophy, ExternalLink, ArrowRight } from "lucide-react"
import type { AuctionBid, AuctionProduct } from "@/db/schema/auction"

interface CustomerBiddedProductsViewProps {
  items: { bid: AuctionBid; product: AuctionProduct }[]
}

export function CustomerBiddedProductsView({ items }: CustomerBiddedProductsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Gavel className="w-5 h-5 text-[#d43533]" />
          My Auction Bids
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your active offers and real-time standing across participating lots
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Auction Item</th>
                <th className="px-4 py-3.5">My Highest Offer</th>
                <th className="px-4 py-3.5">Current High Bid</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Closing Date</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    You have not placed bids on any auction items yet.
                    <div className="mt-3">
                      <Link
                        href="/auction-products"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d43533] text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Explore Live Auctions <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map(({ bid, product }, idx) => {
                  const isLeading = parseFloat(bid.amount) >= parseFloat(product.currentBid)
                  const endDate = new Date(product.auctionEndDate)
                  return (
                    <tr key={bid.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative border border-slate-200">
                            <Image src={product.thumbnail} alt={product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 line-clamp-1">{product.name}</span>
                            <span className="text-xs text-slate-400">{product.sellerName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">${bid.amount}</td>
                      <td className="px-4 py-3.5 font-bold text-[#d43533]">${product.currentBid}</td>
                      <td className="px-4 py-3.5">
                        {isLeading ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Trophy className="w-3 h-3 text-amber-600" />
                            Leading Bidder
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                            Outbid
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">
                        {endDate.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href={`/auction-product/${product.slug}`}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-[#d43533] text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          View Lot <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
