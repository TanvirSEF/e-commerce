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
    const mainPurchaseCode = (formData.get("domain_purchase_code") as string)?.trim() || ""
    const purchaseCode = (formData.get("purchase_code") as string)?.trim() || ""
    const zipFile = formData.get("addon_zip") as File | null

    if (!purchaseCode) {
      return { success: false, error: "Addon purchase code is required." }
    }

    let addonName = "Custom Uploaded Addon"
    let uniqueIdentifier = "custom_addon_" + Math.random().toString(36).substring(2, 8)

    if (zipFile && zipFile.name) {
      const baseName = zipFile.name.replace(/\.zip$/i, "").replace(/[-_]+/g, " ")
      addonName = baseName
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
      uniqueIdentifier = zipFile.name.replace(/\.zip$/i, "").toLowerCase().replace(/[^a-z0-9]+/g, "_")
    }

    const item = await installAddon({
      name: addonName,
      uniqueIdentifier,
      purchaseCode,
      mainPurchaseCode,
      version: "1.0",
      description: "CodeCanyon addon extension package installed via admin panel",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80",
    })

    revalidatePath("/admin/addons")
    return { success: true, addon: item }
  } catch (error) {
    console.error("Failed to install addon:", error)
    return { success: false, error: "Failed to install addon to database" }
  }
}
