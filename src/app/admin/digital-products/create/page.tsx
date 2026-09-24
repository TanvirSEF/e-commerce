import React from "react"
import { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { CreateDigitalProductView } from "./_components/create-digital-product-view"

export const metadata: Metadata = {
  title: "Add New Digital Product | Active eCommerce Admin",
}

export default async function AdminCreateDigitalProductPage() {
  const categories = await getCategories()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <CreateDigitalProductView categories={categories} />
    </div>
  )
}
