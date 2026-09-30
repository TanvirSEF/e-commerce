"use client"

import React from "react"
import { Store, ShieldCheck, DollarSign } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface SellerMetricsCardsProps {
  totalSellers: number
  verifiedCount: number
  totalDue: number
}

export function SellerMetricsCards({
  totalSellers,
  verifiedCount,
  totalDue,
}: SellerMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-50 text-[#d43533] flex items-center justify-center">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium">Total Sellers</div>
          <div className="text-xl font-bold text-slate-800">{totalSellers}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium">Verified Stores</div>
          <div className="text-xl font-bold text-slate-800">
            {verifiedCount} / {totalSellers}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium">Total Due to Sellers</div>
          <div className="text-xl font-bold text-slate-800">{formatPrice(totalDue)}</div>
        </div>
      </div>
    </div>
  )
}
