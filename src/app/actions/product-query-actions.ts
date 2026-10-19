"use server"

import { revalidatePath } from "next/cache"
import {
  replyProductQuery,
  deleteProductQuery,
} from "@/services/product-query-service"

export async function replyProductQueryAction(data: {
  id: number
  reply: string
  repliedBy?: string
}): Promise<boolean> {
  const res = await replyProductQuery(data)
  if (res.success) {
    try {
      revalidatePath("/admin/product-queries")
      revalidatePath(`/admin/product-queries/${data.id}`)
      revalidatePath("/seller/product-queries")
      if (res.item?.productSlug) {
        revalidatePath(`/product/${res.item.productSlug}`)
      }
      revalidatePath("/products")
    } catch {}
  }
  return res.success
}

export async function deleteProductQueryAction(id: number): Promise<boolean> {
  const success = await deleteProductQuery(id)
  if (success) {
    revalidatePath("/admin/product-queries")
  }
  return success
}
