"use client"

import React from "react"
import {
  ShoppingBag,
  XCircle,
  Truck,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface SellerAnalyticsRowProps {
  last7DaysSales: { date: string; total: number }[]
  thisMonthSoldAmount: number
  previousMonthSoldAmount: number
  categoryProductCounts: { id: number; name: string; count: number }[]
  thisMonthOrders: {
    pending: number
    cancelled: number
    onTheWay: number
    delivered: number
  }
  verificationStatus: boolean
  onOpenVerificationModal: () => void
}

export function SellerAnalyticsRow({
  last7DaysSales,
  thisMonthSoldAmount,
  previousMonthSoldAmount,
  categoryProductCounts,
  thisMonthOrders,
  verificationStatus,
  onOpenVerificationModal,
}: SellerAnalyticsRowProps) {
  const maxSale = Math.max(...last7DaysSales.map((s) => s.total), 1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Sales Stat & Sold Amount Card */}
      <div className="flex flex-col gap-4">
        {/* Sales Stat Bar Chart */}
        <div className="rounded-lg bg-red-50/40 border border-red-100/60 p-4 shadow-xs">
          <h4 className="text-sm font-bold text-[#d43533] mb-3">Sales Stat</h4>
          <div className="h-32 flex items-end justify-between gap-1.5 pt-4">
            {last7DaysSales.map((item, idx) => {
              const heightPct = Math.max(8, Math.round((item.total / maxSale) * 100))
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                  <div
                    className="w-full bg-[#d43533] rounded-t transition-all hover:bg-[#b82a28]"
                    style={{ height: `${heightPct}%` }}
                    title={`${item.date}: ${formatPrice(item.total)}`}
                  />
                  <span className="text-[10px] text-gray-500 truncate w-full text-center">
                    {item.date.split(" ")[0]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sold Amount */}
        <div className="rounded-lg bg-red-50/40 border border-red-100/60 p-4 shadow-xs">
          <h4 className="text-sm font-bold text-[#d43533] mb-1">Sold Amount</h4>
          <p className="text-[11px] text-gray-600 mb-1">Your Sold Amount (Current month)</p>
          <div className="text-2xl font-black text-[#d43533]">
            {formatPrice(thisMonthSoldAmount)}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Last Month: <span className="font-semibold text-gray-700">{formatPrice(previousMonthSoldAmount)}</span>
          </p>
        </div>
      </div>

      {/* 2. Category Wise Product Count */}
      <div className="rounded-lg bg-white border border-gray-200 p-5 shadow-xs flex flex-col">
        <h4 className="text-sm font-bold text-[#d43533] pb-3 border-b border-gray-100">
          Category wise product count
        </h4>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 mt-1 max-h-[300px]">
          {categoryProductCounts.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              No products categorized yet.
            </div>
          ) : (
            categoryProductCounts.map((cat) => (
              <div key={cat.id} className="py-2.5 flex items-center justify-between text-xs">
                <span className="text-gray-700 font-medium truncate pr-2">{cat.name}</span>
                <span className="font-bold text-[#d43533] bg-red-50 px-2 py-0.5 rounded-full text-[11px] shrink-0">
                  {cat.count}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Orders (This Month) */}
      <div className="rounded-lg bg-white border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#d43533]">Orders</h4>
          <p className="text-[11px] text-gray-400 mb-4">This Month</p>

          <div className="space-y-4">
            {/* New Order (Pending) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700">New Order</span>
              </div>
              <span className="text-sm font-black text-gray-700">{thisMonthOrders.pending}</span>
            </div>

            {/* Cancelled */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                  <XCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700">Cancelled</span>
              </div>
              <span className="text-sm font-black text-gray-700">{thisMonthOrders.cancelled}</span>
            </div>

            {/* On Delivery */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700">On Delivery</span>
              </div>
              <span className="text-sm font-black text-gray-700">{thisMonthOrders.onTheWay}</span>
            </div>

            {/* Delivered */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700">Delivered</span>
              </div>
              <span className="text-sm font-black text-gray-700">{thisMonthOrders.delivered}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Verification Status Card */}
      <div className="rounded-lg bg-white border border-gray-200 p-5 shadow-xs flex flex-col items-center justify-center text-center">
        {verificationStatus ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-4 border-emerald-100">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Verified Seller</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                Your store documents and identity have been verified by the administrator.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
              Active Store Status
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border-4 border-amber-100">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Non-Verified Store</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-[220px]">
                Complete identity and tax verification to publish products without restrictions.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenVerificationModal}
              className="mt-1 inline-flex items-center justify-center rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#b82a28] transition-colors shadow-sm"
            >
              Verify Now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
