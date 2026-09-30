"use client"

import React from "react"
import { RotateCcw, Clock, CheckCircle2, XCircle, Banknote } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface RefundRequestsHeaderProps {
  stats: {
    total: number
    pending: number
    approved: number
    rejected: number
    totalAmount: number
  }
}

export function RefundRequestsHeader({ stats }: RefundRequestsHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-red-50 text-[#d43533] flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </span>
            Refund Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit customer return & refund requests, verify reasons, and issue wallet balances
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Total */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Requests
            </span>
            <RotateCcw className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1.5">{stats.total}</div>
        </div>

        {/* Pending */}
        <div className="bg-white border border-amber-200 rounded-lg p-3.5 shadow-sm bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Pending Review
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1.5">{stats.pending}</div>
        </div>

        {/* Approved */}
        <div className="bg-white border border-emerald-200 rounded-lg p-3.5 shadow-sm bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Approved / Paid
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1.5">{stats.approved}</div>
        </div>

        {/* Rejected */}
        <div className="bg-white border border-red-200 rounded-lg p-3.5 shadow-sm bg-gradient-to-br from-white to-red-50/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">
              Rejected
            </span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-600 mt-1.5">{stats.rejected}</div>
        </div>

        {/* Total Amount Refunded */}
        <div className="bg-white border border-blue-200 rounded-lg p-3.5 shadow-sm bg-gradient-to-br from-white to-blue-50/40 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              Total Refunded
            </span>
            <Banknote className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-black text-blue-700 mt-1.5 whitespace-nowrap">
            {formatPrice(stats.totalAmount)}
          </div>
        </div>
      </div>
    </div>
  )
}
