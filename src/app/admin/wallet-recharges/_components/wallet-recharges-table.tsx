"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react"
import type { WalletRechargeItem } from "@/types/wallet-recharge"
import { WalletApprovalSwitch } from "./wallet-approval-switch"

interface Props {
  items: WalletRechargeItem[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  total: number
  onPageChange: (p: number) => void
}

export function WalletRechargesTable({ items, isLoading, currentPage, totalPages, total, onPageChange }: Props) {
  const offset = (currentPage - 1) * 15

  const getStatusBadge = (item: WalletRechargeItem) => {
    if (item.addedBy === "admin") {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-100 text-blue-700">By Admin</span>
    }
    if (item.addedBy === "customer") {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-100 text-purple-700">By Customer</span>
    }
    if (item.approval) {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" />Approved</span>
    }
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-yellow-100 text-yellow-700"><XCircle className="w-3 h-3" />Pending</span>
  }

  return (
    <>
      <div className="overflow-x-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[#d43533] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <table className="w-full text-xs text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-semibold border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment Method</th>
              <th className="px-4 py-3">TXN Details</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Approval</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                  No recharge requests found.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-400 font-medium">{offset + idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">{item.userName}</div>
                    <div className="text-[11px] text-gray-400">{item.userEmail}</div>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-800">৳{item.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{item.paymentMethod}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[160px]">
                    <span className="truncate block" title={item.paymentDetails ?? ""}>
                      {item.paymentDetails ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item)}</td>
                  <td className="px-4 py-3">
                    <WalletApprovalSwitch id={item.id} approval={item.approval} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{item.createdAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{total} total requests</span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1 rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1 rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
