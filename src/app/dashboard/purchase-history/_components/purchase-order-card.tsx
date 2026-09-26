"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { Download, ExternalLink, Package, RotateCcw, Star, RefreshCw, MoreVertical, XCircle } from "lucide-react"

export interface OrderItem {
  id: string
  name: string
  slug: string
  price: number
  quantity: number
  thumbnail: string
  reviewed?: boolean
}

export interface OrderRecord {
  code: string
  date: string
  amount: number
  deliveryStatus: string
  paymentStatus: string
  paymentType: string
  itemsCount: number
  shopName?: string
  items?: OrderItem[]
}

interface PurchaseOrderCardProps {
  order: OrderRecord
  onOpenReview: (item: { id: string; name: string; thumbnail: string; orderCode: string }) => void
}

export function PurchaseOrderCard({ order, onOpenReview }: PurchaseOrderCardProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)

  const items = order.items && order.items.length > 0 ? order.items : [
    {
      id: `p-${order.code}-1`,
      name: "Smart Watch Ultra Premium Series",
      slug: "smart-watch-ultra-premium-series",
      price: order.amount,
      quantity: order.itemsCount || 1,
      thumbnail: "/assets/img/placeholder.jpg",
      reviewed: false,
    },
  ]

  const handleReorder = () => {
    items.forEach((item) => {
      addItem({
        productId: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
      })
    })
    router.push("/cart")
  }

  const currentDeliveryStatus = isCancelled ? "cancelled" : order.deliveryStatus

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Bar: Order Code, Shop Name, Badges & Reorder */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/order-confirmed/${order.code}`}
            className="text-sm font-bold text-[#1967d2] hover:underline"
          >
            Order ID - {order.code}
          </Link>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs font-semibold text-gray-700">
            {order.shopName || "Inhouse Products"}
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{order.date}</span>

          {/* Delivery Status Badge */}
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
              currentDeliveryStatus === "delivered"
                ? "bg-emerald-100 text-emerald-800"
                : currentDeliveryStatus === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {currentDeliveryStatus.replace(/_/g, " ")}
          </span>

          {/* Payment Status Badge */}
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
              order.paymentStatus === "paid"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {order.paymentStatus}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReorder}
            className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:border-[#d43533] hover:text-[#d43533] transition-colors"
            title="Reorder items to cart"
          >
            <RefreshCw className="h-3 w-3" />
            Reorder
          </button>

          {/* Options Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded border border-gray-100 bg-white py-1 shadow-lg text-xs"
                onClick={() => setMenuOpen(false)}
              >
                <Link
                  href={`/order-confirmed/${order.code}`}
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                  View Details
                </Link>
                <Link
                  href={`/invoice-print/${order.code}`}
                  target="_blank"
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-3.5 w-3.5 text-gray-400" />
                  Invoice
                </Link>
                <Link
                  href={`/track-order?code=${order.code}`}
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                >
                  <Package className="h-3.5 w-3.5 text-gray-400" />
                  Track Order
                </Link>
                {currentDeliveryStatus === "delivered" && (
                  <Link
                    href={`/dashboard/refund-requests`}
                    className="flex items-center gap-2 px-3 py-1.5 text-amber-700 hover:bg-amber-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
                    Refund Request
                  </Link>
                )}
                {currentDeliveryStatus === "pending" && order.paymentStatus === "unpaid" && !isCancelled && (
                  <button
                    type="button"
                    onClick={() => setIsCancelled(true)}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 text-left"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Cancel Order
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Preview */}
      <div className="divide-y divide-gray-100 pt-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={item.thumbnail || "/assets/img/placeholder.jpg"}
                alt={item.name}
                className="h-12 w-12 rounded object-cover border border-gray-100 shrink-0"
              />
              <div className="truncate">
                <Link
                  href={`/product/${item.slug}`}
                  className="text-xs font-semibold text-gray-900 hover:text-[#d43533] truncate block"
                >
                  {item.name}
                </Link>
                <p className="text-[11px] text-gray-500">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
            </div>

            {/* If delivered, allow writing a review */}
            {currentDeliveryStatus === "delivered" && (
              <button
                type="button"
                onClick={() =>
                  onOpenReview({
                    id: item.id,
                    name: item.name,
                    thumbnail: item.thumbnail,
                    orderCode: order.code,
                  })
                }
                className="shrink-0 inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition-colors"
              >
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                Make a Review
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer Total */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1 text-xs">
        <span className="text-gray-500">Payment: {order.paymentType}</span>
        <span className="font-extrabold text-[#d43533] text-sm">
          Total: {formatPrice(order.amount)}
        </span>
      </div>
    </div>
  )
}
