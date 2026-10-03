"use client"

import React from "react"
import Link from "next/link"
import { Percent, Wallet, Store, CreditCard, ArrowRight } from "lucide-react"

interface SellerActionCardsProps {
  commissionSetting: {
    type: "fixed_rate" | "seller_based" | "category_based" | "none"
    rate: number
  }
}

export function SellerActionCards({ commissionSetting }: SellerActionCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Commission Type & Rate */}
      <div className="rounded-lg bg-white border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
            <Percent className="w-4 h-4 text-[#d43533]" />
            <h4 className="text-sm font-bold text-[#d43533]">Commission Type & Rate</h4>
          </div>

          <div className="py-2 text-xs text-gray-700">
            {commissionSetting.type === "fixed_rate" && (
              <p>
                You are Under Fixed Commission.
                <span className="block mt-1 font-bold text-gray-900 text-sm">
                  Commission Rate: {commissionSetting.rate}%
                </span>
              </p>
            )}
            {commissionSetting.type === "seller_based" && (
              <p>
                You are Under Seller Based Commission.
                <span className="block mt-1 font-bold text-gray-900 text-sm">
                  Commission Rate: {commissionSetting.rate}%
                </span>
              </p>
            )}
            {commissionSetting.type === "category_based" && (
              <div>
                <p>You are Under Category Wise Commission Rate.</p>
                <Link
                  href="/seller/category-commission"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#d43533] hover:underline"
                >
                  View Details <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
            {commissionSetting.type === "none" && (
              <p className="text-gray-500">Currently No Commission System is Set by Admin.</p>
            )}
          </div>
        </div>

        <p className="text-[11px] text-gray-400 mt-3 pt-3 border-t border-gray-100">
          Standard platform commission deducted per completed order.
        </p>
      </div>

      {/* 2. Money Withdraw */}
      <Link
        href="/seller/money-withdraw-requests"
        className="rounded-lg bg-red-50/50 border border-red-100/70 p-5 shadow-xs flex flex-col items-center justify-center text-center group hover:bg-red-50 transition-all"
      >
        <div className="w-14 h-14 rounded-full bg-white text-[#d43533] flex items-center justify-center shadow-xs mb-3 group-hover:scale-105 transition-transform">
          <Wallet className="w-7 h-7" />
        </div>
        <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#d43533] transition-colors">
          Money Withdraw
        </h4>
        <p className="text-xs text-gray-500 mt-1">Request payout to bank or mobile wallet</p>
      </Link>

      {/* 3. Shop Settings */}
      <div className="rounded-lg bg-red-50/50 border border-red-100/70 p-5 shadow-xs flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-white text-[#d43533] flex items-center justify-center shadow-xs mb-3">
          <Store className="w-7 h-7" />
        </div>
        <h4 className="text-sm font-bold text-gray-900 mb-1">Shop Settings</h4>
        <p className="text-xs text-gray-500 mb-3">Configure store banner, logo, and metadata</p>
        <Link
          href="/seller/shop"
          className="rounded bg-[#d43533] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#b82a28] transition-colors shadow-xs"
        >
          Go to setting
        </Link>
      </div>

      {/* 4. Payment Settings */}
      <div className="rounded-lg bg-red-50/50 border border-red-100/70 p-5 shadow-xs flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-white text-[#d43533] flex items-center justify-center shadow-xs mb-3">
          <CreditCard className="w-7 h-7" />
        </div>
        <h4 className="text-sm font-bold text-gray-900 mb-1">Payment Settings</h4>
        <p className="text-xs text-gray-500 mb-3">Setup bank account or mobile wallet for payouts</p>
        <Link
          href="/seller/profile"
          className="rounded bg-[#d43533] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#b82a28] transition-colors shadow-xs"
        >
          Configure Now
        </Link>
      </div>
    </div>
  )
}
