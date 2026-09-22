import React from "react"
import { getProducts } from "@/services/product-service"
import { SellerProductsView } from "./_components/seller-products-view"

export const metadata = {
  title: "My Products | Seller Dashboard",
}

export default async function SellerProductsPage() {
  const { data: products, total } = await getProducts({ limit: 50 })

  return <SellerProductsView initialProducts={products} total={total} />
}
