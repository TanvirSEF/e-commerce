"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { Download, Eye, RefreshCw, MoreVertical, X, AlertTriangle, Loader2 } from "lucide-react"
import { cancelOrderAction } from "@/app/actions/customer-order-actions"
import type { CustomerOrderRecord, CustomerOrderItem } from "@/services/order-service"

export type { CustomerOrderRecord as OrderRecord, CustomerOrderItem as OrderItem }

interface PurchaseOrderCardProps {
  order: CustomerOrderRecord
  onOpenReview: (item: { id: string | number; name: string; thumbnail: string; orderCode: string }) => void
  onOrderCancelled?: (code: string) => void
}

export function PurchaseOrderCard({ order, onOpenReview, onOrderCancelled }: PurchaseOrderCardProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus)

  const items = order.items || []

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
      const res = await cancelOrderAction(order.numericId, order.code)
      if (res.success) {
        setDeliveryStatus("cancelled")
        setCancelModalOpen(false)
        onOrderCancelled?.(order.code)
      } else {
        alert(res.message || "Failed to cancel order.")
      }
    } catch {
      alert("Failed to cancel order. Please try again.")
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="rounded border border-gray-200 bg-white p-4 shadow-xs hover:shadow-md transition-shadow">
      {/* Top Row: Order ID, Status Badges, Date & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Order ID Link matching Laravel aiz deep-blue 1:1 */}
          <Link
            href={`/dashboard/purchase-history/${order.code}`}
            className="text-sm sm:text-base font-bold text-[#1967d2] hover:underline"
          >
            Order ID - {order.code}
          </Link>

          {/* Delivery Status Badge */}
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
              deliveryStatus === "delivered"
                ? "bg-emerald-100 text-emerald-800"
                : deliveryStatus === "cancelled"
                ? "bg-red-100 text-red-800"
                : deliveryStatus === "on_the_way"
                ? "bg-sky-100 text-sky-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {deliveryStatus.replace(/_/g, " ")}
          </span>

          {/* Payment Status Badge */}
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
              order.paymentStatus === "paid"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {order.paymentStatus}
          </span>
        </div>

        {/* Action Buttons: Reorder & Options Dropdown */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReorder}
            className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3.5 py-1 text-xs font-semibold text-gray-700 hover:border-[#d43533] hover:text-[#d43533] transition-colors shadow-2xs"
            title="Reorder products to cart"
          >
            <RefreshCw className="h-3 w-3" />
            Reorder
          </button>

          {/* Options Dropdown Matching Active eCommerce */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center gap-1 rounded bg-[#292933] hover:bg-gray-800 text-white px-3.5 py-1 text-xs font-semibold shadow-2xs transition-colors"
            >
              Options
              <MoreVertical className="h-3 w-3" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded border border-gray-200 bg-white py-1 shadow-lg text-xs"
                onClick={() => setMenuOpen(false)}
              >
                <Link
                  href={`/dashboard/purchase-history/${order.code}`}
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50 hover:text-[#d43533]"
                >
                  <Eye className="h-3.5 w-3.5 text-gray-400" />
                  View
                </Link>
                <Link
                  href={`/invoice/${order.code}`}
                  target="_blank"
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50 hover:text-[#d43533]"
                >
                  <Download className="h-3.5 w-3.5 text-gray-400" />
                  Invoice
                </Link>
                {deliveryStatus === "pending" && order.paymentStatus === "unpaid" && (
                  <button
                    type="button"
                    onClick={() => setCancelModalOpen(true)}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 text-left"
                  >
                    <X className="h-3.5 w-3.5 text-red-500" />
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-header: Seller/Store & Date */}
      <div className="flex items-center justify-between py-2 text-xs text-gray-500 border-b border-dashed border-gray-200">
        <span className="font-semibold text-gray-800">{order.shopName || "Inhouse Products"}</span>
        <span>Date: {order.date}</span>
      </div>

      {/* Order Items List */}
      <div className="divide-y divide-gray-100 pt-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2.5 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-12 w-12 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                <Image
                  src={item.thumbnail || "/assets/img/placeholder.jpg"}
                  alt={item.name}
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
              <div className="truncate">
                <Link
                  href={`/product/${item.slug}`}
                  className="text-xs sm:text-sm font-medium text-gray-900 hover:text-[#d43533] truncate block"
                  title={item.name}
                >
                  {item.name}
                </Link>
                {item.variation && (
                  <p className="text-[11px] text-gray-400">{item.variation}</p>
                )}
                <p className="text-xs text-gray-500 mt-0.5">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
            </div>

            {/* Review status matching Laravel single_purchase_history 1:1 */}
            <div className="shrink-0 text-right">
              {deliveryStatus === "delivered" ? (
                item.reviewed ? (
                  <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-700">
                    Reviewed
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenReview({
                        id: item.productId,
                        name: item.name,
                        thumbnail: item.thumbnail,
                        orderCode: order.code,
                      })
                    }
                    className="inline-block rounded-full bg-amber-500 hover:bg-amber-600 px-3.5 py-1 text-[11px] font-bold text-white shadow-2xs transition-colors"
                  >
                    Review
                  </button>
                )
              ) : (
                <span className="text-xs text-gray-400 font-medium">Not Delivered</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer: Payment Method & Total */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1 text-xs">
        <span className="text-gray-500">
          Payment Method: <strong className="text-gray-700">{order.paymentType}</strong>
        </span>
        <span className="text-sm font-bold text-[#d43533]">
          Total: {formatPrice(order.amount)}
        </span>
      </div>

      {/* Cancel Order Confirmation Modal Matching Laravel 1:1 */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="relative w-full max-w-sm rounded bg-white p-6 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Cancel Confirmation</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure to cancel order <strong>#{order.code}</strong>? This will release items back to stock.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
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
    </div>
  )
}
