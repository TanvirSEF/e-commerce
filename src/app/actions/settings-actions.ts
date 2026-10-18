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
  safeRevalidate("/admin/settings/third-party")
  safeRevalidate("/", "layout")
  return result
}

export async function testRecaptchaCredentialsAction(secretKey: string) {
  try {
    if (!secretKey || secretKey.trim() === "") {
      return { success: false, error: "Please enter a reCAPTCHA Secret Key to test." }
    }

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey.trim(),
        response: "dummy_test_token_huipper",
      }),
      cache: "no-store",
    })

    if (!res.ok) {
      return { success: false, error: `Google API responded with HTTP status ${res.status}` }
    }

    const data = await res.json()
    const errorCodes = Array.isArray(data["error-codes"]) ? data["error-codes"] : []

    // If Google rejects secret key specifically:
    if (errorCodes.includes("invalid-input-secret")) {
      return { success: false, error: "Invalid reCAPTCHA Secret Key according to Google." }
    }

    // When secret is valid, Google accepts it and complains about the dummy response token:
    if (errorCodes.includes("invalid-input-response") || errorCodes.includes("timeout-or-duplicate")) {
      return { success: true, message: "Valid Secret Key! Google successfully accepted the credentials." }
    }

    return { success: true, message: "Google accepted your Secret Key." }
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to connect to Google reCAPTCHA servers." }
  }
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
