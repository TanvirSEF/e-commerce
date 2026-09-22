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
