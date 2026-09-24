"use client"

import React, { useState } from "react"
import {
  History,
  Search,
  Percent,
  Coins,
  Receipt,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react"

interface CommissionRecord {
  id: number | string
  orderCode: string
  orderTotal: number
  adminCommission: number
  sellerEarning: number
  commissionRate: number
  orderFrom?: string
  createdAt: string
}

interface SellerCommissionHistoryViewProps {
  commissionType: "fixed_rate" | "seller_based" | "category_based"
  rate: number
  records: CommissionRecord[]
}

export function SellerCommissionHistoryView({
  commissionType,
  rate,
  records: initialRecords,
}: SellerCommissionHistoryViewProps) {
  const [records, setRecords] = useState<CommissionRecord[]>(initialRecords)
  const [search, setSearch] = useState("")

  const filteredRecords = records.filter((r) =>
    r.orderCode.toLowerCase().includes(search.toLowerCase())
  )

  const totalEarnings = filteredRecords.reduce((sum, r) => sum + r.sellerEarning, 0)
  const totalCommission = filteredRecords.reduce((sum, r) => sum + r.adminCommission, 0)

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <History className="h-6 w-6 text-[#d43533]" />
          Commission & Settlement History
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Detailed ledger of marketplace platform commissions deducted and net payouts earned per order
        </p>
      </div>

      {/* Commission Status Banner (Active eCommerce CMS 1:1) */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">
              {commissionType === "fixed_rate" && `Active Policy: Fixed Marketplace Commission (${rate}%)`}
              {commissionType === "seller_based" && `Active Policy: Custom Negotiated Store Commission (${rate}%)`}
              {commissionType === "category_based" && `Active Policy: Category-Wise Tiered Commission`}
            </div>
            <p className="text-blue-700 text-[11px] mt-0.5">
              Platform fees are deducted automatically upon successful delivery completion.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-200 font-bold text-blue-800 text-xs shadow-2xs shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Verified Merchant
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Net Vendor Earnings
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">
              ৳{totalEarnings.toLocaleString("en-BD")}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            Credited to your seller balance
          </span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Platform Commission Paid
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#d43533]">
              ৳{totalCommission.toLocaleString("en-BD")}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            Marketplace maintenance & payment gateway
          </span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Completed Settlements
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">
              {filteredRecords.length}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            Processed order transactions
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">
            Commission Ledger ({filteredRecords.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#d43533]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Order Code</th>
                <th className="px-4 py-3">Gross Total</th>
                <th className="px-4 py-3">Admin Commission</th>
                <th className="px-4 py-3">Net Earning</th>
                <th className="px-4 py-3">Settlement Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No commission history records found matching &quot;{search}&quot;.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600">
                          {r.orderCode}
                        </span>
                        {r.orderFrom === "pos" && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 uppercase">
                            POS
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-900 font-semibold">
                      ৳{r.orderTotal.toLocaleString("en-BD")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-[#d43533]">
                        -৳{r.adminCommission.toLocaleString("en-BD")}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-1">({r.commissionRate}%)</span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600">
                      +৳{r.sellerEarning.toLocaleString("en-BD")}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {r.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
