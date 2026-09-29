"use client"

import React from "react"
import Link from "next/link"

interface DashboardOrderStatusProps {
  totalConfirmedOrders: number
  totalProcessedOrders: number
  totalPickedUpOrders: number
  totalShippedOrders: number
}

export function DashboardOrderStatus({
  totalConfirmedOrders,
  totalProcessedOrders,
  totalPickedUpOrders,
  totalShippedOrders,
}: DashboardOrderStatusProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-800">Order Fulfillment Status</h3>
        <Link
          href="/admin/orders"
          className="text-xs text-blue-600 font-semibold hover:underline"
        >
          View All Orders &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Confirmed Order (Soft Green) */}
        <Link
          href="/admin/orders?delivery_status=confirmed"
          className="bg-[#e8fff3] hover:bg-[#d5fae7] rounded-sm h-[90px] flex items-center justify-between px-5 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">Confirmed Order</span>
          </div>
          <h2 className="text-2xl font-black text-emerald-700">{totalConfirmedOrders}</h2>
        </Link>

        {/* 2. Processed Order (Soft Red/Rose) */}
        <Link
          href="/admin/orders?delivery_status=pending"
          className="bg-[#fff0f4] hover:bg-[#ffe3eb] rounded-sm h-[90px] flex items-center justify-between px-5 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-rose-800">Processed Order</span>
          </div>
          <h2 className="text-2xl font-black text-rose-700">{totalProcessedOrders}</h2>
        </Link>

        {/* 3. Picked Up Order (Soft Blue) */}
        <Link
          href="/admin/orders?delivery_status=picked_up"
          className="bg-[#f0f7ff] hover:bg-[#e0efff] rounded-sm h-[90px] flex items-center justify-between px-5 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-800">Picked Up Order</span>
          </div>
          <h2 className="text-2xl font-black text-blue-700">{totalPickedUpOrders}</h2>
        </Link>

        {/* 4. Order Shipped (Soft Yellow/Amber) */}
        <Link
          href="/admin/orders?delivery_status=on_the_way"
          className="bg-[#fff8dd] hover:bg-[#fff0c2] rounded-sm h-[90px] flex items-center justify-between px-5 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-amber-800">Order Shipped</span>
          </div>
          <h2 className="text-2xl font-black text-amber-700">{totalShippedOrders}</h2>
        </Link>
      </div>
    </div>
  )
}
