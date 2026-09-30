"use server"

import { revalidatePath } from "next/cache"
import {
  getPromotionalProducts,
  searchProductsForPromotional,
  updatePromotionalProducts,
  removePromotionalProducts,
  togglePromotionalProductTodaysDeal,
  type GetPromotionalProductsParams,
  type PromotionalProductsResponse,
  type SearchProductForPromotionalItem,
} from "@/services/promotional-product-service"

export async function fetchPromotionalProductsAction(
  params: GetPromotionalProductsParams
): Promise<PromotionalProductsResponse> {
  return await getPromotionalProducts(params)
}

export async function searchProductsForPromotionalAction(params: {
  searchKey?: string
  categoryId?: number
}): Promise<SearchProductForPromotionalItem[]> {
  return await searchProductsForPromotional(params)
}

export async function updatePromotionalProductsAction(
  allIds: number[],
  checkedIds: number[]
): Promise<boolean> {
  const success = await updatePromotionalProducts(allIds, checkedIds)
  if (success) {
    revalidatePath("/admin/promotional-products-index")
    revalidatePath("/admin/products/all")
    revalidatePath("/(shop)")
  }
  return success
}

export async function removePromotionalProductsAction(productIds: number[]): Promise<boolean> {
  const success = await removePromotionalProducts(productIds)
  if (success) {
    revalidatePath("/admin/promotional-products-index")
    revalidatePath("/admin/products/all")
    revalidatePath("/(shop)")
  }
  return success
}

export async function togglePromotionalProductTodaysDealAction(
  productId: number,
  status: boolean
): Promise<boolean> {
  const success = await togglePromotionalProductTodaysDeal(productId, status)
  if (success) {
    revalidatePath("/admin/promotional-products-index")
    revalidatePath("/(shop)")
  }
  return success
}
