import React from "react"
import { Metadata } from "next"
import { getBrands } from "@/services/brand-service"
import { BrandsView } from "./_components/brands-view"

export const metadata: Metadata = {
  title: "All Brands | Active eCommerce",
  description: "Browse all top brands and verified manufacturers in Active eCommerce CMS",
}

export default async function BrandsPage() {
  const brands = await getBrands()
  return <BrandsView brands={brands} />
}
