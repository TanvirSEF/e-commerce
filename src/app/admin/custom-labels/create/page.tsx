import React from "react"
import type { Metadata } from "next"
import { getProducts } from "@/services/product-service"
import { getCustomLabelById } from "@/services/custom-label-service"
import { CustomLabelCreateView } from "./_components/custom-label-create-view"

export const metadata: Metadata = {
  title: "Custom Label Editor | Admin Control Panel",
  description: "Create or edit product promotional custom label badge in Active eCommerce CMS",
}

interface CustomLabelCreatePageProps {
  searchParams: Promise<{ edit?: string }>
}

export default async function CustomLabelCreatePage({ searchParams }: CustomLabelCreatePageProps) {
  const { edit } = await searchParams
  const editId = edit ? parseInt(edit, 10) : undefined

  const [{ data: products }, initialLabel] = await Promise.all([
    getProducts({ limit: 100 }),
    editId ? getCustomLabelById(editId) : Promise.resolve(null),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <CustomLabelCreateView
        initialLabel={initialLabel || undefined}
        products={products.map((p) => ({
          id: Number(p.id),
          name: p.name,
          thumbnailImg: p.thumbnail,
        }))}
      />
    </div>
  )
}
