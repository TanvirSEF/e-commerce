"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, Check, X, Trash2, ChevronLeft, ChevronRight, Package, User } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { RefundRequestItem } from "@/services/refund-service"

interface RefundRequestsTableProps {
  items: RefundRequestItem[]
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (newPage: number) => void
  onInspect: (item: RefundRequestItem) => void
  onApprove: (item: RefundRequestItem) => void
  onReject: (item: RefundRequestItem) => void
  onDelete: (item: RefundRequestItem) => void
}

export function RefundRequestsTable({
  items,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onInspect,
  onApprove,
  onReject,
  onDelete,
}: RefundRequestsTableProps) {
  const startIndex = (page - 1) * limit
  const endIndex = Math.min(startIndex + items.length, total)

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#f8f9fb] text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 font-bold">Order Code</th>
              <th className="py-3 px-4 font-bold min-w-[200px]">Product</th>
              <th className="py-3 px-4 font-bold">Customer</th>
              <th className="py-3 px-4 font-bold">Seller</th>
              <th className="py-3 px-4 font-bold">Refund Amount</th>
              <th className="py-3 px-4 font-bold">Status</th>
              <th className="py-3 px-4 font-bold min-w-[160px]">Reason</th>
              <th className="py-3 px-4 font-bold whitespace-nowrap">Date</th>
              <th className="py-3 px-4 font-bold text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {items.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Package className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                    <p className="text-xs font-medium">No refund requests found matching criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const serial = startIndex + idx + 1
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Index */}
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">
                      {serial}
                    </td>

                    {/* Order Code */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Link
                        href={`/admin/orders`}
                        className="font-bold text-[#d43533] hover:underline"
                        title="View order"
                      >
                        {item.orderCode}
                      </Link>
                    </td>

                    {/* Product */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                          {item.attachment ? (
                            <Image
                              src={item.attachment}
                              alt={item.productName}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <span
                          className="font-medium text-slate-800 line-clamp-1 max-w-[200px]"
                          title={item.productName}
                        >
                          {item.productName}
                        </span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                          {item.customerName ? item.customerName.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
                        </div>
                        <span className="font-medium text-slate-900">{item.customerName}</span>
                      </div>
                    </td>

                    {/* Seller */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-medium">
                      {item.shopName}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-900">
                      {formatPrice(item.amount)}
                    </td>

                    {/* Status Badge (Active eCommerce style) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "approved"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : item.status === "rejected"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {item.status === "approved"
                          ? "Approved (Paid)"
                          : item.status === "rejected"
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="py-3 px-4 max-w-[200px]">
                      <div className="font-medium text-slate-700 truncate" title={item.reason}>
                        {item.reason}
                      </div>
                      {item.details && (
                        <div className="text-[11px] text-slate-400 truncate italic mt-0.5" title={item.details}>
                          {item.details}
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {item.date}
                    </td>

                    {/* Options (Active eCommerce style) */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* Inspect / View Button */}
                        <button
                          type="button"
                          onClick={() => onInspect(item)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="View Refund Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Approve & Pay (Only if pending) */}
                        {item.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => onApprove(item)}
                            className="p-1.5 rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Approve & Refund Money"
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        )}

                        {/* Reject (Only if pending) */}
                        {item.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => onReject(item)}
                            className="p-1.5 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Reject Refund Request"
                          >
                            <X className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        )}

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Request Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {total > 0 && (
        <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-slate-700">{endIndex}</span> of{" "}
            <span className="font-semibold text-slate-700">{total}</span> requests
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 rounded text-xs font-semibold ${
                  p === page
                    ? "bg-[#d43533] text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
