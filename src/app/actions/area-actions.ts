"use server"

import { revalidatePath } from "next/cache"
import {
  createArea,
  updateArea,
  toggleAreaStatus,
  deleteArea,
} from "@/services/shipping-location-service"

export async function createAreaAction(data: {
  name: string
  city: string
  state?: string
  country?: string
  status?: boolean
}) {
  const result = await createArea(data)
  revalidatePath("/admin/areas")
  return { success: !!result, area: result }
}

export async function updateAreaAction(
  id: number,
  data: {
    name?: string
    city?: string
    state?: string
    country?: string
    status?: boolean
  }
) {
  const success = await updateArea(id, data)
  revalidatePath("/admin/areas")
  return { success }
}

export async function toggleAreaStatusAction(id: number, status: boolean) {
  const success = await toggleAreaStatus(id, status)
  revalidatePath("/admin/areas")
  return { success }
}

export async function deleteAreaAction(id: number) {
  const success = await deleteArea(id)
  revalidatePath("/admin/areas")
  return { success }
}
