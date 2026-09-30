"use client"

import React from "react"

interface AuctionCreatePricingCardProps {
  startingBid: string
  setStartingBid: (v: string) => void
  minBidIncrement: string
  setMinBidIncrement: (v: string) => void
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
}

export function AuctionCreatePricingCard({
  startingBid,
  setStartingBid,
  minBidIncrement,
  setMinBidIncrement,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: AuctionCreatePricingCardProps) {
  return (
    <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
      <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
        <h5 className="mb-0 text-sm font-semibold text-gray-800">Bidding & Timing Configuration</h5>
      </div>
      <div className="card-body p-4 space-y-4">
        {/* Starting Bid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
            Starting Bid ($/৳) <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-9 space-y-1">
            <input
              type="number"
              min="1"
              step="0.01"
              required
              placeholder="100.00"
              value={startingBid}
              onChange={(e) => setStartingBid(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
            <p className="text-[11px] text-gray-400">
              The opening base bid required to start the auction.
            </p>
          </div>
        </div>

        {/* Minimum Bid Increment */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
            Min Bid Increment ($/৳) <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-9 space-y-1">
            <input
              type="number"
              min="1"
              step="0.01"
              required
              placeholder="10.00"
              value={minBidIncrement}
              onChange={(e) => setMinBidIncrement(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
            />
            <p className="text-[11px] text-gray-400">
              Next bidders must outbid the current price by at least this increment.
            </p>
          </div>
        </div>

        {/* Start Date & End Date */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
            Auction Window <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
