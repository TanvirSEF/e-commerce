"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Gavel, Plus, Search, Eye, Calendar, Clock, ExternalLink } from "lucide-react"
import type { AuctionProduct } from "@/db/schema/auction"

interface SellerAuctionProductsViewProps {
  products: AuctionProduct[]
}

export function SellerAuctionProductsView({ products: initialProducts }: SellerAuctionProductsViewProps) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Gavel className="w-7 h-7 text-[#d43533]" />
            My Auction Listings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your bidding inventory, track incoming bids, and monitor closing timers
          </p>
        </div>
        <Link
          href="/seller/auction/products/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d43533] hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Auction Item
        </Link>
      </div>

      <div className="bg-[#1e293b] rounded-xl shadow-sm border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search my auction products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-400">
            <span className="font-semibold text-white">{filtered.length}</span> Listed Items
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f172a] text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Item</th>
                <th className="px-4 py-3.5">Starting Bid</th>
                <th className="px-4 py-3.5">Current Bid</th>
                <th className="px-4 py-3.5">Total Bids</th>
                <th className="px-4 py-3.5">Auction Window</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    No auction products found. Click Add Auction Item to list one.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const endDate = new Date(item.auctionEndDate)
                  const isExpired = endDate.getTime() < Date.now()
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5 text-slate-500">{idx + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 relative border border-slate-700">
                            <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-semibold text-white line-clamp-1">{item.name}</span>
                            <span className="text-xs text-slate-400 block">Min Inc: +${item.minBidIncrement}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-300 font-medium">${item.startingBid}</td>
                      <td className="px-4 py-3.5 font-bold text-red-400 text-base">${item.currentBid}</td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/seller/auction/bids/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-semibold text-xs hover:bg-amber-500/20"
                        >
                          <Gavel className="w-3.5 h-3.5" />
                          {item.totalBids} Bids
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ends: {endDate.toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {isExpired ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-slate-400">
                            Closed
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Live
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/auction-product/${item.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/seller/auction/bids/${item.id}`}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
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
