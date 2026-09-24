import React from "react"
import type { Metadata } from "next"
import { getProducts } from "@/services/product-service"
import { CustomLabelCreateView } from "./_components/custom-label-create-view"

export const metadata: Metadata = {
  title: "Create Custom Label | Admin | Active eCommerce",
  description: "Create new product promotional custom label badge in Active eCommerce CMS",
}

export default async function CustomLabelCreatePage() {
  const { data: products } = await getProducts({ limit: 100 })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <CustomLabelCreateView
        products={products.map((p) => ({
          id: Number(p.id),
          name: p.name,
          thumbnailImg: p.thumbnail,
        }))}
      />
    </div>
  )
}
