"use client"

import React from "react"
import Link from "next/link"

interface DashboardInhouseAnalyticsProps {
  totalInhouseSale: number
  inhouseProductsCount: number
  inhouseRating: number
  totalInhouseOrders: number
  paymentDistribution: {
    paymentType: string
    totalAmount: number
  }[]
}

export function DashboardInhouseAnalytics({
  totalInhouseSale,
  inhouseProductsCount,
  inhouseRating,
  totalInhouseOrders,
  paymentDistribution,
}: DashboardInhouseAnalyticsProps) {
  const totalPayment = paymentDistribution.reduce((acc, p) => acc + p.totalAmount, 0) || 1

  return (
    <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: In-house Sales & Payment breakdown */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-800">In-house Store</h2>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Direct Sales</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              ৳{totalInhouseSale.toLocaleString()}
            </h1>
            <p className="text-xs text-slate-500 font-medium">Total In-house Revenue</p>
          </div>

          {/* Payment Type Distribution Progress Bars */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Payment Method Breakdown
            </h4>
            <div className="space-y-2 text-xs">
              {paymentDistribution.map((item, idx) => {
                const percent = Math.round((item.totalAmount / totalPayment) * 100) || 0
                const colors = [
                  "bg-rose-500 text-rose-600",
                  "bg-blue-500 text-blue-600",
                  "bg-amber-500 text-amber-600",
                ]
                const color = colors[idx % colors.length]
                const label = item.paymentType.replace(/_/g, " ").toUpperCase()

                return (
                  <div key={item.paymentType}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-600">{label}</span>
                      <span className="font-bold text-slate-800">
                        ৳{item.totalAmount.toLocaleString()} ({percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color.split(" ")[0]}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <Link
              href="/admin/orders"
              className="inline-block text-center w-full py-2.5 px-4 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold rounded text-xs transition-colors"
            >
              All In-house Orders
            </Link>
          </div>
        </div>

        {/* Right Column: 3 Metric Cards */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          {/* Card 1: In-house Products */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-sm p-4 h-[100px] flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800">{inhouseProductsCount}</h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">In-house Products</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100/60 text-blue-600 flex items-center justify-center font-bold text-sm">
              📦
            </div>
          </div>

          {/* Card 2: Rating */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-sm p-4 h-[100px] flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800">{inhouseRating.toFixed(2)}</h2>
              <p className="text-xs font-semibold text-amber-600 mt-0.5">Average Store Rating</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100/60 text-amber-600 flex items-center justify-center font-bold text-sm">
              ★
            </div>
          </div>

          {/* Card 3: Total Orders */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-sm p-4 h-[100px] flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800">{totalInhouseOrders}</h2>
              <p className="text-xs font-semibold text-emerald-600 mt-0.5">Total In-house Orders</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center font-bold text-sm">
              ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
