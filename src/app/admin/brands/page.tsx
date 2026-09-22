import React from "react"
import { Metadata } from "next"
import { getBrands } from "@/services/brand-service"
import { AdminBrandsView, AdminBrandItem } from "./_components/admin-brands-view"

export const metadata: Metadata = {
  title: "Brands Manager | Admin Control Panel",
  description: "View and manage store brand affiliations",
}

export default async function AdminBrandsPage() {
  const brands = await getBrands()

  const initialBrands: AdminBrandItem[] = brands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: b.logo,
    top: b.top,
    productCount: b.productCount,
  }))

  return <AdminBrandsView initialBrands={initialBrands} />
}
