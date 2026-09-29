import React from "react"
import { Metadata } from "next"
import { getCategories } from "@/services/category-service"
import { getProductForEdit } from "@/services/product-service"
import { CreateDigitalProductView } from "./_components/create-digital-product-view"

export const metadata: Metadata = {
  title: "Digital Product Editor | Active eCommerce Admin",
}

interface PageProps {
  searchParams: Promise<{ edit?: string }>
}

export default async function AdminCreateDigitalProductPage({ searchParams }: PageProps) {
  const { edit } = await searchParams
  const [categories, initialProduct] = await Promise.all([
    getCategories(),
    edit ? getProductForEdit(edit) : Promise.resolve(null),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <CreateDigitalProductView
        categories={categories}
        initialProduct={initialProduct}
      />
    </div>
  )
}
