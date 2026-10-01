"use server"

import { revalidatePath } from "next/cache"
import {
  createStaff,
  updateStaff,
  deleteStaff,
  updateStaffStatus,
} from "@/services/staff-service"
import type { StaffInputData } from "@/types/staff"

export async function createStaffAction(data: StaffInputData) {
  const result = await createStaff(data)
  revalidatePath("/admin/staffs")
  return result
}

export async function updateStaffAction(id: number, data: StaffInputData) {
  await updateStaff(id, data)
  revalidatePath("/admin/staffs")
  return { success: true }
}

export async function deleteStaffAction(id: number) {
  await deleteStaff(id)
  revalidatePath("/admin/staffs")
  return { success: true }
}

export async function updateStaffStatusAction(id: number, isActive: boolean) {
  await updateStaffStatus(id, isActive)
  revalidatePath("/admin/staffs")
  return { success: true }
}
