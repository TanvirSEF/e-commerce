import React from "react"
import { Metadata } from "next"
import { getAllPreorderProducts } from "@/services/preorder-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { PreorderShowcaseView } from "./_components/preorder-showcase-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Pre-Order Launches | Active eCommerce",
  description: "Reserve upcoming flagship products with advance deposit booking",
}

export default async function PreorderShowcasePage() {
  await ensureAddonActivated("preorder_system")
  const products = await getAllPreorderProducts()

  return <PreorderShowcaseView products={products.filter((p) => p.status)} />
}
