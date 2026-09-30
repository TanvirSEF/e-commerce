"use server"

import { revalidatePath } from "next/cache"
import {
  togglePreorderPublished,
  togglePreorderFeatured,
  deletePreorderProduct,
  bulkDeletePreorderProducts,
  createPreorderProduct,
} from "@/services/preorder-service"

export async function togglePreorderPublishedAction(id: number, status: boolean) {
  const result = await togglePreorderPublished(id, status)
  revalidatePath("/admin/preorder/products")
  return result
}

export async function togglePreorderFeaturedAction(id: number, featured: boolean) {
  const result = await togglePreorderFeatured(id, featured)
  revalidatePath("/admin/preorder/products")
  return result
}

export async function deletePreorderProductAction(id: number) {
  const result = await deletePreorderProduct(id)
  revalidatePath("/admin/preorder/products")
  return result
}

export async function bulkDeletePreorderProductsAction(ids: number[]) {
  const result = await bulkDeletePreorderProducts(ids)
  revalidatePath("/admin/preorder/products")
  return result
}

export async function createPreorderProductAction(data: {
  name: string
  price: string
  prepaymentAmount: string
  releaseDate: Date
  preorderBatchLimit: number
  sku?: string
  sellerSlug?: string
  categoryName?: string
  unit?: string
  minQty?: number
  isRefundable?: boolean
  discount?: string
  discountType?: string
  isAvailable?: boolean
  availableDate?: string
}) {
  const result = await createPreorderProduct(data)
  revalidatePath("/admin/preorder/products")
  return result
}
