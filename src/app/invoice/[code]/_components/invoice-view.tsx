"use client"

import { Printer, ArrowLeft } from "lucide-react"
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
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-[#f2f3f8] min-h-screen py-6 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 print:max-w-full print:px-0">
        {/* Top bar (Hidden during printing) */}
        <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
          <Link
            href="/dashboard/purchase-history"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Orders</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/shipping-label/${invoice.code}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
            >
              <Printer className="size-4 text-gray-600" />
              <span>Thermal Shipping Label</span>
            </Link>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2 rounded text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="size-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Invoice Printable Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 shadow-sm print:border-none print:shadow-none print:p-0">
          {/* Header Row: Brand & Invoice Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-gray-200 pb-8 mb-8">
            <div>
              <div className="text-2xl font-black tracking-tight text-primary">
                Active<span className="text-gray-900">Shop</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Active eCommerce CMS Standard</p>
              <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                <p>House #12, Road #4, Dhanmondi, Dhaka</p>
                <p>Phone: +880 1700-000000</p>
                <p>Email: support@active-ecom.com</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                Official Invoice
              </span>
              <h1 className="text-xl sm:text-2xl font-mono font-black text-gray-900 mt-0.5">
                #{invoice.code}
              </h1>
              <div className="text-xs text-gray-500 mt-2 space-y-1">
                <p>
                  Order Date: <strong className="font-semibold text-gray-800">{invoice.date}</strong>
                </p>
                <p>
                  Payment Method:{" "}
                  <span className="font-semibold text-gray-800 capitalize">
                    {invoice.paymentMethod.replace(/_/g, " ")}
                  </span>
                </p>
                <p>
                  Payment Status:{" "}
                  <span
                    className={`font-bold uppercase ${
                      invoice.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"
                    }`}
                  >
                    {invoice.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-8 border-b border-gray-100 mb-8 text-xs">
            <div>
              <h3 className="font-bold uppercase tracking-wider text-gray-400 mb-2">Billed To</h3>
              <p className="font-bold text-sm text-gray-900">{invoice.customerName}</p>
              <p className="text-gray-600 mt-0.5">{invoice.customerPhone}</p>
              {invoice.customerEmail && <p className="text-gray-600">{invoice.customerEmail}</p>}
            </div>

            <div>
              <h3 className="font-bold uppercase tracking-wider text-gray-400 mb-2">Shipping Destination</h3>
              <p className="text-gray-800 leading-relaxed">{invoice.shippingAddress}</p>
              {invoice.city && <p className="text-gray-600">{invoice.city}, {invoice.country || "Bangladesh"}</p>}
              {invoice.trackingCode && (
                <p className="font-mono text-[11px] text-primary mt-1">
                  Tracking No: {invoice.trackingCode}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase text-gray-600">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-3 px-4 font-semibold text-gray-400">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {item.name}
                      {item.variation && (
                        <span className="block text-[11px] text-gray-400 font-normal">
                          Variant: {item.variation}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-gray-700">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-gray-600">৳{item.price.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-gray-200 pt-6">
            <div className="text-xs text-gray-400 max-w-sm">
              <p className="font-semibold text-gray-700 mb-1">Notes & Terms:</p>
              <p>
                All physical orders are covered by standard 7-day customer satisfaction warranty. Please retain this invoice for warranty claiming.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold">৳{invoice.subtotal.toLocaleString()}</span>
              </div>
              {invoice.couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount:</span>
                  <span>-৳{invoice.couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping Cost:</span>
                <span>৳{invoice.shippingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900">
                <span>Grand Total:</span>
                <span className="text-primary text-base">৳{invoice.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer Thank You */}
          <div className="mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
            Thank you for shopping with Active eCommerce CMS!
          </div>
        </div>
      </div>
    </div>
  )
}
