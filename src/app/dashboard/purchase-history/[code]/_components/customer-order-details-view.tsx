"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { ArrowLeft, Printer, RefreshCw, Star, CheckCircle2 } from "lucide-react"
import { ReviewModal } from "../../_components/review-modal"

interface OrderDetailsProps {
  order: {
    id: number
    code: string
    trackingCode?: string
    date: string
    deliveryStatus: string
    paymentStatus: string
    paymentType: string
    customerName: string
    customerEmail: string
    customerPhone: string
    shippingAddress: string
    city: string
    state: string
    postalCode: string
    country: string
    billingAddress: string
    sellerAddress: string
    shippingMethod: string
    additionalInfo: string
    subtotal: number
    shippingCost: number
    tax: number
    couponDiscount: number
    grandTotal: number
    items: {
      id: string
      productId: number
      name: string
      slug: string
      price: number
      quantity: number
      variation?: string
      thumbnail: string
      reviewed?: boolean
    }[]
  }
}

export function CustomerOrderDetailsView({ order }: OrderDetailsProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [items, setItems] = useState(order.items)
  const [reviewProduct, setReviewProduct] = useState<{
    id: string | number
    name: string
    thumbnail: string
    orderCode: string
  } | null>(null)

  const handleReorder = () => {
    if (items.length === 0) return
    items.forEach((item) => {
      addItem({
        productId: String(item.productId),
        name: item.name,
        slug: item.slug,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
      })
    })
    router.push("/cart")
  }

  const handleReviewSuccess = (productId: number) => {
    setItems((prev) =>
      prev.map((it) => (it.productId === productId ? { ...it, reviewed: true } : it))
    )
  }

  return (
    <div className="space-y-5">
      {/* Titlebar Matching Laravel aiz-titlebar 1:1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/purchase-history"
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
            title="Back to Purchase History"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Order id: <span className="text-[#1967d2]">{order.code}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReorder}
            className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#d43533] hover:text-[#d43533] transition-colors shadow-2xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reorder
          </button>
          <Link
            href={`/invoice/${order.code}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded bg-[#292933] hover:bg-gray-800 text-white px-4 py-1.5 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Invoice
          </Link>
        </div>
      </div>

      {/* 1. Order Summary Card Matching Laravel 1:1 */}
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

      {/* 2. Order Details Table Card Matching Laravel 1:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 rounded border border-gray-200 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-3.5 bg-gray-50/50">
            <h5 className="text-sm font-bold text-gray-900">Order Details</h5>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">#</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Variation</th>
                  <th className="px-4 py-3 text-center">Quantity</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-center">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((it, idx) => (
                  <tr key={it.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-center text-gray-400 font-medium">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                          <Image
                            src={it.thumbnail || "/assets/img/placeholder.jpg"}
                            alt={it.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.currentTarget
                              if (!target.src.includes("placeholder.jpg")) {
                                target.src = "/assets/img/placeholder.jpg"
                              }
                            }}
                          />
                        </div>
                        <Link
                          href={`/product/${it.slug}`}
                          className="font-medium text-gray-900 hover:text-[#d43533] line-clamp-2 max-w-xs transition-colors"
                        >
                          {it.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500">{it.variation || "-"}</td>
                    <td className="px-4 py-3.5 text-center font-semibold text-gray-900">
                      {it.quantity}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-gray-900">
                      {formatPrice(it.price)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {order.deliveryStatus === "delivered" ? (
                        it.reviewed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <CheckCircle2 className="w-3 h-3" />
                            Reviewed
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setReviewProduct({
                                id: it.productId,
                                name: it.name,
                                thumbnail: it.thumbnail,
                                orderCode: order.code,
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-full bg-amber-500 hover:bg-amber-600 px-3 py-1 text-[11px] font-bold text-white shadow-2xs transition-colors"
                          >
                            <Star className="w-3 h-3 fill-current" />
                            Review
                          </button>
                        )
                      ) : (
                        <span className="text-gray-400 text-[11px]">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Order Amount Breakdown Matching Laravel 1:1 */}
        <div className="lg:col-span-4 rounded border border-gray-200 bg-white shadow-xs p-5 space-y-3.5 h-fit">
          <h5 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
            Order Amount
          </h5>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-gray-900">{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-semibold text-gray-900">{formatPrice(order.tax)}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Coupon Discount</span>
                <span className="font-semibold">-{formatPrice(order.couponDiscount)}</span>
              </div>
            )}
            <hr className="border-gray-200 pt-1" />
            <div className="flex justify-between text-sm font-bold text-gray-900">
              <span>Total</span>
              <span className="text-[#d43533]">{formatPrice(order.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={Boolean(reviewProduct)}
        onClose={() => setReviewProduct(null)}
        product={reviewProduct}
        onSuccess={handleReviewSuccess}
      />
    </div>
  )
}
