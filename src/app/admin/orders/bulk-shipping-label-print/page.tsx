import React from "react"
import { Metadata } from "next"
import { getOrdersAdmin, getOrderByCode } from "@/services/order-service"
import { getShippingLabelSettings } from "@/services/settings-service"
import {
  ShippingLabelView,
  type ShippingLabelData,
} from "@/app/shipping-label/[code]/_components/shipping-label-view"

export const metadata: Metadata = {
  title: "Bulk Shipping Label Print | Admin Orders | Active eCommerce",
  description: "Print multiple thermal shipping labels simultaneously",
}

interface BulkShippingLabelPrintPageProps {
  searchParams: Promise<{ ids?: string }>
}

export default async function BulkShippingLabelPrintPage({
  searchParams,
}: BulkShippingLabelPrintPageProps) {
  const { ids } = await searchParams
  const rawIds = ids ? ids.split(",").map((s) => s.trim()).filter(Boolean) : []

  const settings = await getShippingLabelSettings()
  let labels: ShippingLabelData[] = []

  if (rawIds.length > 0) {
    const fetched = await Promise.all(rawIds.map((code) => getOrderByCode(code)))
    labels = fetched.filter(Boolean).map((order) => ({
      orderCode: order!.code,
      trackingCode: order!.trackingCode || `TRK-${order!.code}`,
      date: order!.date,
      senderName: settings.senderName,
      senderAddress: settings.senderAddress,
      senderPhone: settings.senderPhone,
      customerName: order!.customerName,
      customerPhone: order!.customerPhone,
      shippingAddress: order!.shippingAddress,
      items: order!.items.map((i) => ({ name: i.name, quantity: i.quantity })),
      totalAmount: order!.total,
      paymentMethod: order!.paymentMethod,
      paymentStatus: order!.paymentStatus,
    }))
  }

  if (labels.length === 0) {
    const { orders: all } = await getOrdersAdmin({ limit: 4 })
    labels = all.map((order) => ({
      orderCode: order.code,
      trackingCode: `TRK-${order.code}`,
      date: order.date,
      senderName: settings.senderName,
      senderAddress: settings.senderAddress,
      senderPhone: settings.senderPhone,
      customerName: order.customerName,
      customerPhone: "+880 1700 000000",
      shippingAddress: "Dhaka, Bangladesh",
      items: [{ name: "Standard Catalog Item", quantity: order.itemCount }],
      totalAmount: order.total,
      paymentMethod: (order as any).paymentMethod || "Cash on Delivery",
      paymentStatus: order.paymentStatus,
    }))
  }

  return (
    <div className="bg-slate-100 min-h-screen py-8 print:bg-white print:py-0">
      <div className="max-w-2xl mx-auto space-y-8 print:space-y-0 print:max-w-none">
        {labels.map((lbl) => (
          <div
            key={lbl.orderCode}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 print:border-none print:shadow-none print:break-after-page"
          >
            <ShippingLabelView labelData={lbl} settings={settings} />
          </div>
        ))}
      </div>
    </div>
  )
}
