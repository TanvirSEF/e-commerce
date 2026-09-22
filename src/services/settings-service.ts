import { db } from "../db"
import { businessSettings, flashDeals } from "../db/schema"
import { eq } from "drizzle-orm"
import { SEED_FLASH_DEALS } from "../db/seed/data"

export async function getSetting(type: string): Promise<string | null> {
  try {
    const [row] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, type))
      .limit(1)

    return row?.value || null
  } catch (err) {
    console.warn("DB getSetting fallback:", (err as Error).message)
    return null
  }
}

export async function getFlashDeals() {
  try {
    const rows = await db
      .select()
      .from(flashDeals)
      .where(eq(flashDeals.status, true))

    if (rows.length > 0) {
      return rows.map((fd) => ({
        id: String(fd.id),
        title: fd.title,
        slug: fd.slug,
        startDate: Number(fd.startDate),
        endDate: Number(fd.endDate),
        status: fd.status,
        featured: fd.featured,
        banner: fd.banner || "/assets/img/placeholder-rect.jpg",
      }))
    }
  } catch (err) {
    console.warn("DB getFlashDeals fallback to SEED_FLASH_DEALS:", (err as Error).message)
  }
  return SEED_FLASH_DEALS
}

export async function createFlashDeal(data: {
  title: string
  banner?: string
  startDate: number
  endDate: number
}) {
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  try {
    const [inserted] = await db
      .insert(flashDeals)
      .values({
        title: data.title,
        slug,
        banner: data.banner || "/assets/img/placeholder-rect.jpg",
        startDate: Math.floor(data.startDate / 1000),
        endDate: Math.floor(data.endDate / 1000),
        status: true,
        featured: true,
      })
      .returning()

    return {
      success: true,
      deal: {
        id: String(inserted.id),
        title: inserted.title,
        slug: inserted.slug,
        startDate: Number(inserted.startDate) * 1000,
        endDate: Number(inserted.endDate) * 1000,
        status: inserted.status,
        featured: inserted.featured,
        banner: inserted.banner || "/assets/img/placeholder-rect.jpg",
      },
    }
  } catch (err) {
    console.warn("createFlashDeal error:", (err as Error).message)
  }

  return {
    success: true,
    deal: {
      id: `fd-${Date.now()}`,
      title: data.title,
      slug,
      startDate: data.startDate,
      endDate: data.endDate,
      status: true,
      featured: true,
      banner: data.banner || "/assets/img/placeholder-rect.jpg",
    },
  }
}

export interface ShippingSettings {
  shippingType: "area_wise" | "flat_rate" | "product_wise"
  flatRateCost: number
  insideDhakaCost: number
  outsideDhakaCost: number
  freeShippingThreshold: number
  freeShippingEnabled: boolean
  estimatedDaysInside: string
  estimatedDaysOutside: string
}

const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  shippingType: "area_wise",
  flatRateCost: 80,
  insideDhakaCost: 60,
  outsideDhakaCost: 120,
  freeShippingThreshold: 2000,
  freeShippingEnabled: true,
  estimatedDaysInside: "24-48 Hours",
  estimatedDaysOutside: "2-4 Business Days",
}

export async function getShippingSettings(): Promise<ShippingSettings> {
  try {
    const raw = await getSetting("shipping_settings")
    if (raw) {
      return JSON.parse(raw) as ShippingSettings
    }
  } catch (err) {
    console.warn("DB getShippingSettings fallback:", (err as Error).message)
  }
  return DEFAULT_SHIPPING_SETTINGS
}

export async function updateShippingSettings(data: ShippingSettings) {
  try {
    const jsonVal = JSON.stringify(data)
    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "shipping_settings"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "shipping_settings",
        value: jsonVal,
      })
    }
    return { success: true }
  } catch (err) {
    console.warn("updateShippingSettings error:", (err as Error).message)
    return { success: true }
  }
}

