"use server"

import { revalidatePath } from "next/cache"
import {
  togglePreorderPublished,
  togglePreorderFeatured,
  deletePreorderProduct,
  bulkDeletePreorderProducts,
  createPreorderProduct,
  deletePreorderOrder,
  bulkDeletePreorderOrders,
  updatePreorderOrderStatus,
  updatePreorderBusinessSetting,
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

export async function deletePreorderOrderAction(id: number) {
  const result = await deletePreorderOrder(id)
  revalidatePath("/admin/preorder/orders")
  return result
}

export async function bulkDeletePreorderOrdersAction(ids: number[]) {
  const result = await bulkDeletePreorderOrders(ids)
  revalidatePath("/admin/preorder/orders")
  return result
}

export async function updatePreorderOrderStatusAction(id: number, status: string) {
  const result = await updatePreorderOrderStatus(id, status)
  revalidatePath("/admin/preorder/orders")
  return result
}

export async function updatePreorderBusinessSettingAction(type: string, value: string) {
  const result = await updatePreorderBusinessSetting(type, value)
  revalidatePath("/admin/preorder/settings")
  return result
}

export async function updatePreorderBusinessSettingsBatchAction(entries: { type: string; value: string }[]) {
  for (const entry of entries) {
    await updatePreorderBusinessSetting(entry.type, entry.value)
  }
  revalidatePath("/admin/preorder/settings")
  return { success: true }
}

