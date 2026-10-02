"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { PurchaseOrderCard } from "./purchase-order-card"
import { ReviewModal } from "./review-modal"
import type { CustomerOrderRecord } from "@/services/order-service"

const TABS = ["All", "Unpaid", "Confirmed", "Picked Up", "Delivered", "To Review"]

interface PurchaseHistoryViewProps {
  initialOrders?: CustomerOrderRecord[]
}

export function PurchaseHistoryView({ initialOrders = [] }: PurchaseHistoryViewProps) {
  const [orders, setOrders] = useState<CustomerOrderRecord[]>(initialOrders)
  const [activeTab, setActiveTab] = useState("All")
  const [deliveryFilter, setDeliveryFilter] = useState("all")
  const [search, setSearch] = useState("")

  const [reviewProduct, setReviewProduct] = useState<{
    id: string | number
    name: string
    thumbnail: string
    orderCode: string
  } | null>(null)

  const handleOrderCancelled = (code: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.code === code ? { ...o, deliveryStatus: "cancelled" } : o))
    )
  }

  const handleReviewSuccess = (productId: number) => {
    setOrders((prev) =>
      prev.map((o) => ({
        ...o,
        items: o.items.map((it) => (it.productId === productId ? { ...it, reviewed: true } : it)),
      }))
    )
  }

  // Filtering logic matching Laravel Active eCommerce CMS
  const filteredOrders = orders.filter((order) => {
    // 1. Tab Filter
    if (activeTab === "Unpaid" && order.paymentStatus !== "unpaid") return false
    if (activeTab === "Confirmed" && order.deliveryStatus !== "confirmed") return false
    if (activeTab === "Picked Up" && order.deliveryStatus !== "picked_up") return false
    if (activeTab === "Delivered" && order.deliveryStatus !== "delivered") return false
    if (activeTab === "To Review") {
      const hasUnreviewed =
        order.deliveryStatus === "delivered" && order.items?.some((i) => !i.reviewed)
      if (!hasUnreviewed) return false
    }

    // 2. Dropdown Filter
    if (deliveryFilter !== "all" && order.deliveryStatus !== deliveryFilter) {
      return false
    }

    // 3. Search Filter
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchCode = (order.code || "").toLowerCase().includes(q)
      const matchShop = (order.shopName || "").toLowerCase().includes(q)
      const matchItem = order.items?.some((i) => i.name.toLowerCase().includes(q))
      if (!matchCode && !matchItem && !matchShop) return false
    }

    return true
  })

  return (
    <div className="space-y-4">
      {/* Title & Tabs / Filters Container Matching Laravel aiz-titlebar 1:1 */}
      <div className="rounded border border-gray-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Purchase History</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Track, view details, reorder, or review past purchases
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Delivery Status Dropdown matching Laravel selectpicker */}
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-[#d43533] focus:outline-none"
            >
              <option value="all">All Delivery Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="picked_up">Picked Up</option>
              <option value="on_the_way">On The Way</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <input
                type="text"
                placeholder="Search orders or products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded border border-gray-300 pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Status Tabs Matching Active eCommerce */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-[#d43533] text-white shadow-2xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        /* Empty State Matching Laravel 1:1 */
        <div className="rounded border border-gray-200 bg-white p-12 text-center shadow-xs">
          <div className="relative mx-auto w-32 h-24 mb-3">
            <Image
              src="/assets/img/empty.svg"
              alt="No orders found"
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.currentTarget
                if (!target.src.includes("placeholder")) {
                  target.src = "/assets/img/nothing.svg"
                }
              }}
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-700">No orders found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {orders.length === 0
              ? "You haven't placed any orders yet. Start exploring our catalog!"
              : "Try adjusting your search filters or browse other tabs."}
          </p>
          {orders.length === 0 && (
            <div className="mt-4">
              <Link
                href="/products"
                className="inline-flex rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors shadow-2xs"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredOrders.map((order) => (
            <PurchaseOrderCard
              key={order.code}
              order={order}
              onOpenReview={(item) => setReviewProduct(item)}
              onOrderCancelled={handleOrderCancelled}
            />
          ))}
        </div>
      )}

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
