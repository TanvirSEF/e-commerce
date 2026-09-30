"use client"

import React from "react"
import { Trash2 } from "lucide-react"
import { SeedCoupon } from "@/db/seed/data"

interface CouponsTableProps {
  coupons: SeedCoupon[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onToggleStatus: (id: string, current: boolean) => void
  onDeleteClick: (coupon: SeedCoupon) => void
}

export function CouponsTable({
  coupons,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onToggleStatus,
  onDeleteClick,
}: CouponsTableProps) {
  const allSelected = coupons.length > 0 && selectedIds.length === coupons.length

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
            <th className="py-3 px-4 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
            </th>
            <th className="py-3 px-4 w-12">#</th>
            <th className="py-3 px-4">Code</th>
            <th className="py-3 px-4">Type</th>
            <th className="py-3 px-4">Discount</th>
            <th className="py-3 px-4">Min Spend</th>
            <th className="py-3 px-4">Start Date</th>
            <th className="py-3 px-4">End Date</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Options</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {coupons.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center py-10 text-gray-400">
                No promotional coupons found.
              </td>
            </tr>
          ) : (
            coupons.map((coupon, idx) => {
              const isSelected = selectedIds.includes(coupon.id)
              const startDate = coupon.startDate
                ? new Date(coupon.startDate).toLocaleDateString("en-GB")
                : "—"
              const endDate = coupon.endDate
                ? new Date(coupon.endDate).toLocaleDateString("en-GB")
                : "—"

              return (
                <tr key={coupon.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(coupon.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-400">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-800">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 capitalize">
                    {coupon.type.replace(/_/g, " ")}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {coupon.discountType === "percent"
                      ? `${coupon.discount}%`
                      : `৳${coupon.discount}`}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">৳{coupon.minBuy}</td>
                  <td className="py-3.5 px-4 text-gray-600">{startDate}</td>
                  <td className="py-3.5 px-4 text-gray-600">{endDate}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(coupon.id, coupon.status)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        coupon.status ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          coupon.status ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteClick(coupon)}
                      className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
