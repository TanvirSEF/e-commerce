import React from "react"
import { Metadata } from "next"
import { getOrdersAdmin, getOrderByCode } from "@/services/order-service"
import { type InvoiceData } from "@/app/invoice/[code]/_components/invoice-view"
import { BulkInvoicePrintClient } from "./_components/bulk-invoice-print-client"

export const metadata: Metadata = {
  title: "Bulk Invoice Print | Admin Orders | Active eCommerce",
  description: "Print multiple invoices simultaneously in standard A4 format",
}

export const dynamic = "force-dynamic"

interface BulkInvoicePrintPageProps {
  searchParams: Promise<{ ids?: string; print?: string }>
}

export default async function BulkInvoicePrintPage({ searchParams }: BulkInvoicePrintPageProps) {
  const { ids, print } = await searchParams
  const rawIds = ids ? ids.split(",").map((s) => s.trim()).filter(Boolean) : []

  let invoices: InvoiceData[] = []

  if (rawIds.length > 0) {
    const fetched = await Promise.all(rawIds.map((code) => getOrderByCode(code)))
    invoices = fetched.filter(Boolean).map((order) => ({
      code: order!.code,
      trackingCode: order!.trackingCode,
      date: order!.date,
      customerName: order!.customerName,
      customerPhone: order!.customerPhone,
      shippingAddress: order!.shippingAddress,
      paymentMethod: order!.paymentMethod,
      paymentStatus: order!.paymentStatus,
      deliveryStatus: order!.status,
      items: order!.items.map((it) => ({
        id: it.id,
        name: it.name,
        quantity: it.quantity,
        price: it.price,
      })),
      subtotal: Math.max(0, order!.total - 100),
      shippingCost: 100,
      couponDiscount: 0,
      grandTotal: order!.total,
    }))
  }

  if (invoices.length === 0) {
    const { orders: all } = await getOrdersAdmin({ limit: 5 })
    invoices = all.map((order) => ({
      code: order.code,
      trackingCode: `TRK-${order.code}`,
      date: order.date,
      customerName: order.customerName,
      customerPhone: "+880 1700 000000",
      shippingAddress: "Dhaka, Bangladesh",
      paymentMethod: (order as any).paymentMethod || "Cash on Delivery",
      paymentStatus: order.paymentStatus,
      deliveryStatus: order.deliveryStatus,
      items: [
        {
          id: "it-1",
          name: "Standard Catalog Product Item",
          quantity: order.itemCount,
          price: order.total,
        },
      ],
      subtotal: Math.max(0, order.total - 100),
      shippingCost: 100,
      couponDiscount: 0,
      grandTotal: order.total,
    }))
  }

  return <BulkInvoicePrintClient invoices={invoices} autoPrint={print === "1"} />
}
