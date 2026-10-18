"use server"

import { revalidatePath } from "next/cache"
import {
  updateGeneralSettings,
  updateThermalPrinterSettings,
  updateFileSystemSettings,
  updateThirdPartySettings,
  updateSitemapTimestamp,
  type GeneralSettings,
  type ThermalPrinterSettings,
  type FileSystemSettings,
  type ThirdPartySettings,
} from "@/services/settings-service"

function safeRevalidate(path: string, type?: "page" | "layout") {
  try {
    if (type) {
      revalidatePath(path, type)
    } else {
      revalidatePath(path)
    }
  } catch {
    // Graceful fallback outside Next.js request lifecycle
  }
}

// ---------------------------------------------------------------------------
// General Settings
// ---------------------------------------------------------------------------
export async function updateGeneralSettingsAction(data: Partial<GeneralSettings>) {
  const result = await updateGeneralSettings(data)
  safeRevalidate("/admin/settings")
  safeRevalidate("/", "layout")
  return result
}

// ---------------------------------------------------------------------------
// Thermal Printer Settings
// ---------------------------------------------------------------------------
export async function updateThermalPrinterAction(data: Partial<ThermalPrinterSettings>) {
  const result = await updateThermalPrinterSettings(data)
  revalidatePath("/admin/settings/thermal-printer")
  return result
}

// ---------------------------------------------------------------------------
// File System / Storage Settings
// ---------------------------------------------------------------------------
export async function updateFileSystemAction(data: Partial<FileSystemSettings>) {
  const result = await updateFileSystemSettings(data)
  revalidatePath("/admin/settings/file-system")
  return result
}

export async function testCloudinaryConnectionAction(credentials?: {
  cloudName?: string
  apiKey?: string
  apiSecret?: string
}) {
  const { testCloudinaryConnection } = await import("@/lib/cloudinary")
  return await testCloudinaryConnection(credentials)
}

// ---------------------------------------------------------------------------
// Third-Party & Analytics Settings
// ---------------------------------------------------------------------------
export async function updateThirdPartyAction(data: Partial<ThirdPartySettings>) {
  const result = await updateThirdPartySettings(data)
  revalidatePath("/admin/settings/third-party")
  return result
}

// ---------------------------------------------------------------------------
// Sitemap Timestamp
// ---------------------------------------------------------------------------
export async function generateSitemapAction() {
  try {
    await updateSitemapTimestamp()
    revalidatePath("/admin/system/sitemap")
    return { success: true, generatedAt: new Date().toISOString() }
  } catch (err) {
    console.error("generateSitemapAction error:", err)
    return { success: false, error: "Failed to update sitemap timestamp" }
  }
}
