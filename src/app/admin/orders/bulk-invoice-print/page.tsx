import React from "react"
import { Metadata } from "next"
import { getOrdersAdmin, getOrderByCode } from "@/services/order-service"
import { InvoiceView, type InvoiceData } from "@/app/invoice/[code]/_components/invoice-view"

export const metadata: Metadata = {
  title: "Bulk Invoice Print | Admin Orders | Active eCommerce",
  description: "Print multiple invoices simultaneously",
}

interface BulkInvoicePrintPageProps {
  searchParams: Promise<{ ids?: string }>
}

export default async function BulkInvoicePrintPage({ searchParams }: BulkInvoicePrintPageProps) {
  const { ids } = await searchParams
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

  return (
    <div className="bg-slate-100 min-h-screen py-8 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto space-y-8 print:space-y-0 print:max-w-none">
        {invoices.map((inv) => (
          <div
            key={inv.code}
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none print:break-after-page"
          >
            <InvoiceView invoice={inv} />
          </div>
        ))}
      </div>
    </div>
  )
}
