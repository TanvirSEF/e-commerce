"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Gavel, Clock, ShieldCheck, Flame, ArrowRight, Trophy, Sparkles } from "lucide-react"
import type { AuctionProduct } from "@/db/schema/auction"

interface AuctionShowcaseViewProps {
  products: AuctionProduct[]
}

export function AuctionShowcaseView({ products }: AuctionShowcaseViewProps) {
  const [filter, setFilter] = useState("all")

  const filtered = products.filter((p) => {
    if (filter === "inhouse") return p.sellerSlug === "inhouse"
    if (filter === "seller") return p.sellerSlug !== "inhouse"
    return true
  })

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-red-950 text-white py-12 px-4 border-b border-red-900/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              Live Auction Marketplace
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Exclusive Collectibles & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300">
                Rare Bidding Events
              </span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Place competitive bids on certified luxury items, vintage timepieces, and high-demand flagship merchandise with guaranteed authenticity and escrow protection.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Certified Authentic
              </span>
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" /> Transparent Real-Time Bids
              </span>
              <span className="flex items-center gap-1.5">
                <Gavel className="w-4 h-4 text-red-400" /> Buyer Escrow Protection
              </span>
            </div>
          </div>

          <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Featured Live Lot
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-600 text-white font-bold animate-pulse">
                CLOSING SOON
              </span>
            </div>
            {products[0] && (
              <div className="space-y-3">
                <div className="h-44 rounded-xl overflow-hidden relative border border-white/10">
                  <Image
                    src={products[0].thumbnail}
                    alt={products[0].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base line-clamp-1">{products[0].name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Current High Bid</span>
                      <span className="text-2xl font-black text-amber-400">${products[0].currentBid}</span>
                    </div>
                    <Link
                      href={`/auction-product/${products[0].slug}`}
                      className="px-4 py-2 bg-[#d43533] hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
                    >
                      Bid Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Catalog */}
      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-6">
        {/* Filter bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Auctions ({products.length})
            </button>
            <button
              onClick={() => setFilter("inhouse")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === "inhouse"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              In-House Exclusive
            </button>
            <button
              onClick={() => setFilter("seller")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === "seller"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Merchant Auctions
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item) => {
            const endDate = new Date(item.auctionEndDate)
            const isClosed = endDate.getTime() < Date.now()
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image */}
                <div className="h-52 bg-slate-100 relative overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-600 text-white flex items-center gap-1 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      Live Bid
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-sm text-white text-xs font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-300 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Ends
                    </span>
                    <span className="text-amber-300 font-bold">{endDate.toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {item.sellerName}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5 hover:text-[#d43533] transition-colors">
                      <Link href={`/auction-product/${item.slug}`}>{item.name}</Link>
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Current High Bid</span>
                      <span className="text-lg font-black text-[#d43533]">${item.currentBid}</span>
                      <span className="text-[10px] text-slate-400 block">{item.totalBids} bids placed</span>
                    </div>
                    <Link
                      href={`/auction-product/${item.slug}`}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-[#d43533] text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Gavel className="w-3.5 h-3.5" /> Bid
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
