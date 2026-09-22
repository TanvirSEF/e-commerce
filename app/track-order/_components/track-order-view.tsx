"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, Download, ExternalLink, Check, Truck } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export interface TrackedOrder {
  code: string
  date: number
  delivery_status: string
  payment_type: string
  payment_status: string
  shipping_type: string
  carrier?: string
  shipping_address?: {
    name?: string
    address?: string
    city?: string
    country?: string
  }
  grand_total: number
  items?: Array<{ name: string; quantity: number; price: number }>
}

function lookupOrder(code: string): TrackedOrder | null {
  const trimmed = code.trim()
  if (!trimmed) return null

  if (typeof window !== "undefined") {
    const stored =
      localStorage.getItem(`order_${trimmed}`) || localStorage.getItem("active_ecom_last_order")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.code === trimmed || trimmed.length > 5) {
          return parsed
        }
      } catch {
        // fallback
      }
    }
  }

  // Demo fallback
  if (trimmed.toUpperCase() === "DEMO") {
    return {
      code: "DEMO-2026",
      date: Date.now() - 3600000 * 24,
      delivery_status: "on_the_way",
      payment_type: "bKash",
      payment_status: "paid",
      shipping_type: "Home Delivery",
      carrier: "Steadfast Courier",
      shipping_address: {
        name: "Tanvir Ahmed",
        address: "House 12, Road 4, Banani",
        city: "Dhaka",
        country: "Bangladesh",
      },
      grand_total: 4760,
      items: [{ name: "Classic Men's Casual Shirt", quantity: 1, price: 1250 }],
    }
  }

  return null
}

export function TrackOrderView() {
  const searchParams = useSearchParams()
  const initialCode = searchParams.get("code") || ""

  const [trackingCode, setTrackingCode] = useState(initialCode)
  const [searchedOrder, setSearchedOrder] = useState<TrackedOrder | null>(() => {
    return initialCode ? lookupOrder(initialCode) : null
  })
  const [notFound, setNotFound] = useState(() => {
    return Boolean(initialCode && !lookupOrder(initialCode))
  })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = trackingCode.trim()
    if (!trimmed) return

    const local = lookupOrder(trimmed)
    if (local) {
      setSearchedOrder(local)
      setNotFound(false)
      return
    }

    try {
      const res = await fetch(`/api/orders?code=${encodeURIComponent(trimmed)}`)
      const data = await res.json()
      if (data.success && data.order) {
        setSearchedOrder({
          code: data.order.code,
          date: data.order.date ? data.order.date * 1000 : Date.now(),
          delivery_status: data.order.delivery_status || "pending",
          payment_type: data.order.payment_type || "Cash on Delivery",
          payment_status: data.order.payment_status || "unpaid",
          shipping_type: "Home Delivery",
          carrier: "Steadfast Courier",
          shipping_address: data.order.shipping_address,
          grand_total: Number(data.order.grand_total || 0),
          items: (data.order.items || []).map(
            (i: { variation?: string; quantity?: number; price?: number }) => ({
              name: i.variation || "Product Item",
              quantity: i.quantity || 1,
              price: i.price || 0,
            })
          ),
        })
        setNotFound(false)
        return
      }
    } catch {
      // ignore
    }

    setSearchedOrder(null)
    setNotFound(true)
  }

  const steps = [
    { key: "placed", label: "Order Placed", desc: "Order recorded in system" },
    { key: "paid", label: "Payment Successful", desc: "Payment verified" },
    { key: "confirmed", label: "Order Confirmed", desc: "Seller packed goods" },
    { key: "on_the_way", label: "On The Way", desc: "Dispatched to delivery partner" },
    { key: "delivered", label: "Delivered", desc: "Package handed over" },
  ]

  return (
    <div className="bg-[#f8f9fa] min-h-[85vh] py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Track Order</h1>

        {/* Search Card */}
        <div className="rounded border border-gray-200 bg-white p-5 sm:p-6 shadow-sm mb-6">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
            Check Your Order Status
          </p>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="Enter Tracking Code (e.g. 20260923-123456 or DEMO)"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                className="w-full rounded border border-gray-300 px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#d43533] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded bg-[#d43533] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              Track Order
            </button>
          </form>
        </div>

        {notFound && (
          <div className="rounded border border-red-200 bg-red-50 p-4 text-center text-xs text-red-600 mb-6">
            No order found with code &quot;{trackingCode}&quot;. Please verify and try again.
          </div>
        )}

        {searchedOrder ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Courier Banner */}
            <div className="flex items-center gap-4 rounded-full border border-blue-200 bg-blue-50/70 py-2.5 px-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1967d2] text-white">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  {searchedOrder.carrier || "Express Delivery"}
                </h4>
                <p className="text-[11px] text-gray-500">From Checkout to Doorstep</p>
              </div>
            </div>

            {/* From / To Routing */}
            <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-semibold text-gray-400">From</span>
                  <p className="text-xs font-bold text-gray-800">Banani Fulfillment Center</p>
                  <p className="text-[11px] text-gray-500">Dhaka, Bangladesh</p>
                </div>
                <div className="flex-1 mx-4 border-t border-dashed border-gray-300"></div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-400">To</span>
                  <p className="text-xs font-bold text-gray-800">
                    {searchedOrder.shipping_address?.name || "Customer Destination"}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {searchedOrder.shipping_address?.address}, {searchedOrder.shipping_address?.city}
                  </p>
                </div>
              </div>

              {/* Step Timeline */}
              <div className="pt-6 pb-2">
                <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {steps.map((s, index) => {
                    const isDone = index <= 2
                    const isCurrent = index === 3

                    return (
                      <div key={s.key} className="relative flex items-start gap-4">
                        <div
                          className={`absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white text-xs ${
                            isDone
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : isCurrent
                              ? "border-blue-500 bg-blue-50 text-blue-600 animate-pulse"
                              : "border-gray-300 text-gray-300"
                          }`}
                        >
                          {isDone ? (
                            <Check className="h-3 w-3 stroke-[3]" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-current" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h5
                            className={`text-xs font-bold ${
                              isDone || isCurrent ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {s.label}
                          </h5>
                          <p className="text-[11px] text-gray-500">{s.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary & Actions */}
            <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    <span className="font-semibold text-gray-400">Order ID: </span>
                    <strong className="text-gray-900">{searchedOrder.code}</strong>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-400">Payment: </span>
                    <span className="capitalize">{searchedOrder.payment_type?.replace(/_/g, " ")}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-400">Total: </span>
                    <strong className="text-[#d43533]">{formatPrice(searchedOrder.grand_total)}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Invoice
                  </button>
                  <Link
                    href={`/order-confirmed/${searchedOrder.code}`}
                    className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors"
                  >
                    Details
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty / Initial State graphic */
          <div className="rounded border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="relative mx-auto h-48 w-full max-w-sm mb-4">
              <Image
                src="/assets/img/order-tracking-map.png"
                alt="Order tracking preview"
                fill
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              Enter your tracking code above to monitor real-time fulfillment and transit progress.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
