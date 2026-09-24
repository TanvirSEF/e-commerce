"use client"

import React, { useState } from "react"
import { type SellerSaleReportItem } from "@/services/report-service"
import { formatPrice } from "@/lib/utils"
import { CheckCircle2, XCircle, Store, TrendingUp } from "lucide-react"

interface SellerSalesViewProps {
  initialReport: SellerSaleReportItem[]
  currentFilter?: string
}

export function SellerSalesView({ initialReport, currentFilter = "" }: SellerSalesViewProps) {
  const [filterStatus, setFilterStatus] = useState(currentFilter)
  const [report, setReport] = useState<SellerSaleReportItem[]>(initialReport)

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault()
    if (filterStatus === "1") {
      setReport(initialReport.filter((s) => s.isVerified))
    } else if (filterStatus === "0") {
      setReport(initialReport.filter((s) => !s.isVerified))
    } else {
      setReport(initialReport)
    }
  }

  const totalSales = report.reduce((sum, item) => sum + item.totalSalesCount, 0)
  const totalRevenue = report.reduce((sum, item) => sum + item.totalRevenue, 0)

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Seller Based Selling Report</h1>
        <p className="text-xs text-gray-500 mt-1">Analytics on seller sales performance, units sold, and revenue</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-red-50 text-[#d43533] rounded-lg">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Active Sellers</p>
            <p className="text-lg font-bold text-gray-800">{report.length}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Units Sold</p>
            <p className="text-lg font-bold text-gray-800">{totalSales.toLocaleString()} Units</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <span className="text-lg font-bold">৳</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Gross Volume</p>
            <p className="text-lg font-bold text-emerald-600">{formatPrice(totalRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Filter Form matching Active eCommerce CMS 1:1 */}
        <div className="p-6 border-b border-gray-200 bg-[#fafbfc]">
          <form onSubmit={handleFilter} className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 max-w-xl mx-auto">
            <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">
              Sort by verification status :
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white text-gray-700 w-full sm:w-56 focus:border-[#d43533]"
            >
              <option value="">All Statuses</option>
              <option value="1">Approved / Verified</option>
              <option value="0">Non-Approved</option>
            </select>
            <button
              type="submit"
              className="px-5 py-2 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Seller Name</th>
                <th className="py-3 px-4">Shop Name</th>
                <th className="py-3 px-4">Number of Product Sale</th>
                <th className="py-3 px-4 text-right">Order Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {report.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    No seller sales data found matching this filter.
                  </td>
                </tr>
              ) : (
                report.map((item) => (
                  <tr key={item.sellerId} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      <div className="flex items-center gap-2">
                        <span>{item.sellerName}</span>
                        {item.isVerified ? (
                          <span title="Verified">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          </span>
                        ) : (
                          <span title="Unverified">
                            <XCircle className="w-3.5 h-3.5 text-gray-300" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">{item.shopName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700">
                      {item.totalSalesCount} sales
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                      {formatPrice(item.totalRevenue)}
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
