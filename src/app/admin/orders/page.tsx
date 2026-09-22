import React from "react"
import { Metadata } from "next"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { desc } from "drizzle-orm"
import { AdminOrdersView, AdminOrderItem } from "./_components/admin-orders-view"

export const metadata: Metadata = {
  title: "All Orders | Admin Control Panel",
  description: "Track and update customer orders and shipment statuses",
}

export default async function AdminOrdersPage() {
  let initialOrders: AdminOrderItem[] = []

  try {
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(50)

    if (rows.length > 0) {
      initialOrders = rows.map((o) => ({
        id: String(o.id),
        code: o.code,
        trackingCode: o.trackingCode,
        customerName: o.shippingAddress?.name || "Customer",
        customerPhone: o.shippingAddress?.phone || "+880 1700 000000",
        amount: Number(o.grandTotal),
        deliveryStatus: o.deliveryStatus,
        paymentStatus: o.paymentStatus,
        paymentType: o.paymentType,
        date: o.createdAt.toISOString().split("T")[0],
        shippingAddress: o.shippingAddress?.address || "Dhaka, Bangladesh",
      }))
    }
  } catch (err) {
    console.warn("DB admin orders query fallback:", (err as Error).message)
  }

  // Fallback demo orders if database orders are empty
  if (initialOrders.length === 0) {
    initialOrders = [
      {
        id: "1",
        code: "ORD-942851",
        trackingCode: "TRK-942851",
        customerName: "Tanvir Ahmed",
        customerPhone: "+880 1712 345678",
        amount: 2200,
        deliveryStatus: "pending",
        paymentStatus: "paid",
        paymentType: "sslcommerz",
        date: "2026-09-22",
        shippingAddress: "House 12, Road 4, Sector 7, Uttara, Dhaka",
      },
      {
        id: "2",
        code: "ORD-938210",
        trackingCode: "TRK-938210",
        customerName: "Rashidul Islam",
        customerPhone: "+880 1711 223344",
        amount: 3450,
        deliveryStatus: "delivered",
        paymentStatus: "paid",
        paymentType: "cash_on_delivery",
        date: "2026-09-21",
        shippingAddress: "Block C, Bashundhara R/A, Dhaka",
      },
      {
        id: "3",
        code: "ORD-921473",
        trackingCode: "TRK-921473",
        customerName: "Mohammad Ali",
        customerPhone: "+880 1819 556677",
        amount: 999,
        deliveryStatus: "on_the_way",
        paymentStatus: "unpaid",
        paymentType: "cash_on_delivery",
        date: "2026-09-20",
        shippingAddress: "Gulshan 1, Dhaka",
      },
    ]
  }

  return <AdminOrdersView initialOrders={initialOrders} />
}
