import React from "react"
import { Metadata } from "next"
import { getOrdersAdmin, getOrderByCode } from "@/services/order-service"
import { getShippingLabelSettings } from "@/services/settings-service"
import { type ShippingLabelData } from "@/app/shipping-label/[code]/_components/shipping-label-view"
import { BulkShippingLabelClient } from "./_components/bulk-shipping-label-client"

export const metadata: Metadata = {
  title: "Bulk Shipping Label Print | Admin Orders | Active eCommerce",
  description: "Print multiple thermal shipping labels simultaneously in 4x6 format",
}

export const dynamic = "force-dynamic"

interface BulkShippingLabelPrintPageProps {
  searchParams: Promise<{ ids?: string; print?: string }>
}

export default async function BulkShippingLabelPrintPage({
  searchParams,
}: BulkShippingLabelPrintPageProps) {
  const { ids, print } = await searchParams
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
    <BulkShippingLabelClient
      labels={labels}
      settings={settings}
      autoPrint={print === "1"}
    />
  )
}
