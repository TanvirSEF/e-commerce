"use client"

import React, { useEffect } from "react"
import { Printer, ArrowLeft, Download, Tag } from "lucide-react"
import Link from "next/link"

export interface InvoiceData {
  code: string
  trackingCode?: string
  date: string
  customerName: string
  customerEmail?: string
  customerPhone: string
  shippingAddress: string
  city?: string
  country?: string
  paymentMethod: string
  paymentStatus: string
  deliveryStatus: string
  items: {
    id: string
    name: string
    variation?: string
    quantity: number
    price: number
  }[]
  subtotal: number
  shippingCost: number
  couponDiscount: number
  grandTotal: number
}

interface InvoiceViewProps {
  invoice: InvoiceData
  hideControls?: boolean
}

export function InvoiceView({ invoice, hideControls = false }: InvoiceViewProps) {
  useEffect(() => {
    // If URL has ?print=1 or query param print, automatically trigger print dialog
    if (typeof window !== "undefined" && window.location.search.includes("print=1")) {
      const timer = setTimeout(() => {
        window.print()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <div className="bg-[#f0f2f5] min-h-screen py-6 print:bg-white print:py-0 print:min-h-0">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .invoice-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="max-w-[210mm] mx-auto px-4 print:max-w-full print:px-0">
        {/* Top Control Toolbar (Hidden during print) */}
        {!hideControls && (
          <div className="flex items-center justify-between gap-3 mb-5 print:hidden bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back()
                } else {
                  window.location.href = "/admin/orders"
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                href={`/shipping-label/${invoice.code}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Thermal Shipping Label</span>
              </Link>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-bold bg-[#d43533] hover:bg-[#b82a28] text-white shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        )}

        {/* Invoice Printable Card (Strict A4 Layout matching Active eCommerce) */}
        <div className="invoice-card bg-white border border-slate-200 rounded-lg p-8 sm:p-10 shadow-sm print:p-0 print:border-none print:shadow-none text-slate-800 font-sans">
          {/* Header Row: Company Brand + Invoice Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6 mb-6">
            <div>
              <div className="text-2xl font-black tracking-tight text-[#d43533]">
                Active<span className="text-slate-900">Shop</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Active eCommerce CMS Standard</p>
              <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                <p>House #12, Road #4, Dhanmondi, Dhaka</p>
                <p>Phone: +880 1700-000000</p>
                <p>Email: support@active-ecom.com</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-extrabold text-[#d43533] uppercase tracking-wider block">
                Official Invoice
              </span>
              <h1 className="text-xl sm:text-2xl font-mono font-black text-slate-900 mt-0.5">
                #{invoice.code}
              </h1>
              <div className="text-xs text-slate-600 mt-2 space-y-1">
                <p>
                  Order Date: <strong className="font-semibold text-slate-900">{invoice.date}</strong>
                </p>
                <p>
                  Payment Method:{" "}
                  <span className="font-semibold text-slate-900 capitalize">
                    {invoice.paymentMethod.replace(/_/g, " ")}
                  </span>
                </p>
                <p>
                  Payment Status:{" "}
                  <span
                    className={`font-bold uppercase ${
                      invoice.paymentStatus.toLowerCase() === "paid" ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    {invoice.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100 mb-6 text-xs avoid-break">
            <div>
              <h3 className="font-bold uppercase tracking-wider text-slate-400 mb-1.5 text-[10px]">Billed To</h3>
              <p className="font-bold text-sm text-slate-900">{invoice.customerName}</p>
              <p className="text-slate-600 mt-0.5">{invoice.customerPhone}</p>
              {invoice.customerEmail && <p className="text-slate-600">{invoice.customerEmail}</p>}
            </div>

            <div>
              <h3 className="font-bold uppercase tracking-wider text-slate-400 mb-1.5 text-[10px]">Shipping Destination</h3>
              <p className="text-slate-800 leading-relaxed font-medium">{invoice.shippingAddress}</p>
              {invoice.city && (
                <p className="text-slate-600 mt-0.5">{invoice.city}, {invoice.country || "Bangladesh"}</p>
              )}
              {invoice.trackingCode && (
                <p className="font-mono text-[11px] font-semibold text-[#1492e6] mt-1">
                  Tracking Code: {invoice.trackingCode}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-6 avoid-break">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 bg-slate-50 text-[11px] font-bold uppercase text-slate-700">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Details</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id} className="avoid-break">
                    <td className="py-3 px-3 font-semibold text-slate-400">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {item.name}
                      {item.variation && (
                        <span className="block text-[11px] text-slate-400 font-normal">
                          Variant: {item.variation}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-slate-600">৳{item.price.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      ৳{(item.price * item.quantity).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Notes */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6 avoid-break">
            <div className="text-xs text-slate-500 max-w-sm">
              <p className="font-bold text-slate-700 mb-1">Notes & Terms:</p>
              <p>
                All physical orders are covered by standard 7-day customer satisfaction warranty. Please retain this invoice for warranty claiming.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800">৳{invoice.subtotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
              </div>
              {invoice.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount:</span>
                  <span>-৳{invoice.couponDiscount.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping Cost:</span>
                <span className="font-semibold text-slate-800">৳{invoice.shippingCost.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-bold text-slate-900">
                <span>Grand Total:</span>
                <span className="text-[#d43533] text-base">৳{invoice.grandTotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-10 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Thank you for shopping with Active eCommerce CMS!
          </div>
        </div>
      </div>
    </div>
  )
}
