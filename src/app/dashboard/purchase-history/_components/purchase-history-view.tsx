"use client"

import React, { useState } from "react"
import { Search } from "lucide-react"
import { PurchaseOrderCard, OrderRecord } from "./purchase-order-card"
import { ReviewModal } from "./review-modal"

const DEFAULT_ORDERS: OrderRecord[] = [
  {
    code: "20260923-847291",
    date: "23 Sep 2026",
    amount: 4760,
    deliveryStatus: "on_the_way",
    paymentStatus: "paid",
    paymentType: "Cash on Delivery",
    itemsCount: 2,
    shopName: "ElectroMart Official Store",
    items: [
      {
        id: "item-101",
        name: "Noise Cancelling Wireless Headphones Pro",
        slug: "noise-cancelling-wireless-headphones-pro",
        price: 3200,
        quantity: 1,
        thumbnail: "/assets/img/placeholder.jpg",
        reviewed: false,
      },
      {
        id: "item-102",
        name: "Fast Charging USB-C Braided Cable 2M",
        slug: "fast-charging-usbc-cable-2m",
        price: 1560,
        quantity: 1,
        thumbnail: "/assets/img/placeholder.jpg",
        reviewed: false,
      },
    ],
  },
  {
    code: "20260918-192842",
    date: "18 Sep 2026",
    amount: 1250,
    deliveryStatus: "delivered",
    paymentStatus: "paid",
    paymentType: "bKash",
    itemsCount: 1,
    shopName: "Inhouse Products",
    items: [
      {
        id: "item-103",
        name: "Premium Cotton Graphic T-Shirt Navy",
        slug: "premium-cotton-graphic-tshirt-navy",
        price: 1250,
        quantity: 1,
        thumbnail: "/assets/img/placeholder.jpg",
        reviewed: false,
      },
    ],
  },
  {
    code: "20260830-671203",
    date: "30 Aug 2026",
    amount: 2440,
    deliveryStatus: "delivered",
    paymentStatus: "paid",
    paymentType: "Nagad",
    itemsCount: 1,
    shopName: "Fashion Hub",
    items: [
      {
        id: "item-104",
        name: "Casual Slim Fit Denim Jeans Dark Blue",
        slug: "casual-slim-fit-denim-jeans-dark-blue",
        price: 2440,
        quantity: 1,
        thumbnail: "/assets/img/placeholder.jpg",
        reviewed: true,
      },
    ],
  },
  {
    code: "20260812-451928",
    date: "12 Aug 2026",
    amount: 5120,
    deliveryStatus: "delivered",
    paymentStatus: "paid",
    paymentType: "Cards (Stripe)",
    itemsCount: 2,
    shopName: "Gadget World",
    items: [
      {
        id: "item-105",
        name: "Wireless Mechanical Gaming Keyboard RGB",
        slug: "wireless-mechanical-gaming-keyboard-rgb",
        price: 5120,
        quantity: 1,
        thumbnail: "/assets/img/placeholder.jpg",
        reviewed: false,
      },
    ],
  },
]

const TABS = ["All", "Unpaid", "Confirmed", "Picked Up", "Delivered", "To Review"]

interface PurchaseHistoryViewProps {
  initialOrders?: any[]
}

export function PurchaseHistoryView({ initialOrders }: PurchaseHistoryViewProps) {
  const [activeTab, setActiveTab] = useState("All")
  const [deliveryFilter, setDeliveryFilter] = useState("all")
  const [search, setSearch] = useState("")

  const [reviewProduct, setReviewProduct] = useState<{
    id: string
    name: string
    thumbnail: string
    orderCode: string
  } | null>(null)

  const allOrders: OrderRecord[] =
    initialOrders && initialOrders.length > 0 ? initialOrders : DEFAULT_ORDERS

  // Filtering logic matching Active eCommerce
  const filteredOrders = allOrders.filter((order) => {
    // Tab filter
    if (activeTab === "Unpaid" && order.paymentStatus !== "unpaid") return false
    if (activeTab === "Confirmed" && order.deliveryStatus !== "confirmed") return false
    if (activeTab === "Picked Up" && order.deliveryStatus !== "picked_up") return false
    if (activeTab === "Delivered" && order.deliveryStatus !== "delivered") return false
    if (activeTab === "To Review") {
      const hasUnreviewed =
        order.deliveryStatus === "delivered" &&
        order.items?.some((i) => !i.reviewed)
      if (!hasUnreviewed) return false
    }

    // Delivery dropdown filter
    if (deliveryFilter !== "all" && order.deliveryStatus !== deliveryFilter) {
      return false
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchCode = (order.code || "").toLowerCase().includes(q)
      const matchShop = (order.shopName || "").toLowerCase().includes(q)
      const matchItem = order.items?.some((i) => i.name.toLowerCase().includes(q))
      if (!matchCode && !matchShop && !matchItem) return false
    }

    return true
  })

  return (
    <div className="space-y-4">
      {/* Header and Filter Controls */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Purchase History</h1>
            <p className="text-xs text-gray-500">
              Track, view details, reorder, or review past purchases
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Delivery Status Dropdown Filter */}
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
                  ? "bg-[#d43533] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center text-gray-500">
          <p className="text-sm font-semibold">No orders found</p>
          <p className="text-xs text-gray-400 mt-1">
            Try adjusting your search filters or browse other tabs.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <PurchaseOrderCard
              key={order.code}
              order={order}
              onOpenReview={(item) => setReviewProduct(item)}
            />
          ))}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={Boolean(reviewProduct)}
        onClose={() => setReviewProduct(null)}
        product={reviewProduct}
      />
    </div>
  )
}
