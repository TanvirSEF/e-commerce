"use server"

import { revalidatePath } from "next/cache"
import {
  createCustomerPackage,
  updateCustomerPackage,
  deleteCustomerPackage,
} from "@/services/customer-package-service"
import type { CustomerPackageInputData } from "@/types/customer-package"

export async function createCustomerPackageAction(data: CustomerPackageInputData) {
  const result = await createCustomerPackage(data)
  revalidatePath("/admin/customer-packages")
  return result
}

export async function updateCustomerPackageAction(id: number, data: CustomerPackageInputData) {
  await updateCustomerPackage(id, data)
  revalidatePath("/admin/customer-packages")
  return { success: true }
}

export async function deleteCustomerPackageAction(id: number) {
  await deleteCustomerPackage(id)
  revalidatePath("/admin/customer-packages")
  return { success: true }
}
