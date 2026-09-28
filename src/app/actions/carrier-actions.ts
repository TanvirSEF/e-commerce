"use server"

import { revalidatePath } from "next/cache"
import {
  createCarrier,
  updateCarrier,
  toggleCarrierStatus,
  deleteCarrier,
} from "@/services/shipping-location-service"

export async function createCarrierAction(data: {
  name: string
  transitTime: string
  logo?: string
  freeShipping?: boolean
  status?: boolean
}) {
  try {
    const res = await createCarrier(data)
    revalidatePath("/admin/carriers")
    return { success: !!res, data: res }
  } catch (error) {
    console.error("createCarrierAction error:", error)
    return { success: false, error: "Failed to create carrier" }
  }
}

export async function updateCarrierAction(
  id: number,
  data: {
    name?: string
    transitTime?: string
    logo?: string
    freeShipping?: boolean
    status?: boolean
  }
) {
  try {
    const ok = await updateCarrier(id, data)
    revalidatePath("/admin/carriers")
    return { success: ok }
  } catch (error) {
    console.error("updateCarrierAction error:", error)
    return { success: false, error: "Failed to update carrier" }
  }
}

export async function toggleCarrierStatusAction(id: number, status: boolean) {
  try {
    const ok = await toggleCarrierStatus(id, status)
    revalidatePath("/admin/carriers")
    return { success: ok }
  } catch (error) {
    console.error("toggleCarrierStatusAction error:", error)
    return { success: false }
  }
}

export async function deleteCarrierAction(id: number) {
  try {
    const ok = await deleteCarrier(id)
    revalidatePath("/admin/carriers")
    return { success: ok }
  } catch (error) {
    console.error("deleteCarrierAction error:", error)
    return { success: false }
  }
}
