import React from "react"
import { Metadata } from "next"
import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getProductsForReviewSelect } from "@/services/review-service"
import { CreateCustomReviewView } from "./_components/create-custom-review-view"

export const metadata: Metadata = {
  title: "Add Custom Review | Active eCommerce Admin",
  description: "Create and attach custom ratings and reviews to products",
}

export const dynamic = "force-dynamic"

interface CreateCustomReviewPageProps {
  searchParams: Promise<{ product_id?: string }>
}

export default async function CreateCustomReviewPage({
  searchParams,
}: CreateCustomReviewPageProps) {
  const { product_id } = await searchParams

  let preselectedProduct: { id: number; name: string; thumbnailImg: string } | null = null

  if (product_id) {
    const numericId = parseInt(product_id, 10)
    if (numericId && !isNaN(numericId)) {
      const [prod] = await db
        .select({
          id: products.id,
          name: products.name,
          thumbnailImg: products.thumbnailImg,
        })
        .from(products)
        .where(eq(products.id, numericId))
        .limit(1)

      if (prod) {
        preselectedProduct = {
          id: prod.id,
          name: prod.name,
          thumbnailImg: prod.thumbnailImg || "/assets/img/placeholder.jpg",
        }
      }
    }
  }

  const allProducts = await getProductsForReviewSelect()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CreateCustomReviewView
        products={allProducts}
        preselectedProduct={preselectedProduct}
      />
    </div>
  )
}
