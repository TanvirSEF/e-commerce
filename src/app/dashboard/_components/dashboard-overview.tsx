"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/context/auth-context"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { Wallet, DollarSign, Award, ShoppingCart, Heart, Package, Copy, Check, ChevronRight } from "lucide-react"

const MOCK_RECENT_ORDERS = [
  {
    code: "20260923-847291",
    date: "23 Sep 2026",
    amount: 4760,
    deliveryStatus: "on_the_way",
    paymentStatus: "paid",
  },
  {
    code: "20260918-192842",
    date: "18 Sep 2026",
    amount: 1250,
    deliveryStatus: "delivered",
    paymentStatus: "paid",
  },
  {
    code: "20260830-671203",
    date: "30 Aug 2026",
    amount: 2440,
    deliveryStatus: "delivered",
    paymentStatus: "paid",
  },
]

export function DashboardOverview() {
  const { user, wishlist } = useAuth()
  const { totalCount } = useCart()
  const [copied, setCopied] = useState(false)

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("WELCOME10")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Coupon Alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded border border-[#3490F3] bg-blue-50/60 p-4">
        <div className="text-xs sm:text-sm text-[#1967d2]">
          Welcome Coupon <strong>10%</strong> Discount on your Purchase Within <strong>30</strong> days
          of Registration (Code: <strong>WELCOME10</strong>)
        </div>
        <button
          type="button"
          onClick={handleCopyCoupon}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-[#3490F3] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-sm"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy coupon Code"}
        </button>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wallet Balance */}
        <div className="rounded border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Wallet Balance</p>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                {formatPrice(user?.balance || 0)}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-[#1967d2]">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Instant checkout</span>
            <button
              type="button"
              className="text-xs font-bold text-[#1967d2] hover:underline"
            >
              + Recharge Wallet
            </button>
          </div>
        </div>

        {/* Total Expenditure */}
        <div className="rounded border border-gray-200 bg-[#d43533] p-5 shadow-sm text-white flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-red-100">Total Expenditure</p>
              <h3 className="text-xl font-extrabold text-white mt-1">
                {formatPrice(user?.totalExpenditure || 8450)}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
            <span className="text-[11px] text-red-100">Lifetime purchases</span>
            <Link
              href="/dashboard/purchase-history"
              className="inline-flex items-center gap-1 text-xs font-bold text-white hover:underline"
            >
              Order History <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Club Points */}
        <div className="rounded border border-gray-200 bg-[#ffc519] p-5 shadow-sm text-gray-900 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-800">Total Club Points</p>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                {user?.clubPoints || 150} pts
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/50 text-gray-900">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-900/10 flex items-center justify-between">
            <span className="text-[11px] text-gray-700">100 pts = ৳50 discount</span>
            <button
              type="button"
              className="text-xs font-bold text-gray-900 hover:underline"
            >
              Convert Points
            </button>
          </div>
        </div>
      </div>

      {/* Quick Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/cart"
          className="flex items-center gap-4 rounded border border-gray-200 bg-white p-4 shadow-sm hover:border-[#d43533] transition-colors"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#d43533]">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <div suppressHydrationWarning className="text-lg font-extrabold text-gray-900">
              {totalCount}
            </div>
            <div className="text-xs text-gray-500">Products in Cart</div>
          </div>
        </Link>

        <Link
          href="/dashboard/wishlist"
          className="flex items-center gap-4 rounded border border-gray-200 bg-white p-4 shadow-sm hover:border-[#d43533] transition-colors"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#d43533]">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <div suppressHydrationWarning className="text-lg font-extrabold text-gray-900">
              {wishlist.length}
            </div>
            <div className="text-xs text-gray-500">Products in Wishlist</div>
          </div>
        </Link>

        <Link
          href="/dashboard/purchase-history"
          className="flex items-center gap-4 rounded border border-gray-200 bg-white p-4 shadow-sm hover:border-[#d43533] transition-colors"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#d43533]">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <div suppressHydrationWarning className="text-lg font-extrabold text-gray-900">
              {user?.orderedCount || 4}
            </div>
            <div className="text-xs text-gray-500">Total Ordered</div>
          </div>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h4 className="text-sm font-bold text-gray-900">Recent Purchase History</h4>
          <Link
            href="/dashboard/purchase-history"
            className="text-xs font-bold text-[#d43533] hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/70 text-gray-700 font-bold uppercase text-[10px] border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Delivery Status</th>
                <th className="px-5 py-3">Payment Status</th>
                <th className="px-5 py-3 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_RECENT_ORDERS.map((order) => (
                <tr key={order.code} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5 font-bold text-[#d43533]">
                    <Link href={`/order-confirmed/${order.code}`} className="hover:underline">
                      {order.code}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{order.date}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900">{formatPrice(order.amount)}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        order.deliveryStatus === "delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.deliveryStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/track-order?code=${order.code}`}
                      className="inline-flex rounded border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      Track
                    </Link>
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
