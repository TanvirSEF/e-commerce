"use client"

import React from "react"
import Image from "next/image"
import { Calendar, RotateCcw } from "lucide-react"

export interface CategoryDiscountTableItem {
  id: string
  name: string
  slug: string
  icon?: string
  parentId?: number | null
  parentName?: string
  digital?: boolean
  inhouseCount: number
  sellerCount: number
  discount: number
  startDate: string
  endDate: string
  sellerDiscount: boolean
}

interface CategoryDiscountTableProps {
  categories: CategoryDiscountTableItem[]
  onDiscountChange: (id: string, val: number) => void
  onDiscountEnter: (id: string) => void
  onClearDiscount: (id: string) => void
  onDateRangeChange: (id: string, start: string, end: string) => void
  onClearDateRange: (id: string) => void
  onToggleSellerSwitch: (id: string, enabling: boolean) => void
}

export function CategoryDiscountTable({
  categories,
  onDiscountChange,
  onDiscountEnter,
  onClearDiscount,
  onDateRangeChange,
  onClearDateRange,
  onToggleSellerSwitch,
}: CategoryDiscountTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
          <tr>
            <th className="py-3 px-4 w-12">#</th>
            <th className="py-3 px-4 text-center w-16">Icon</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Parent</th>
            <th className="py-3 px-4 text-center">Inhouse</th>
            <th className="py-3 px-4 text-center">Seller</th>
            <th className="py-3 px-4 w-52">Discount (%)</th>
            <th className="py-3 px-4 w-64">Date Range</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {categories.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-12 text-center text-slate-400">
                <p className="font-semibold text-sm">No Data found!</p>
              </td>
            </tr>
          ) : (
            categories.map((cat, idx) => (
              <tr key={cat.id} className="hover:bg-slate-50/75 transition-colors">
                <td className="py-3 px-4 text-slate-400 font-semibold">{idx + 1}</td>

                {/* Icon */}
                <td className="py-3 px-4 text-center">
                  <div className="w-9 h-9 mx-auto relative border border-slate-200 rounded shrink-0 bg-white overflow-hidden shadow-2xs">
                    <Image
                      src={cat.icon || "/assets/img/placeholder.jpg"}
                      alt={cat.name}
                      fill
                      sizes="36px"
                      className="object-contain p-1"
                    />
                  </div>
                </td>

                {/* Name */}
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <span>{cat.name}</span>
                    {cat.digital && (
                      <span className="px-1.5 py-0.2 text-[9px] font-bold bg-purple-100 text-purple-700 rounded">
                        Digital
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">/{cat.slug}</span>
                </td>

                {/* Parent */}
                <td className="py-3 px-4">
                  <span className="text-slate-600 font-medium">{cat.parentName || "—"}</span>
                </td>

                {/* Inhouse Count */}
                <td className="py-3 px-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs">
                    {cat.inhouseCount}
                  </span>
                </td>

                {/* Seller Count + Switch */}
                <td className="py-3 px-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs">
                      {cat.sellerCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleSellerSwitch(cat.id, !cat.sellerDiscount)}
                      className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        cat.sellerDiscount ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                      title="Apply to seller products"
                    >
                      <span
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          cat.sellerDiscount ? "translate-x-3" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </td>

                {/* Discount (%) with Clear Button */}
                <td className="py-3 px-4">
                  <div className="group relative flex items-center border border-slate-300 rounded bg-slate-50 focus-within:border-[#d43533] focus-within:bg-white transition-colors px-2 py-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={cat.discount === 0 ? "" : cat.discount}
                      placeholder="0"
                      onChange={(e) => onDiscountChange(cat.id, Number(e.target.value) || 0)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          onDiscountEnter(cat.id)
                        }
                      }}
                      className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => onClearDiscount(cat.id)}
                      className="text-slate-400 hover:text-slate-600 p-0.5 transition-colors cursor-pointer shrink-0"
                      title="Clear discount"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                    {/* Tooltip info */}
                    <div className="absolute -top-7 left-0 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                      Type & press Enter to save
                    </div>
                  </div>
                </td>

                {/* Date Range with Clear Button */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 border border-slate-300 rounded bg-slate-50 focus-within:border-[#d43533] focus-within:bg-white transition-colors px-2 py-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="date"
                      value={cat.startDate}
                      onChange={(e) => onDateRangeChange(cat.id, e.target.value, cat.endDate)}
                      className="bg-transparent text-[11px] text-slate-700 focus:outline-hidden w-24"
                    />
                    <span className="text-slate-400 text-[10px]">to</span>
                    <input
                      type="date"
                      value={cat.endDate}
                      onChange={(e) => onDateRangeChange(cat.id, cat.startDate, e.target.value)}
                      className="bg-transparent text-[11px] text-slate-700 focus:outline-hidden w-24"
                    />
                    <button
                      type="button"
                      onClick={() => onClearDateRange(cat.id)}
                      className="text-slate-400 hover:text-slate-600 p-0.5 transition-colors cursor-pointer shrink-0 ml-auto"
                      title="Clear date range"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
