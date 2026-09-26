import React from "react"
import { Metadata } from "next"
import { getAllPreorderProducts } from "@/services/preorder-service"
import { PreorderShowcaseView } from "./_components/preorder-showcase-view"

export const metadata: Metadata = {
  title: "Pre-Order Launches | Active eCommerce",
  description: "Reserve upcoming flagship products with advance deposit booking",
}

export default async function PreorderShowcasePage() {
  const products = await getAllPreorderProducts()

  return <PreorderShowcaseView products={products.filter((p) => p.status)} />
}
