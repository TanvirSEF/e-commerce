"use client"

import React, { useState } from "react"
import { Truck, CheckCircle2, Clock, DollarSign, Package, MapPin, Phone, AlertCircle } from "lucide-react"
import type { DeliveryBoy } from "@/db/schema/delivery-boy"
import type { DeliveryBoyOrderItem } from "@/services/delivery-boy-service"
import { confirmDeliveryDropAction } from "@/app/actions/ecommerce-actions"

interface DeliveryBoyDashboardViewProps {
  driver: DeliveryBoy
  initialDeliveries?: DeliveryBoyOrderItem[]
}

export function DeliveryBoyDashboardView({
  driver,
  initialDeliveries = [],
}: DeliveryBoyDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"assigned" | "completed">("assigned")
  const [deliveries, setDeliveries] = useState<DeliveryBoyOrderItem[]>(initialDeliveries)
  const [confirmedCode, setConfirmedCode] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cashCollected, setCashCollected] = useState(parseFloat(driver.totalCollection || "0"))

  const handleConfirmDrop = async (order: DeliveryBoyOrderItem) => {
    setIsSubmitting(true)
    try {
      const res = await confirmDeliveryDropAction({
        orderId: order.id,
        deliveryBoyId: driver.id,
        collectedAmount: parseFloat(order.amount),
        paymentType: order.paymentType,
      })

      if (res && res.success) {
        setConfirmedCode(order.code)
        setDeliveries((prev) => prev.filter((d) => d.id !== order.id))
        if (order.paymentType.includes("Cash")) {
          setCashCollected((prev) => prev + parseFloat(order.amount))
        }
        setTimeout(() => setConfirmedCode(null), 3500)
      }
    } catch (err) {
      console.error("Failed to confirm delivery drop:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      {/* Top Mobile Bar */}
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d43533] text-white flex items-center justify-center font-bold">
              {driver.name[0]}
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">{driver.name}</h1>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> On Shift · {driver.zoneName}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Cash in Hand</span>
            <span className="font-bold text-amber-400 text-sm">${cashCollected.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {/* Driver Stat Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Pending Drops</span>
            <div className="text-2xl font-black text-slate-900">{deliveries.length}</div>
            <span className="text-[11px] text-blue-600 font-medium">Ready for dispatch</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Earned Pay</span>
            <div className="text-2xl font-black text-emerald-600">${driver.totalEarnings}</div>
            <span className="text-[11px] text-slate-400">Calculated fees</span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-200 rounded-xl p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("assigned")}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              activeTab === "assigned" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Assigned Drops ({deliveries.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              activeTab === "completed" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Completed Shifts
          </button>
        </div>

        {/* Deliveries List */}
        <div className="space-y-3">
          {deliveries.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm text-center space-y-2">
              <Package className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600 font-semibold">No pending drops assigned</p>
              <p className="text-[11px] text-slate-400">All parcels on your shift have been delivered or none are pending.</p>
            </div>
          ) : (
            deliveries.map((d) => (
              <div key={d.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-mono text-xs font-bold text-slate-900">{d.code}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {d.paymentType}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="font-bold text-slate-900 text-sm">{d.customer}</div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-[#d43533]" />
                    <a href={`tel:${d.phone}`} className="text-blue-600 font-semibold">{d.phone}</a>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-500 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{d.address}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Collect from Customer</span>
                    <span className="text-base font-black text-slate-900">${d.amount}</span>
                  </div>
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleConfirmDrop(d)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Drop
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation toast */}
      {confirmedCode && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4" />
          Order {confirmedCode} marked as delivered!
        </div>
      )}
    </div>
  )
}
