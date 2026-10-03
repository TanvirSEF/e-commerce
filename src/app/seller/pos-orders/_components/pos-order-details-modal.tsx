"use client"

import React from "react"
import Link from "next/link"
import { X, Printer, User, Phone, Calendar, CreditCard, ShoppingBag } from "lucide-react"
import type { PosSale } from "@/db/schema"

interface PosOrderDetailsModalProps {
  sale: PosSale | null
  onClose: () => void
}

export function PosOrderDetailsModal({ sale, onClose }: PosOrderDetailsModalProps) {
  if (!sale) return null

  const items = sale.itemsJson || []
  const subtotal = parseFloat(sale.subtotal || "0")
  const discount = parseFloat(sale.discount || "0")
  const total = parseFloat(sale.total || "0")
  const paid = parseFloat(sale.paidAmount || "0")
  const change = parseFloat(sale.changeAmount || "0")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-gray-900">{sale.orderCode}</span>
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                POS Order
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Issued by {sale.cashierName} &bull;{" "}
              {new Date(sale.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Customer info card */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <User className="w-3.5 h-3.5 text-gray-500" />
                {sale.customerName}
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                <Phone className="w-3 h-3 text-gray-400" />
                {sale.customerPhone || "N/A"}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Paid ({sale.paymentMethod})
              </span>
            </div>
          </div>

          {/* Itemized list */}
          <div>
            <div className="font-bold text-gray-700 mb-2 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-gray-500" />
              Purchased Products ({items.length})
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
              {items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between bg-white">
                  <div className="flex-1 pr-3">
                    <p className="font-semibold text-gray-800">{item.productName}</p>
                    <p className="text-[10px] text-gray-400">
                      {item.quantity} &times; ৳{item.price.toLocaleString("en-BD")}
                    </p>
                  </div>
                  <div className="font-mono font-bold text-gray-900">
                    ৳{item.lineTotal.toLocaleString("en-BD")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-1.5 font-mono">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>৳{subtotal.toLocaleString("en-BD")}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span>-৳{discount.toLocaleString("en-BD")}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-gray-900 border-t border-gray-200 pt-1.5">
              <span>Grand Total:</span>
              <span className="text-[#d43533]">৳{total.toLocaleString("en-BD")}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-[11px] pt-1">
              <span>Paid: ৳{paid.toLocaleString("en-BD")}</span>
              <span>Change: ৳{change.toLocaleString("en-BD")}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition"
          >
            Close
          </button>
          <Link
            href={`/pos/receipt/${sale.orderCode}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#b02a28] transition"
          >
            <Printer className="w-4 h-4" />
            Print Thermal Receipt
          </Link>
        </div>
      </div>
    </div>
  )
}
