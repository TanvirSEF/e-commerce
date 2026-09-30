"use client"

import React from "react"
import { Clock, CheckCircle, DollarSign } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface PayoutMetricsCardsProps {
  pendingCount: number
  totalPending: number
  paidCount: number
  totalPaid: number
}

export function PayoutMetricsCards({
  pendingCount,
  totalPending,
  paidCount,
  totalPaid,
}: PayoutMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium">Pending Requests</div>
          <div className="text-xl font-bold text-slate-800">{pendingCount}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-50 text-[#d43533] flex items-center justify-center">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium">Total Pending Amount</div>
          <div className="text-xl font-bold text-slate-800">{formatPrice(totalPending)}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium">
            Settled Payouts ({paidCount})
          </div>
          <div className="text-xl font-bold text-slate-800">{formatPrice(totalPaid)}</div>
        </div>
      </div>
    </div>
  )
}
