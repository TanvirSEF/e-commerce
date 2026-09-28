"use server"

import { revalidatePath } from "next/cache"
import { toggleAddonActivation, installAddon } from "@/services/addon-service"

export async function toggleAddonAction(id: number, activated: boolean) {
  try {
    const success = await toggleAddonActivation(id, activated)
    revalidatePath("/admin/addons")
    revalidatePath("/admin")
    return { success, activated }
  } catch (error) {
    console.error("Failed to toggle addon:", error)
    return { success: false, error: "Database update failed" }
  }
}

export async function installAddonAction(formData: FormData) {
  try {
    const purchaseCode = (formData.get("purchaseCode") as string)?.trim()
    const name = (formData.get("name") as string)?.trim() || "Custom Addon Extension"
    const uniqueIdentifier =
      (formData.get("uniqueIdentifier") as string)?.trim() ||
      name.toLowerCase().replace(/[^a-z0-9]+/g, "_")

    if (!purchaseCode) {
      return { success: false, error: "A valid CodeCanyon purchase code is required." }
    }

    const item = await installAddon({
      name,
      uniqueIdentifier,
      purchaseCode,
      version: "1.0",
      description: "Custom uploaded extension package for Active eCommerce CMS",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80",
    })

    revalidatePath("/admin/addons")
    return { success: true, addon: item }
  } catch (error) {
    console.error("Failed to install addon:", error)
    return { success: false, error: "Failed to install addon to database" }
  }
}
