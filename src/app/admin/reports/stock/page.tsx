import React from "react"
import { getProducts } from "@/services/product-service"
import { StockReportView } from "./_components/stock-report-view"

export const metadata = {
  title: "Stock Alert Report | Active eCommerce Admin",
}

export default async function AdminStockReportPage() {
  const { data: products } = await getProducts({ limit: 100 })
  const lowStockProducts = products.filter((p) => p.stock <= 5)

  return <StockReportView lowStockProducts={lowStockProducts} allProducts={products} />
}
