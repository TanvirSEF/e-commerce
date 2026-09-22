"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Printer,
  FileText,
  Truck,
  CheckCircle,
  Copy,
  ArrowLeft,
  Save,
  Clock,
  AlertCircle,
  Store,
  User,
  MapPin,
  CreditCard,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { updateOrderStatusAction } from "@/app/actions/ecommerce-actions"
import type { AdminOrderDetails } from "@/services/order-service"

interface OrderDetailsAdminViewProps {
  order: AdminOrderDetails
}

export function OrderDetailsAdminView({ order }: OrderDetailsAdminViewProps) {
  const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus)
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus)
  const [shippingMethod, setShippingMethod] = useState(order.shippingMethod || "steadfast")
  const [courierTrackingCode, setCourierTrackingCode] = useState(order.courierTrackingCode || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await updateOrderStatusAction({
        orderId: order.id,
        deliveryStatus,
        paymentStatus,
        shippingMethod,
        courierTrackingCode,
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCopyTracking = () => {
    if (order.trackingCode) {
      navigator.clipboard.writeText(order.trackingCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Order #{order.code}</h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                  deliveryStatus === "delivered"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : deliveryStatus === "cancelled"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {deliveryStatus.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Placed on {order.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/invoice/${order.code}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            View Invoice
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Order
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4" />
          Order status and courier tracking updated successfully!
        </div>
      )}

      {/* Control Panel: Delivery & Payment Status, Courier */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#d43533]" />
            Order Fulfillment & Courier Controls
          </span>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded shadow-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Delivery Status
            </label>
            <select
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Courier Partner
            </label>
            <select
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
            >
              <option value="steadfast">Steadfast Courier</option>
              <option value="pathao">Pathao Courier</option>
              <option value="redx">RedX Logistics</option>
              <option value="paperfly">Paperfly</option>
              <option value="standard">Standard In-house</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Courier Tracking Code
            </label>
            <input
              type="text"
              value={courierTrackingCode}
              onChange={(e) => setCourierTrackingCode(e.target.value)}
              placeholder="e.g. STF-10294"
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono text-slate-800 focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>
      </div>

      {/* Customer & Merchant Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Address */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-xs text-slate-800 uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-[#d43533]" />
            Customer Shipping Address
          </div>
          <div className="text-xs space-y-1.5 text-slate-600">
            <div className="font-bold text-slate-800 text-sm">{order.customerName}</div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span>{order.customerEmail}</span>
            </div>
            <div className="font-medium text-slate-700">{order.customerPhone}</div>
            <div className="pt-2 text-slate-700 leading-relaxed">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
              {order.shippingAddress}, {order.city} - {order.postalCode}
              <br />
              <span className="font-semibold">{order.country}</span>
            </div>
          </div>
        </div>

        {/* Sold By Vendor */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-xs text-slate-800 uppercase tracking-wider">
            <Store className="w-3.5 h-3.5 text-blue-600" />
            Sold By Merchant
          </div>
          <div className="text-xs space-y-1.5 text-slate-600">
            <div className="font-bold text-slate-800 text-sm">{order.shopName}</div>
            <div className="text-slate-500">{order.shopAddress}</div>
            <div className="pt-2">
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Verified Seller
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-xs text-slate-800 uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            Payment & Tracking
          </div>
          <div className="text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-bold text-slate-800 uppercase text-[11px]">
                {order.paymentType.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span
                className={`font-bold uppercase text-[11px] px-2 py-0.5 rounded ${
                  paymentStatus === "paid"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {paymentStatus}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] text-slate-400 mb-1">Customer Tracking Code</div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2 py-1 rounded flex-1">
                  {order.trackingCode}
                </span>
                <button
                  onClick={handleCopyTracking}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                  title="Copy Tracking Code"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {copied && <span className="text-[10px] text-emerald-600 font-medium">Copied!</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 font-bold text-xs text-slate-800 uppercase tracking-wider">
          Ordered Products ({order.items.length} Items)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Variation</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Tax</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded border border-slate-200 overflow-hidden shrink-0 bg-slate-100">
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="font-bold text-slate-800 line-clamp-1">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {item.variation || "Standard"}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700 font-medium">
                    {formatPrice(item.price)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500">
                    {formatPrice(item.tax)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {formatPrice(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Totals */}
        <div className="bg-slate-50 border-t border-slate-200 p-5">
          <div className="max-w-xs ml-auto space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-800">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Shipping Cost:</span>
              <span className="font-semibold text-slate-800">{formatPrice(order.shippingCost)}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div className="flex items-center justify-between text-emerald-600">
                <span>Coupon Discount:</span>
                <span className="font-semibold">-{formatPrice(order.couponDiscount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total:</span>
              <span className="text-[#d43533]">{formatPrice(order.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
