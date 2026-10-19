"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, ArrowRight, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { PreorderOrder } from "@/db/schema"

interface CustomerPreordersViewProps {
  orders: PreorderOrder[]
}

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  requested: { label: "Requested", bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  confirmed: { label: "Confirmed", bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  available: { label: "Available in Stock", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
  completed: { label: "Fulfilled", bg: "bg-slate-100 border-slate-200", text: "text-slate-700" },
  cancelled: { label: "Cancelled", bg: "bg-red-50 border-red-200", text: "text-red-700" },
}

export function CustomerPreordersView({ orders }: CustomerPreordersViewProps) {
  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="rounded border border-gray-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#d43533]" /> My Pre-Orders
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track your reserved upcoming product launches, paid deposits, and remaining balances
          </p>
        </div>
        <Link
          href="/preorder"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#d43533] text-white text-xs font-bold hover:bg-[#9d1b1a] transition-colors self-start sm:self-auto shrink-0 shadow-2xs"
        >
          Explore Launches <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Orders Table or Empty State */}
      <div className="rounded border border-gray-200 bg-white shadow-xs overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="relative mx-auto w-36 h-28 mb-3">
              <Image
                src="/assets/img/nothing.svg"
                alt="No pre-orders"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h3 className="text-base font-bold text-gray-800">No Pre-Orders Reserved Yet</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
              You haven&apos;t placed any advance reservations for upcoming flagships or limited edition items.
            </p>
            <div className="mt-5">
              <Link
                href="/preorder"
                className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors shadow-2xs"
              >
                Browse Upcoming Launches
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50/75 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Booking Code</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4">Deposit Paid</th>
                  <th className="py-3 px-4">Remaining Due</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {orders.map((o) => {
                  const badge = STATUS_BADGES[o.preorderStatus || "requested"] || STATUS_BADGES.requested
                  const deposit = parseFloat(o.prepaymentPaid || "0")
                  const due = parseFloat(o.remainingDue || "0")

                  return (
                    <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#d43533] text-xs">
                        #{o.orderCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900 line-clamp-1 max-w-xs text-xs">
                          {o.productName}
                        </div>
                        {o.sellerName && (
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            By {o.sellerName}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center text-xs font-medium text-gray-700">
                        {o.quantity || 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-emerald-700">
                          {formatPrice(deposit)}
                        </div>
                        <span className="text-[10px] text-emerald-600 block">Prepayment</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-slate-800">
                          {formatPrice(due)}
                        </div>
                        <span className="text-[10px] text-gray-400 block">Due upon arrival</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs text-gray-500 whitespace-nowrap">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "Recent"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
