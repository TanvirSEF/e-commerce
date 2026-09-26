"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Printer,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  CreditCard,
  Save,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

export interface SellerOrderDetailsData {
  id: string
  code: string
  date: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  paymentType: string
  paymentStatus: "paid" | "unpaid"
  deliveryStatus: "pending" | "confirmed" | "picked_up" | "on_the_way" | "delivered" | "cancelled"
  trackingCode?: string
  subtotal: number
  shippingCost: number
  tax: number
  couponDiscount: number
  total: number
  items: {
    id: string
    name: string
    thumbnail: string
    slug: string
    variation?: string
    price: number
    quantity: number
    total: number
  }[]
}

interface SellerOrderDetailsViewProps {
  order: SellerOrderDetailsData
}

export function SellerOrderDetailsView({ order: initialOrder }: SellerOrderDetailsViewProps) {
  const [deliveryStatus, setDeliveryStatus] = useState(initialOrder.deliveryStatus)
  const [paymentStatus, setPaymentStatus] = useState(initialOrder.paymentStatus)
  const [trackingCode, setTrackingCode] = useState(initialOrder.trackingCode || "")
  const [isSaved, setIsSaved] = useState(false)

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Top Bar with Back and Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/seller/orders"
            className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Order Details <span className="text-[#d43533]">#{initialOrder.code}</span>
            </h1>
            <p className="text-xs text-gray-500">Placed on {initialOrder.date}</p>
          </div>
        </div>

        <Link
          href={`/invoice-print/${initialOrder.code}`}
          target="_blank"
          className="inline-flex items-center gap-2 rounded bg-white border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Printer className="h-4 w-4 text-gray-500" />
          Print Invoice
        </Link>
      </div>

      {/* Status Controls */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <form onSubmit={handleSaveStatus} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Delivery Status
            </label>
            <select
              value={deliveryStatus}
              onChange={(e: any) => setDeliveryStatus(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="picked_up">Picked Up</option>
              <option value="on_the_way">On The Way</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e: any) => setPaymentStatus(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tracking Code (Courier)
            </label>
            <input
              type="text"
              placeholder="e.g. TRK-98471203"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded bg-[#d43533] py-2 px-4 text-xs font-bold text-white shadow-sm hover:bg-[#b82a28] transition-colors"
            >
              <Save className="h-4 w-4" />
              {isSaved ? "Saved Successfully!" : "Update Status"}
            </button>
          </div>
        </form>
      </div>

      {/* Grid: Customer Info & Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ordered Items Table (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
              Order Items ({initialOrder.items.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Product</th>
                    <th className="px-4 py-2.5 text-center">Qty</th>
                    <th className="px-4 py-2.5 text-right">Unit Price</th>
                    <th className="px-4 py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {initialOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={item.thumbnail || "/assets/img/placeholder.jpg"}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="rounded object-cover border border-gray-200"
                          />
                          <div>
                            <Link
                              href={`/product/${item.slug}`}
                              className="font-semibold text-gray-900 hover:text-[#d43533]"
                            >
                              {item.name}
                            </Link>
                            {item.variation && (
                              <p className="text-[11px] text-gray-400">Variant: {item.variation}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-gray-800">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-700">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#d43533]">
                        {formatPrice(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Customer & Financial Summary (1 Col) */}
        <div className="space-y-6">
          {/* Customer & Delivery Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              Customer & Shipping
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <User className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">{initialOrder.customerName}</p>
                  <p className="text-gray-500">{initialOrder.customerEmail}</p>
                  <p className="text-gray-500">{initialOrder.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 pt-2 border-t border-gray-100">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-700">Delivery Address:</span>
                  <p className="text-gray-600 mt-0.5">{initialOrder.shippingAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 pt-2 border-t border-gray-100">
                <CreditCard className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-700">Payment:</span>
                  <p className="text-gray-600 mt-0.5">{initialOrder.paymentType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-2.5 text-xs">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              Order Summary
            </h3>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-medium text-gray-800">{formatPrice(initialOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Cost:</span>
              <span className="font-medium text-gray-800">{formatPrice(initialOrder.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (GST/VAT):</span>
              <span className="font-medium text-gray-800">{formatPrice(initialOrder.tax)}</span>
            </div>
            {initialOrder.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Discount:</span>
                <span>-{formatPrice(initialOrder.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-2 text-sm font-extrabold text-[#d43533]">
              <span>Total Amount:</span>
              <span>{formatPrice(initialOrder.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
