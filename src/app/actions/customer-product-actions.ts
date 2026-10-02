"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { updateCustomerProductStatus, deleteClassifiedProduct } from "@/services/customer-product-service"

export async function toggleCustomerProductStatusAction(
  productId: number,
  newStatus: boolean
): Promise<{ success: boolean; message?: string }> {
  try {
    const statusVal = newStatus ? "1" : "0"
    const res = await updateCustomerProductStatus(productId, statusVal)
    revalidatePath("/dashboard/customer-products")
    return { success: res.success }
  } catch (err) {
    console.error("toggleCustomerProductStatusAction error:", err)
    return { success: false, message: "Failed to update product status" }
  }
}

export async function updateClassifiedPublishedAction(
  id: number,
  published: boolean
): Promise<{ success: boolean; message?: string }> {
  try {
    const { updateClassifiedPublished } = await import("@/services/customer-product-service")
    const res = await updateClassifiedPublished(id, published)
    revalidatePath("/admin/customer-products")
    revalidatePath("/dashboard/customer-products")
    return res
  } catch (err) {
    console.error("updateClassifiedPublishedAction error:", err)
    return { success: false, message: "Failed to update publish status" }
  }
}

export async function deleteCustomerProductAction(
  productId: number
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await deleteClassifiedProduct(productId)
    revalidatePath("/dashboard/customer-products")
    revalidatePath("/admin/customer-products")
    return { success: res.success }
  } catch (err) {
    console.error("deleteCustomerProductAction error:", err)
    return { success: false, message: "Failed to delete product" }
  }
}

export const deleteClassifiedProductAction = deleteCustomerProductAction

