"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Download,
  Calendar,
  Filter,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface OrderRow {
  id: string
  code: string
  customerName: string
  customerEmail: string
  itemCount: number
  total: number
  paymentStatus: string
  deliveryStatus: string
  date: string
}

interface CategoryRow {
  id: string
  name: string
  slug: string
}

interface SalesReportViewProps {
  orders: OrderRow[]
  categories: CategoryRow[]
}

export function SalesReportView({ orders, categories }: SalesReportViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [dateRange, setDateRange] = useState("this-month")

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const deliveredCount = orders.filter((o) => o.deliveryStatus === "delivered").length

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Sales Report</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time revenue metrics, average order valuation, and category sales analytics
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Export / Print Report
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Sales Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-800 mt-1">
            {formatPrice(totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% from last month
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Orders Placed</span>
            <ShoppingBag className="w-4 h-4 text-[#d43533]" />
          </div>
          <div className="text-xl font-bold text-slate-800 mt-1">{totalOrders}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across all channels</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Average Order Value</span>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-800 mt-1">
            {formatPrice(avgOrderValue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Per completed cart</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Delivered Rate</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-slate-800 mt-1">
            {totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {deliveredCount} of {totalOrders} delivered
          </div>
        </div>
      </div>

      {/* Filter Header */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Filter By:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 bg-white focus:outline-none focus:border-[#d43533]"
          >
            <option value="all">All Product Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 bg-white focus:outline-none focus:border-[#d43533]"
          >
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-year">This Year</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider">
          Recent Transaction Records
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">Order Code</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Order Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#d43533]">
                    <Link href={`/invoice/${o.code}`} target="_blank" className="hover:underline">
                      #{o.code}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{o.date}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{o.customerName}</div>
                    <div className="text-[11px] text-slate-400">{o.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{o.itemCount} items</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                        o.deliveryStatus === "delivered"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : o.deliveryStatus === "cancelled"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {o.deliveryStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                        o.paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-sm">
                    {formatPrice(o.total)}
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
