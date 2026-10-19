"use client"

import React from "react"
import { formatPrice } from "@/lib/utils"

interface OrderSummaryCardProps {
  order: {
    code: string
    date: string
    customerName: string
    customerEmail?: string
    shippingAddress: string
    city: string
    postalCode?: string
    country: string
    billingAddress: string
    sellerAddress: string
    deliveryStatus: string
    grandTotal: number
    shippingMethod: string
    paymentType: string
    trackingCode?: string
  }
}

export function CustomerOrderSummaryCard({ order }: OrderSummaryCardProps) {
  return (
    <div className="rounded border border-gray-200 bg-white shadow-xs overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-3.5 bg-gray-50/50">
        <h5 className="text-sm font-bold text-gray-900">Order Summary</h5>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700">
        {/* Left Column */}
        <table className="w-full">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-2.5 font-semibold text-gray-500 w-2/5">Order Code:</td>
              <td className="py-2.5 font-bold text-gray-900">{order.code}</td>
            </tr>
            <tr>
              <td className="py-2.5 font-semibold text-gray-500">Customer:</td>
              <td className="py-2.5 font-medium text-gray-900">{order.customerName}</td>
            </tr>
            {order.customerEmail && (
              <tr>
                <td className="py-2.5 font-semibold text-gray-500">Email:</td>
                <td className="py-2.5 text-gray-800">{order.customerEmail}</td>
              </tr>
            )}
            <tr>
              <td className="py-2.5 font-semibold text-gray-500 align-top">Shipping address:</td>
              <td className="py-2.5 text-gray-800 leading-relaxed">
                {order.shippingAddress}, {order.city}
                {order.postalCode ? ` - ${order.postalCode}` : ""}, {order.country}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 font-semibold text-gray-500 align-top">Billing address:</td>
              <td className="py-2.5 text-gray-800 leading-relaxed">{order.billingAddress}</td>
            </tr>
            <tr>
              <td className="py-2.5 font-semibold text-gray-500 align-top">Seller Address:</td>
              <td className="py-2.5 text-gray-800">{order.sellerAddress}</td>
            </tr>
          </tbody>
        </table>

        {/* Right Column */}
        <table className="w-full">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-2.5 font-semibold text-gray-500 w-2/5">Order date:</td>
              <td className="py-2.5 text-gray-900">{order.date}</td>
            </tr>
            <tr>
              <td className="py-2.5 font-semibold text-gray-500">Order status:</td>
              <td className="py-2.5">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${
                    order.deliveryStatus === "delivered"
                      ? "bg-emerald-100 text-emerald-800"
                      : order.deliveryStatus === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {order.deliveryStatus.replace(/_/g, " ")}
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-2.5 font-semibold text-gray-500">Total order amount:</td>
              <td className="py-2.5 font-bold text-[#d43533]">{formatPrice(order.grandTotal)}</td>
            </tr>
            <tr>
              <td className="py-2.5 font-semibold text-gray-500">Shipping method:</td>
              <td className="py-2.5 text-gray-800">{order.shippingMethod}</td>
            </tr>
            <tr>
              <td className="py-2.5 font-semibold text-gray-500">Payment method:</td>
              <td className="py-2.5 text-gray-900 font-semibold">{order.paymentType}</td>
            </tr>
            {order.trackingCode && (
              <tr>
                <td className="py-2.5 font-semibold text-gray-500">Tracking code:</td>
                <td className="py-2.5 font-mono text-gray-800">{order.trackingCode}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
