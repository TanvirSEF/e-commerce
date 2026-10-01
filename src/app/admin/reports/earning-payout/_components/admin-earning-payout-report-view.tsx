"use client"

import React from "react"
import { DollarSign, TrendingUp, ShoppingBag, Store, FolderTree, Tag, ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { EarningPayoutReportData } from "@/services/report-service"

interface AdminEarningPayoutReportViewProps {
  data: EarningPayoutReportData
}

export function AdminEarningPayoutReportView({ data }: AdminEarningPayoutReportViewProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#d43533]" />
          Earning Report
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Platform-wide financial reconciliation of all-time sales GMV, seller withdrawals, categories, and monthly net profits
        </p>
      </div>

      {/* Top Metric Cards (1:1 with Laravel earning_payout_report.blade.php) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales Alltime */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Sales Alltime</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              ${data.totalSalesAlltime.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Sales this month</span>
            <span className="font-bold text-emerald-600">${data.salesThisMonth.toLocaleString()}</span>
          </div>
        </div>

        {/* Payouts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Payouts</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#d43533] flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              ${data.totalPayouts.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Payouts this month</span>
            <span className="font-bold text-rose-600">${data.payoutThisMonth.toLocaleString()}</span>
          </div>
        </div>

        {/* Total Categories */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Categories</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FolderTree className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {data.totalCategories}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Product Taxonomy</span>
            <span className="font-semibold text-slate-700">Level 1 - 3</span>
          </div>
        </div>

        {/* Total Brands */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Brands</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {data.totalBrands}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Verified Partners</span>
            <span className="font-semibold text-slate-700">Official</span>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">
            Monthly Financial Reconciliation
          </h2>
          <span className="text-xs text-slate-500">Fiscal Year 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3 text-right">Gross GMV Sales</th>
                <th className="px-4 py-3 text-right">Seller Payouts</th>
                <th className="px-4 py-3 text-right">Admin Commission</th>
                <th className="px-4 py-3 text-right">Courier / Delivery</th>
                <th className="px-4 py-3 text-right">Net Platform Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {data.monthlyData.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{row.month}</td>
                  <td className="px-4 py-3.5 text-right font-medium text-slate-900">
                    ${row.grossSales.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-rose-600">
                    -${row.sellerPayouts.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-indigo-600">
                    +${row.adminCommission.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-slate-600">
                    +${row.deliveryFees.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-emerald-600">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ArrowUpRight className="w-3 h-3" />
                      ${row.netPlatformProfit.toLocaleString()}
                    </span>
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
