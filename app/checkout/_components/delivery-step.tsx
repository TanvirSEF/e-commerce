"use client"

import React from "react"
import Image from "next/image"
import { CartItem } from "@/lib/context/cart-context"
import { Truck, Store } from "lucide-react"

interface DeliveryStepProps {
  items: CartItem[]
  deliveryType: "home_delivery" | "pickup_point" | "carrier"
  setDeliveryType: (val: "home_delivery" | "pickup_point" | "carrier") => void
  pickupPoint: string
  setPickupPoint: (val: string) => void
  carrier: string
  setCarrier: (val: string) => void
}

const PICKUP_POINTS = [
  { id: "hub-1", name: "Dhanmondi Hub (Road 27)", phone: "+880 1711 001122" },
  { id: "hub-2", name: "Banani Hub (Kemal Ataturk Ave)", phone: "+880 1711 334455" },
  { id: "hub-3", name: "Uttara Sector 7 Hub", phone: "+880 1711 667788" },
]

const CARRIERS = [
  { id: "steadfast", name: "Steadfast Courier", logo: "/assets/img/cards/steadfast.png", transit: "1-2 Days", price: 70 },
  { id: "pathao", name: "Pathao Express", logo: "/assets/img/cards/pathao.png", transit: "Same/Next Day", price: 85 },
  { id: "redx", name: "RedX Logistics", logo: "/assets/img/cards/redx.png", transit: "2-3 Days", price: 60 },
]

export function DeliveryStep({
  items,
  deliveryType,
  setDeliveryType,
  pickupPoint,
  setPickupPoint,
  carrier,
  setCarrier,
}: DeliveryStepProps) {
  return (
    <div className="space-y-6">
      {/* Products in this delivery batch */}
      <div className="rounded border border-gray-100 bg-gray-50/50 p-3 sm:p-4">
        <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
          Delivery Package ({items.length} Products)
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2.5 bg-white p-2 rounded border border-gray-100">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-gray-50 border border-gray-100">
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/img/placeholder.jpg"
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
                <p className="text-[11px] text-gray-500">
                  Qty: {item.quantity} {item.variation && `• ${item.variation}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Type Radios */}
      <div>
        <h5 className="text-sm font-bold text-gray-800 mb-3">Choose Delivery Type</h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Home Delivery */}
          <label
            onClick={() => setDeliveryType("home_delivery")}
            className={`flex items-center gap-3 p-3.5 rounded border cursor-pointer transition-all ${
              deliveryType === "home_delivery"
                ? "border-[#d43533] bg-red-50/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="delivery_type"
              checked={deliveryType === "home_delivery"}
              onChange={() => setDeliveryType("home_delivery")}
              className="h-4 w-4 text-[#d43533] focus:ring-[#d43533]"
            />
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                <Truck className="h-3.5 w-3.5 text-[#d43533]" />
                Home Delivery
              </div>
              <div className="text-[11px] text-gray-500">Standard (2-3 days)</div>
            </div>
          </label>

          {/* Local Pickup */}
          <label
            onClick={() => setDeliveryType("pickup_point")}
            className={`flex items-center gap-3 p-3.5 rounded border cursor-pointer transition-all ${
              deliveryType === "pickup_point"
                ? "border-[#d43533] bg-red-50/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="delivery_type"
              checked={deliveryType === "pickup_point"}
              onChange={() => setDeliveryType("pickup_point")}
              className="h-4 w-4 text-[#d43533] focus:ring-[#d43533]"
            />
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                <Store className="h-3.5 w-3.5 text-[#ffc519]" />
                Local Pickup
              </div>
              <div className="text-[11px] text-gray-500">Free from nearest Hub</div>
            </div>
          </label>

          {/* Carrier Wise */}
          <label
            onClick={() => setDeliveryType("carrier")}
            className={`flex items-center gap-3 p-3.5 rounded border cursor-pointer transition-all ${
              deliveryType === "carrier"
                ? "border-[#d43533] bg-red-50/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="delivery_type"
              checked={deliveryType === "carrier"}
              onChange={() => setDeliveryType("carrier")}
              className="h-4 w-4 text-[#d43533] focus:ring-[#d43533]"
            />
            <div>
              <div className="text-xs font-bold text-gray-800">Courier Delivery</div>
              <div className="text-[11px] text-gray-500">Fast partner couriers</div>
            </div>
          </label>
        </div>
      </div>

      {/* Pickup Point Selection Dropdown */}
      {deliveryType === "pickup_point" && (
        <div className="rounded border border-gray-200 bg-gray-50/50 p-4 animate-in fade-in duration-200">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Select Pickup Point Hub:
          </label>
          <select
            value={pickupPoint}
            onChange={(e) => setPickupPoint(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#d43533] focus:outline-none"
          >
            {PICKUP_POINTS.map((hub) => (
              <option key={hub.id} value={hub.name}>
                {hub.name} (Contact: {hub.phone})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Carrier Selection list */}
      {deliveryType === "carrier" && (
        <div className="space-y-2 pt-1 animate-in fade-in duration-200">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Choose Preferred Courier:
          </label>
          <div className="space-y-2">
            {CARRIERS.map((c) => (
              <label
                key={c.id}
                onClick={() => setCarrier(c.name)}
                className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-all ${
                  carrier === c.name
                    ? "border-[#d43533] bg-red-50/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="carrier_choice"
                    checked={carrier === c.name}
                    onChange={() => setCarrier(c.name)}
                    className="h-4 w-4 text-[#d43533] focus:ring-[#d43533]"
                  />
                  <div className="relative h-7 w-16 overflow-hidden">
                    <Image
                      src={c.logo}
                      alt={c.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/img/placeholder.jpg"
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">{c.name}</div>
                    <div className="text-[10px] text-gray-400">Transit: {c.transit}</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-[#d43533]">৳{c.price}</div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
