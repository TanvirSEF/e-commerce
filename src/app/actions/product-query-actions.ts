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
  const success = await replyProductQuery(data)
  if (success) {
    revalidatePath("/admin/product-queries")
    revalidatePath(`/admin/product-queries/${data.id}`)
  }
  return success
}

export async function deleteProductQueryAction(id: number): Promise<boolean> {
  const success = await deleteProductQuery(id)
  if (success) {
    revalidatePath("/admin/product-queries")
  }
  return success
}
