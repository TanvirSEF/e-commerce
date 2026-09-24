import React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getOrderByCode } from "@/services/order-service"
import { getShippingLabelSettings } from "@/services/settings-service"
import { ShippingLabelView, ShippingLabelData } from "./_components/shipping-label-view"

interface PageProps {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params
  return {
    title: `Shipping Label #${code} | Active eCommerce`,
    description: `Printable thermal shipping label for Order #${code}`,
  }
}

export default async function ShippingLabelPage({ params }: PageProps) {
  const { code } = await params
  const [order, settings] = await Promise.all([
    getOrderByCode(code),
    getShippingLabelSettings(),
  ])

  const labelData: ShippingLabelData = order
    ? {
        orderCode: order.code,
        trackingCode: order.trackingCode || `TRK-${order.code}`,
        date: order.date,
        senderName: settings.senderName,
        senderAddress: settings.senderAddress,
        senderPhone: settings.senderPhone,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        items: order.items.map((i) => ({ name: i.name, quantity: i.quantity })),
        totalAmount: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
      }
    : {
        orderCode: code,
        trackingCode: `TRK-${code}`,
        date: new Date().toISOString().slice(0, 10),
        senderName: settings.senderName,
        senderAddress: settings.senderAddress,
        senderPhone: settings.senderPhone,
        customerName: "Tanvir Ahmed",
        customerPhone: "+880 1711-223344",
        shippingAddress: "House 14, Road 7, Sector 3, Uttara, Dhaka-1230",
        items: [
          { name: "Premium Casual Cotton Shirt", quantity: 2 },
          { name: "Fast Charge USB-C Cable", quantity: 1 },
        ],
        totalAmount: 3850,
        paymentMethod: "Cash on Delivery",
        paymentStatus: "unpaid",
      }

  return <ShippingLabelView labelData={labelData} settings={settings} />
}
