"use client"

import React, { useState } from "react"
import Link from "next/link"
import type { MonthlySalesPoint, SellerOverviewItem } from "@/services/admin-dashboard-service"

interface DashboardSalesSellersProps {
  totalSales: number
  saleThisMonth: number
  inhouseSaleThisMonth: number
  sellerSaleThisMonth: number
  yearlySalesStat: MonthlySalesPoint[]
  totalSellers: number
  approvedSellersCount: number
  pendingSellersCount: number
  topSellers: SellerOverviewItem[]
}

function SafeAvatar({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false)
  return (
    <img
      src={error ? "/assets/img/avatar-place.png" : src}
      alt={alt}
      onError={() => setError(true)}
      className="w-full h-full object-cover"
    />
  )
}

export function DashboardSalesSellers({
  totalSales,
  saleThisMonth,
  inhouseSaleThisMonth,
  sellerSaleThisMonth,
  yearlySalesStat,
  totalSellers,
  approvedSellersCount,
  pendingSellersCount,
  topSellers,
}: DashboardSalesSellersProps) {
  const [hoveredMonth, setHoveredMonth] = useState<MonthlySalesPoint | null>(null)

  // Compute SVG line chart coordinates
  const maxSale = Math.max(...yearlySalesStat.map((p) => p.sales), 1000)
  const chartHeight = 120
  const chartWidth = 360
  const paddingX = 15
  const stepX = (chartWidth - paddingX * 2) / (yearlySalesStat.length - 1)

  const points = yearlySalesStat.map((p, idx) => {
    const x = paddingX + idx * stepX
    const y = chartHeight - (p.sales / maxSale) * (chartHeight - 20) - 10
    return { x, y, ...p }
  })

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`
  }, "")

  const fillD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Total Sales Box (470px Height, Active eCommerce 1:1) */}
      <div className="bg-[#f0f7ff] border border-blue-100 rounded-sm p-6 flex flex-col justify-between h-[470px] shadow-xs">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">
                ৳{totalSales.toLocaleString()}
              </h1>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Sale this month</span>
              <span className="text-base font-bold text-blue-600">৳{saleThisMonth.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Sales Stat</h4>
              {hoveredMonth && (
                <span className="text-xs font-semibold text-slate-700 bg-white/80 px-2 py-0.5 rounded shadow-xs">
                  {hoveredMonth.month}: ৳{hoveredMonth.sales.toLocaleString()}
                </span>
              )}
            </div>

            {/* SVG Interactive Line Chart */}
            <div className="w-full bg-white/60 rounded p-2 border border-blue-100/50">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-32 overflow-visible">
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#009ef7" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#009ef7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={fillD} fill="url(#salesGrad)" />
                <path d={pathD} fill="none" stroke="#009ef7" strokeWidth="2.5" strokeLinecap="round" />
                {points.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredMonth?.month === pt.month ? 5 : 3}
                    className="fill-white stroke-[#009ef7] stroke-2 cursor-pointer transition-all hover:scale-125"
                    onMouseEnter={() => setHoveredMonth(pt)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  />
                ))}
              </svg>
              <div className="flex justify-between text-[9px] text-slate-400 mt-1 px-1">
                {yearlySalesStat.map((m) => (
                  <span key={m.month}>{m.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer: In-house vs Sellers breakdown */}
        <div className="pt-4 border-t border-blue-200/60 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2 shrink-0"></span>
              In-house Sales
            </span>
            <span className="font-bold text-slate-900">৳{inhouseSaleThisMonth.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 shrink-0"></span>
              Sellers Sales
            </span>
            <span className="font-bold text-slate-900">৳{sellerSaleThisMonth.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 2. Total Sellers Box (470px Height, Active eCommerce 1:1) */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 flex flex-col justify-between h-[470px] shadow-xs">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">{totalSellers}</h1>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sellers</h3>
            </div>
            <div className="space-y-1 text-right text-xs">
              <div className="flex items-center justify-end space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-slate-500">Approved:</span>
                <span className="font-bold text-slate-800">{approvedSellersCount}</span>
              </div>
              <div className="flex items-center justify-end space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-slate-500">Pending:</span>
                <span className="font-bold text-slate-800">{pendingSellersCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center text-xs font-semibold text-slate-700 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
              <span>Top Sellers</span>
            </div>
            <div className="flex items-center -space-x-2 overflow-hidden mb-4">
              {topSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden bg-slate-100"
                  title={`${seller.name} (৳${seller.totalSales.toLocaleString()})`}
                >
                  <SafeAvatar src={seller.avatar} alt={seller.name} />
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50 rounded text-xs text-slate-600 border border-slate-100">
              <p className="font-semibold text-slate-800">{topSellers[0]?.name || "Active Fashion Outlet"}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Leading vendor with verified store rating</p>
            </div>
          </div>
        </div>

        {/* Action Buttons (Active eCommerce 1:1) */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <Link
            href="/admin/sellers"
            className="block text-center w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded text-xs transition-colors"
          >
            All Sellers
          </Link>
          <Link
            href="/admin/sellers?approved_status=0"
            className="block text-center w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded text-xs transition-colors"
          >
            Pending Sellers
          </Link>
        </div>
      </div>
    </div>
  )
}
