"use server"

import { revalidatePath } from "next/cache"
import { updateClassifiedPublished, deleteClassifiedProduct } from "@/services/customer-product-service"

export async function updateClassifiedPublishedAction(id: number, published: boolean) {
  const result = await updateClassifiedPublished(id, published)
  revalidatePath("/admin/customer-products")
  return result
}

export async function deleteClassifiedProductAction(id: number) {
  const result = await deleteClassifiedProduct(id)
  revalidatePath("/admin/customer-products")
  return result
}
