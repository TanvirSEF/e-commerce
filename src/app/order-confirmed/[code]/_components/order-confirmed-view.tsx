"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Check, ShoppingCart, MapPin, Truck, CreditCard, Download, ArrowRight, Package } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export interface ConfirmedOrderItem {
  id: string
  name: string
  thumbnail?: string
  quantity: number
  price: number
  variation?: string
}

export interface ConfirmedOrder {
  code: string
  date: number
  delivery_status: string
  payment_type: string
  shipping_type: string
  shipping_address: {
    name: string
    email?: string
    address: string
    city: string
    country: string
    phone?: string
  }
  billing_address?: {
    name?: string
    email?: string
    address?: string
    city?: string
    country?: string
  }
  grand_total: number
  items: ConfirmedOrderItem[]
}

interface OrderConfirmedViewProps {
  code: string
  dbOrder?: any
}

export function OrderConfirmedView({ code, dbOrder }: OrderConfirmedViewProps) {
  const [currentOrder] = useState<ConfirmedOrder>(() => {
    if (dbOrder) {
      return {
        code: dbOrder.code,
        date: new Date(dbOrder.date).getTime() || Date.now(),
        delivery_status: dbOrder.status || "pending",
        payment_type: dbOrder.paymentMethod || "Cash on Delivery",
        shipping_type: "Home Delivery",
        shipping_address: {
          name: dbOrder.customerName || "Valued Customer",
          email: "customer@example.com",
          address: dbOrder.shippingAddress || "Dhaka, Bangladesh",
          city: "Dhaka",
          country: "Bangladesh",
          phone: dbOrder.customerPhone || "",
        },
        grand_total: dbOrder.total,
        items: (dbOrder.items || []).map((it: any) => ({
          id: String(it.id),
          name: it.name,
          quantity: it.quantity,
          price: it.price,
          thumbnail: "/assets/img/placeholder.jpg",
        })),
      }
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`order_${code}`) || localStorage.getItem("active_ecom_last_order")
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          // fallback
        }
      }
    }
    return {
      code,
      date: Date.now(),
      delivery_status: "pending",
      payment_type: "Cash on Delivery",
      shipping_type: "Home Delivery",
      shipping_address: {
        name: "Valued Customer",
        email: "customer@example.com",
        address: "Banani, Block C",
        city: "Dhaka",
        country: "Bangladesh",
        phone: "+880 1712 345678",
      },
      billing_address: {
        name: "Valued Customer",
        email: "customer@example.com",
        address: "Banani, Block C",
        city: "Dhaka",
        country: "Bangladesh",
      },
      grand_total: 4760,
      items: [
        {
          id: "mock-1",
          name: "Classic Men's Casual Shirt - Slim Fit Cotton",
          variation: "Blue / L",
          quantity: 1,
          price: 1250,
          thumbnail: "/assets/img/placeholder.jpg",
        },
        {
          id: "mock-2",
          name: "Wireless Noise-Cancelling Bluetooth Over-Ear Headphones",
          variation: "Matte Black",
          quantity: 1,
          price: 3450,
          thumbnail: "/assets/img/placeholder.jpg",
        },
      ],
    }
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-[#f8f9fa] min-h-[85vh] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Step Progress Indicators */}
        <div className="mb-8 grid grid-cols-5 gap-2 text-center text-xs">
          <div className="border-b-4 border-emerald-500 pb-2 text-emerald-600 font-semibold">
            <ShoppingCart className="mx-auto h-5 w-5 mb-1" />
            <span className="hidden sm:inline">1. My Cart</span>
          </div>
          <div className="border-b-4 border-emerald-500 pb-2 text-emerald-600 font-semibold">
            <MapPin className="mx-auto h-5 w-5 mb-1" />
            <span className="hidden sm:inline">2. Shipping Info</span>
          </div>
          <div className="border-b-4 border-emerald-500 pb-2 text-emerald-600 font-semibold">
            <Truck className="mx-auto h-5 w-5 mb-1" />
            <span className="hidden sm:inline">3. Delivery Info</span>
          </div>
          <div className="border-b-4 border-emerald-500 pb-2 text-emerald-600 font-semibold">
            <CreditCard className="mx-auto h-5 w-5 mb-1" />
            <span className="hidden sm:inline">4. Payment</span>
          </div>
          <div className="border-b-4 border-[#d43533] pb-2 text-[#d43533] font-bold">
            <Check className="mx-auto h-5 w-5 mb-1" />
            <span className="hidden sm:inline">5. Confirmation</span>
          </div>
        </div>

        {/* Success Announcement */}
        <div className="text-center py-4 mb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md mb-3">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>
          <h1 className="text-2xl font-bold text-emerald-600">Thank You for Your Order!</h1>
          <p className="mt-1 text-xs text-gray-600">
            A confirmation email has been dispatched to{" "}
            <strong>{currentOrder.shipping_address?.email || "your email address"}</strong>.
          </p>
        </div>

        {/* Order Summary 2-Col Card */}
        <div className="rounded border border-gray-200 bg-white p-5 sm:p-6 shadow-sm mb-6">
          <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5 mb-4">
            Order Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700">
            <div className="space-y-2">
              <div className="flex">
                <span className="w-36 font-semibold text-gray-500">Order date:</span>
                <span>{new Date(currentOrder.date).toLocaleString("en-BD")}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-gray-500">Name:</span>
                <span>{currentOrder.shipping_address?.name}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-gray-500">Email:</span>
                <span>{currentOrder.shipping_address?.email}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-gray-500">Shipping address:</span>
                <span>
                  {currentOrder.shipping_address?.address}, {currentOrder.shipping_address?.city},{" "}
                  {currentOrder.shipping_address?.country}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex">
                <span className="w-36 font-semibold text-gray-500">Order status:</span>
                <span className="rounded bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-800 uppercase">
                  {currentOrder.delivery_status}
                </span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-gray-500">Tracking Code:</span>
                <span className="font-bold text-[#d43533]">{currentOrder.code}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-gray-500">Total amount:</span>
                <span className="font-bold text-gray-900">{formatPrice(currentOrder.grand_total)}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-gray-500">Payment method:</span>
                <span className="capitalize">{currentOrder.payment_type?.replace(/_/g, " ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Items Card */}
        <div className="rounded border border-gray-200 bg-white p-5 sm:p-6 shadow-sm mb-6">
          <div className="text-center pb-4 mb-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-800">
              Order Code: <span className="text-[#d43533]">{currentOrder.code}</span>
            </h2>
            <div className="mt-1 flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>
                Delivery Type: <strong>{currentOrder.shipping_type || "Home Delivery"}</strong>
              </span>
              <span>•</span>
              <span>
                Sold By: <strong>Active eCommerce Inhouse</strong>
              </span>
            </div>
          </div>

          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
            Order Items
          </h5>
          <div className="divide-y divide-gray-100">
            {currentOrder.items?.map((item: ConfirmedOrderItem, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-gray-100 bg-gray-50">
                    <Image
                      src={item.thumbnail || "/assets/img/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/img/placeholder.jpg"
                      }}
                    />
                  </div>
                  <div>
                    <h6 className="text-xs font-semibold text-gray-800 line-clamp-1">{item.name}</h6>
                    <p className="text-[11px] text-gray-400">
                      Qty: {item.quantity} {item.variation && `• ${item.variation}`}
                    </p>
                  </div>
                </div>
                <div className="text-xs font-bold text-[#d43533]">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Print Invoice
            </button>
            <Link
              href={`/track-order?code=${currentOrder.code}`}
              className="inline-flex items-center gap-1.5 rounded border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-[#1967d2] hover:bg-blue-100 transition-colors"
            >
              <Package className="h-3.5 w-3.5" />
              Track Status
            </Link>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 rounded bg-[#d43533] px-5 py-2 text-xs font-bold text-white hover:bg-[#9d1b1a] transition-colors"
          >
            Continue Shopping
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
