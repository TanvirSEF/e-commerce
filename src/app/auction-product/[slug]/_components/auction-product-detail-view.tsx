"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Gavel,
  ShieldCheck,
  Clock,
  Award,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react"
import { placeAuctionBidAction } from "@/app/actions/ecommerce-actions"
import type { AuctionBid, AuctionProduct } from "@/db/schema/auction"

interface AuctionProductDetailViewProps {
  product: AuctionProduct
  initialBids: AuctionBid[]
}

export function AuctionProductDetailView({ product, initialBids }: AuctionProductDetailViewProps) {
  const [bids, setBids] = useState(initialBids)
  const [currentBid, setCurrentBid] = useState(product.currentBid)
  const [totalBids, setTotalBids] = useState(product.totalBids)

  const minBidAllowed = (parseFloat(currentBid) + parseFloat(product.minBidIncrement)).toFixed(2)
  const [bidAmount, setBidAmount] = useState(minBidAllowed)
  const [bidderName, setBidderName] = useState("John Doe")
  const [bidderEmail, setBidderEmail] = useState("johndoe@example.com")
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null)

  const endDate = new Date(product.auctionEndDate)
  const isEnded = endDate.getTime() < Date.now()

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)

    if (parseFloat(bidAmount) < parseFloat(minBidAllowed)) {
      setFeedback({
        success: false,
        message: `Your bid must be at least $${minBidAllowed}`,
      })
      return
    }

    setSubmitting(true)
    try {
      const res = await placeAuctionBidAction(product.id, bidderName, bidderEmail, bidAmount)
      if (res.success && res.bid) {
        setBids([res.bid, ...bids])
        setCurrentBid(res.bid.amount)
        setTotalBids((prev) => prev + 1)
        const nextMin = (parseFloat(res.bid.amount) + parseFloat(product.minBidIncrement)).toFixed(2)
        setBidAmount(nextMin)
        setFeedback({ success: true, message: res.message })
      } else {
        setFeedback({ success: false, message: res.message || "Failed to place bid" })
      }
    } catch (err) {
      setFeedback({ success: false, message: "An error occurred placing bid" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-800">Home</Link>
          <span>/</span>
          <Link href="/auction-products" className="hover:text-slate-800">Auction Marketplace</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image & Authenticity */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm overflow-hidden">
              <div className="h-96 sm:h-[480px] rounded-xl overflow-hidden relative bg-slate-100 border border-slate-100">
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600 text-white flex items-center gap-1.5 shadow">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    Live Bidding
                  </span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Lot Provenance & Description
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description || "Certified authentic collectible lot verified by platform curators."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">100% Authenticity Guarantee</h4>
                    <p className="text-[11px] text-slate-500">Inspected and verified before dispatch.</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Escrow Payment Protection</h4>
                    <p className="text-[11px] text-slate-500">Funds released only after inspection.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bidding Desk */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Offered By {product.sellerName}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
                  {product.name}
                </h1>
              </div>

              {/* Price & Bid status */}
              <div className="bg-red-50/50 rounded-xl p-4 border border-red-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block font-medium">Current High Bid</span>
                    <span className="text-3xl font-black text-[#d43533]">${currentBid}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block font-medium">Starting Reserve</span>
                    <span className="text-sm font-bold text-slate-700">${product.startingBid}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-red-100/60 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-medium">
                    <Gavel className="w-3.5 h-3.5 text-[#d43533]" /> {totalBids} Total Bids Placed
                  </span>
                  <span className="font-semibold text-amber-700">
                    Min Increment: +${product.minBidIncrement}
                  </span>
                </div>
              </div>

              {/* Countdown Banner */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-300 font-medium">Auction Closes:</span>
                </div>
                <span className="text-xs font-bold text-amber-400">
                  {endDate.toLocaleDateString()} at {endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {/* Bidding Form */}
              {!isEnded ? (
                <form onSubmit={handlePlaceBid} className="space-y-4 pt-2">
                  {feedback && (
                    <div
                      className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                        feedback.success
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {feedback.success ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      )}
                      <span>{feedback.message}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">Your Bid Amount ($)</label>
                      <span className="text-[11px] text-slate-500">Min required: ${minBidAllowed}</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min={minBidAllowed}
                        required
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 text-base font-bold text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">Bidder Name</label>
                      <input
                        type="text"
                        required
                        value={bidderName}
                        onChange={(e) => setBidderName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#d43533]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">Bidder Email</label>
                      <input
                        type="email"
                        required
                        value={bidderEmail}
                        onChange={(e) => setBidderEmail(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#d43533]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#d43533] hover:bg-red-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <Gavel className="w-4 h-4" />
                    {submitting ? "Placing Offer..." : `Place Bid for $${bidAmount}`}
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    By bidding, you enter into a legally binding contract to purchase if you are the highest bidder.
                  </p>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-slate-100 text-center text-slate-600 text-sm font-semibold">
                  This auction has ended.
                </div>
              )}
            </div>

            {/* Live Bids History */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center justify-between">
                <span>Recent Bid History</span>
                <span className="text-xs text-slate-400 font-normal">{bids.length} Offers</span>
              </h3>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {bids.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Be the first to place a bid!</p>
                ) : (
                  bids.map((b, idx) => (
                    <div
                      key={b.id}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-xs ${
                        idx === 0
                          ? "bg-amber-50/70 border border-amber-200 font-medium"
                          : "bg-slate-50 border border-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {idx === 0 && <Award className="w-4 h-4 text-amber-600 shrink-0" />}
                        <span className="text-slate-800 font-semibold">{b.userName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">${b.amount}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(b.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
