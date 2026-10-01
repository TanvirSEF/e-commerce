import React from "react"
import { Metadata } from "next"
import { getProducts } from "@/services/product-service"
import { getCategories } from "@/services/category-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { AdminPosView } from "./_components/admin-pos-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "POS Terminal (Point of Sale) | Admin Dashboard",
  description: "Point of Sale cash register terminal for in-store walk-in buyers",
}

export default async function AdminPosPage() {
  await ensureAddonActivated("pos_system")
  const [{ data: products }, categories] = await Promise.all([
    getProducts({ limit: 100 }),
    getCategories(),
  ])

  return (
    <div className="p-4 md:p-6">
      <AdminPosView products={products} categories={categories} />
    </div>
  )
}
