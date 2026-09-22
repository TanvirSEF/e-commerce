import React from "react"
import { getOrdersAdmin } from "@/services/order-service"
import { getCategories } from "@/services/category-service"
import { SalesReportView } from "./_components/sales-report-view"

export const metadata = {
  title: "Sales Report | Active eCommerce Admin",
}

export default async function AdminSalesReportPage() {
  const [ordersData, categories] = await Promise.all([
    getOrdersAdmin({ limit: 50 }),
    getCategories(),
  ])

  return <SalesReportView orders={ordersData.orders} categories={categories} />
}
