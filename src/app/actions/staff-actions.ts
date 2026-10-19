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
  try {
    revalidatePath("/admin/staffs")
  } catch {}
  return result
}

export async function updateStaffAction(id: number, data: StaffInputData) {
  await updateStaff(id, data)
  try {
    revalidatePath("/admin/staffs")
  } catch {}
  return { success: true }
}

export async function deleteStaffAction(id: number) {
  await deleteStaff(id)
  try {
    revalidatePath("/admin/staffs")
  } catch {}
  return { success: true }
}

export async function updateStaffStatusAction(id: number, isActive: boolean) {
  await updateStaffStatus(id, isActive)
  try {
    revalidatePath("/admin/staffs")
  } catch {}
  return { success: true }
}

export async function createRoleAction(data: { name: string; permissions: string[] }) {
  const { createRoleAdmin } = await import("@/services/staff-service")
  const result = await createRoleAdmin(data)
  try {
    revalidatePath("/admin/roles")
    revalidatePath("/admin/staffs")
  } catch {}
  return result
}

export async function updateRoleAction(id: number, data: { name: string; permissions: string[] }) {
  const { updateRoleAdmin } = await import("@/services/staff-service")
  await updateRoleAdmin(id, data)
  try {
    revalidatePath("/admin/roles")
    revalidatePath("/admin/staffs")
  } catch {}
  return { success: true }
}

export async function deleteRoleAction(id: number) {
  const { deleteRoleAdmin } = await import("@/services/staff-service")
  await deleteRoleAdmin(id)
  try {
    revalidatePath("/admin/roles")
    revalidatePath("/admin/staffs")
  } catch {}
  return { success: true }
}
