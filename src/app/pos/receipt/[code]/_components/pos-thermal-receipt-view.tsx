"use client"

import React, { useEffect } from "react"
import { Printer, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { PosSale } from "@/db/schema"

interface PosThermalReceiptViewProps {
  sale: PosSale
  width?: "80mm" | "58mm"
}

export function PosThermalReceiptView({
  sale,
  width = "80mm",
}: PosThermalReceiptViewProps) {
  useEffect(() => {
    // Auto trigger print after render
    const timer = setTimeout(() => {
      window.print()
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const is58mm = width === "58mm"

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex flex-col items-center print:bg-white print:p-0">
      {/* Top action bar (hidden during print) */}
      <div className="w-full max-w-sm mb-4 flex items-center justify-between print:hidden">
        <Link
          href="/admin/pos"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to POS
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 bg-[#d43533] text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs hover:bg-[#b02a28] transition"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Receipt
        </button>
      </div>

      {/* The Printable Paper Slip */}
      <div
        style={{ width: is58mm ? "58mm" : "80mm" }}
        className="bg-white p-4 shadow-xl border border-gray-200 font-mono text-xs text-gray-900 print:border-none print:shadow-none print:p-1"
      >
        {/* Header */}
        <div className="text-center space-y-1 mb-3">
          <h2 className="text-base font-extrabold uppercase tracking-wide">
            Active eCommerce
          </h2>
          <p className="text-[10px] text-gray-600">Dhanmondi, Dhaka-1209, Bangladesh</p>
          <p className="text-[10px] text-gray-600">Tel: +880 1700 000000</p>
          <div className="border-b border-dashed border-gray-400 my-2" />
          <div className="text-[11px] font-bold">CASH RECEIPT</div>
          <div className="border-b border-dashed border-gray-400 my-2" />
        </div>

        {/* Invoice Info */}
        <div className="space-y-1 text-[11px] mb-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Order:</span>
            <span className="font-bold">{sale.orderCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span>
              {new Date(sale.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Cashier:</span>
            <span>{sale.cashierName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Customer:</span>
            <span>{sale.customerName}</span>
          </div>
        </div>

        <div className="border-b border-dashed border-gray-400 my-2" />

        {/* Items Table */}
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-[10px] font-bold text-gray-500 border-b border-gray-200 pb-1">
            <span>Item</span>
            <span>Qty × Price</span>
            <span>Total</span>
          </div>

          {(sale.itemsJson || []).map((item, idx) => (
            <div key={idx} className="text-[11px] space-y-0.5">
              <div className="font-semibold line-clamp-1">{item.productName}</div>
              <div className="flex justify-between text-gray-600 text-[10px]">
                <span>
                  {item.quantity} × ৳{item.price}
                </span>
                <span className="font-bold text-gray-900">৳{item.lineTotal}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-b border-dashed border-gray-400 my-2" />

        {/* Totals */}
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>৳{parseFloat(sale.subtotal || "0").toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax / VAT:</span>
            <span>+৳{parseFloat(sale.tax || "0").toFixed(2)}</span>
          </div>
          {parseFloat(sale.discount || "0") > 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-৳{parseFloat(sale.discount || "0").toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-extrabold text-sm border-t border-dashed border-gray-400 pt-1.5">
            <span>TOTAL:</span>
            <span>৳{parseFloat(sale.total || "0").toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-600 pt-1">
            <span>Paid ({sale.paymentMethod}):</span>
            <span>৳{parseFloat(sale.paidAmount || "0").toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-600">
            <span>Change Return:</span>
            <span>৳{parseFloat(sale.changeAmount || "0").toFixed(2)}</span>
          </div>
        </div>

        <div className="border-b border-dashed border-gray-400 my-3" />

        {/* Barcode & Footer */}
        <div className="text-center space-y-2">
          {/* Simulated 1D Barcode */}
          <div className="flex justify-center items-center py-1">
            <div className="tracking-[4px] font-mono text-sm font-bold border-y border-black py-0.5 px-3">
              *{sale.orderCode}*
            </div>
          </div>
          <p className="text-[10px] text-gray-600">
            Thank you for shopping with us!
          </p>
          <p className="text-[9px] text-gray-400">
            Keep this slip for 7 days warranty & return
          </p>
        </div>
      </div>
    </div>
  )
}
