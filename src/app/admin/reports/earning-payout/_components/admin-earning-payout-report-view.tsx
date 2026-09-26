"use client"

import React, { useState } from "react"
import { DollarSign, TrendingUp, ArrowDownRight, ArrowUpRight, Calendar } from "lucide-react"

interface EarningMonth {
  month: string
  grossSales: string
  sellerPayouts: string
  adminCommission: string
  deliveryFees: string
  netPlatformProfit: string
}

const MOCK_FINANCIAL_MONTHS: EarningMonth[] = [
  {
    month: "September 2026",
    grossSales: "48,250.00",
    sellerPayouts: "38,600.00",
    adminCommission: "4,825.00",
    deliveryFees: "1,240.00",
    netPlatformProfit: "6,065.00",
  },
  {
    month: "August 2026",
    grossSales: "42,100.00",
    sellerPayouts: "33,680.00",
    adminCommission: "4,210.00",
    deliveryFees: "1,110.00",
    netPlatformProfit: "5,320.00",
  },
  {
    month: "July 2026",
    grossSales: "39,800.00",
    sellerPayouts: "31,840.00",
    adminCommission: "3,980.00",
    deliveryFees: "980.00",
    netPlatformProfit: "4,960.00",
  },
]

export function AdminEarningPayoutReportView() {
  const [months] = useState(MOCK_FINANCIAL_MONTHS)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-[#d43533]" />
          Platform Earnings vs Payouts Summary
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monthly financial reconciliation of gross GMV, seller withdrawals, courier fees, and net retained profits
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Q3 Gross GMV Sales</span>
          <div className="text-2xl font-black text-slate-900">$130,150.00</div>
          <span className="text-[11px] text-emerald-600 font-medium">+14.2% quarter-over-quarter</span>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Seller Payouts Disbursed</span>
          <div className="text-2xl font-black text-slate-700">$104,120.00</div>
          <span className="text-[11px] text-slate-400">Merchant settlement</span>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Net Retained Marketplace Profit</span>
          <div className="text-2xl font-black text-emerald-600">$16,345.00</div>
          <span className="text-[11px] text-emerald-600 font-medium">Commission + Subscriptions + Delivery</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Monthly P&L Ledger Breakdown</h2>
          <span className="text-xs text-slate-500 font-medium">Active FY2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Month</th>
                <th className="px-4 py-3.5">Gross Sales</th>
                <th className="px-4 py-3.5">Seller Payouts</th>
                <th className="px-4 py-3.5">Commission Revenue</th>
                <th className="px-4 py-3.5">Courier Fees</th>
                <th className="px-4 py-3.5 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {months.map((m) => (
                <tr key={m.month} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900">{m.month}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-700">${m.grossSales}</td>
                  <td className="px-4 py-3.5 text-slate-500">${m.sellerPayouts}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">${m.adminCommission}</td>
                  <td className="px-4 py-3.5 text-slate-600">${m.deliveryFees}</td>
                  <td className="px-4 py-3.5 text-right font-black text-emerald-600 text-base">
                    ${m.netPlatformProfit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
