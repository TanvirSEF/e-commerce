"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Gavel,
  Plus,
  Search,
  Eye,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react"
import type { AuctionProduct } from "@/db/schema/auction"

interface AdminAuctionAllProductsViewProps {
  products: AuctionProduct[]
  title?: string
  subtitle?: string
}

export function AdminAuctionAllProductsView({
  products: initialProducts,
  title = "All Auction Products",
  subtitle = "Manage live bidding products, starting bids, and real-time bidder participation",
}: AdminAuctionAllProductsViewProps) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Gavel className="w-7 h-7 text-[#d43533]" />
            {title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <Link
          href="/admin/auction/products/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d43533] hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Auction Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search auction product or seller..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">{filtered.length}</span> Products Registered
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Product</th>
                <th className="px-4 py-3.5">Seller</th>
                <th className="px-4 py-3.5">Starting Bid</th>
                <th className="px-4 py-3.5">Current Bid</th>
                <th className="px-4 py-3.5">Total Bids</th>
                <th className="px-4 py-3.5">Auction Period</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-500">
                    No auction products found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const endDate = new Date(item.auctionEndDate)
                  const isExpired = endDate.getTime() < Date.now()
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 text-slate-400 font-medium">{idx + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative border border-slate-200">
                            <Image
                              src={item.thumbnail}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 line-clamp-1">
                              {item.name}
                            </span>
                            <span className="text-xs text-slate-400 block">Min Inc: +${item.minBidIncrement}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {item.sellerName}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-600">${item.startingBid}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-[#d43533] text-base">${item.currentBid}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/auction/bids/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-semibold text-xs hover:bg-amber-100 transition-colors"
                        >
                          <Gavel className="w-3.5 h-3.5 text-amber-600" />
                          {item.totalBids} Bids
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(item.auctionStartDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 font-medium text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-red-500" />
                          <span>Ends: {endDate.toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {isExpired ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            Ended
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/auction-product/${item.slug}`}
                            target="_blank"
                            title="View Public Auction Page"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/auction/bids/${item.id}`}
                            title="Inspect Bids"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
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
