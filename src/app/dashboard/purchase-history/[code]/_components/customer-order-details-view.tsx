"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"
import {
  ArrowLeft,
  Printer,
  RefreshCw,
  Star,
  CheckCircle2,
  X,
  RotateCcw,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { CustomerOrderSummaryCard } from "./customer-order-summary-card"
import { ReviewModal } from "../../_components/review-modal"
import { RefundRequestModal, type RefundModalItem } from "../../_components/refund-request-modal"
import { cancelOrderAction } from "@/app/actions/customer-order-actions"

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
  const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null)

  const [reviewProduct, setReviewProduct] = useState<{
    id: string | number
    name: string
    thumbnail: string
    orderCode: string
  } | null>(null)

  const [refundModalItem, setRefundModalItem] = useState<RefundModalItem | null>(null)

  const canCancel =
    deliveryStatus === "pending" &&
    (order.paymentStatus === "unpaid" || order.paymentType === "wallet")

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

  const handleConfirmCancel = async () => {
    setCancelling(true)
    try {
      const res = await cancelOrderAction(order.id, order.code)
      if (res.success) {
        setDeliveryStatus("cancelled")
        setIsCancelModalOpen(false)
      } else {
        setCancelFeedback(res.message || "Failed to cancel order.")
      }
    } catch {
      setCancelFeedback("Network error. Please try again.")
    } finally {
      setCancelling(false)
    }
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
          {canCancel && (
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white transition-colors shadow-2xs"
            >
              <X className="h-3.5 w-3.5" />
              Cancel Order
            </button>
          )}
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

      {/* 1. Order Summary Card Subcomponent */}
      <CustomerOrderSummaryCard order={{ ...order, deliveryStatus }} />

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
                  <th className="px-4 py-3 text-center">Action</th>
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
                      {deliveryStatus === "delivered" ? (
                        <div className="flex items-center justify-center gap-1.5">
                          {it.reviewed ? (
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
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setRefundModalItem({
                                id: it.id,
                                productId: it.productId,
                                name: it.name,
                                thumbnail: it.thumbnail,
                                price: it.price,
                                quantity: it.quantity,
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 hover:bg-[#d43533] text-[#d43533] hover:text-white px-3 py-1 text-[11px] font-bold shadow-2xs transition-colors"
                            title="Request a refund for this item"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Refund
                          </button>
                        </div>
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
            Order Ammount
          </h5>
          <div className="space-y-2 text-xs divide-y divide-gray-100">
            <div className="flex justify-between py-1.5 text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between py-1.5 text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-gray-900">{formatPrice(order.shippingCost)}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div className="flex justify-between py-1.5 text-emerald-600">
                <span>Coupon</span>
                <span className="font-bold">-{formatPrice(order.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 text-sm font-bold text-gray-900">
              <span>Total</span>
              <span className="text-base text-[#d43533]">{formatPrice(order.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2 rounded-full bg-amber-50">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-gray-900">Cancel Order #{order.code}?</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to cancel this order?
              {order.paymentType === "wallet" && (
                <span className="block mt-1 font-semibold text-emerald-700">
                  Your payment of {formatPrice(order.grandTotal)} will be automatically refunded back to your wallet.
                </span>
              )}
            </p>
            {cancelFeedback && (
              <p className="text-xs font-medium text-red-600 bg-red-50 p-2 rounded border border-red-200">
                {cancelFeedback}
              </p>
            )}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={cancelling}
                className="rounded border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                No, Keep It
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="inline-flex items-center gap-1.5 rounded bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow-2xs"
              >
                {cancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewProduct && (
        <ReviewModal
          isOpen={!!reviewProduct}
          onClose={() => setReviewProduct(null)}
          product={reviewProduct}
          onSuccess={(productId) => {
            setItems((prev) =>
              prev.map((it) =>
                it.productId === productId ? { ...it, reviewed: true } : it
              )
            )
            setReviewProduct(null)
          }}
        />
      )}

      {/* Refund Request Modal */}
      <RefundRequestModal
        isOpen={!!refundModalItem}
        onClose={() => setRefundModalItem(null)}
        orderCode={order.code}
        orderId={order.id}
        item={refundModalItem}
      />
    </div>
  )
}
