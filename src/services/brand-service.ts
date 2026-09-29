import { db } from "../db"
import { brands } from "../db/schema"
import { desc, eq } from "drizzle-orm"
import { SEED_BRANDS, SeedBrand } from "../db/seed/data"

export async function getBrands(): Promise<SeedBrand[]> {
  try {
    const rows = await db.select().from(brands).orderBy(desc(brands.top), brands.name)
    if (rows.length > 0) {
      return rows.map((b) => ({
        id: String(b.id),
        name: b.name,
        slug: b.slug,
        logo: b.logo || "/assets/img/placeholder.jpg",
        top: b.top,
        productCount: 25,
      }))
    }
  } catch (err) {
    console.warn("DB getBrands fallback to SEED_BRANDS:", (err as Error).message)
  }
  return SEED_BRANDS
}

export async function createBrand(data: {
  name: string
  slug?: string
  logo?: string
  top?: boolean
}): Promise<SeedBrand | null> {
  const slug =
    data.slug ||
    data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString().slice(-4)
  try {
    const [inserted] = await db
      .insert(brands)
      .values({
        name: data.name,
        slug,
        logo: data.logo || "/assets/img/placeholder.jpg",
        top: data.top || false,
      })
      .returning()
    if (inserted) {
      return {
        id: String(inserted.id),
        name: inserted.name,
        slug: inserted.slug,
        logo: inserted.logo || "/assets/img/placeholder.jpg",
        top: inserted.top,
        productCount: 0,
      }
    }
  } catch (err) {
    console.error("Error creating brand:", err)
  }
  return null
}

export async function deleteBrand(id: number | string): Promise<boolean> {
  const numericId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10)
  if (!numericId || isNaN(numericId)) return false
  try {
    await db.delete(brands).where(eq(brands.id, numericId))
    return true
  } catch (err) {
    console.error("Error deleting brand:", err)
    return false
  }
}

export async function toggleBrandTop(id: number | string, top: boolean): Promise<boolean> {
  const numericId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10)
  if (!numericId || isNaN(numericId)) return false
  try {
    await db.update(brands).set({ top, updatedAt: new Date() }).where(eq(brands.id, numericId))
    return true
  } catch (err) {
    console.error("Error updating brand top:", err)
    return false
  }
}

export async function updateBrand(
  id: number | string,
  data: {
    name: string
    slug?: string
    logo?: string
    top?: boolean
  }
): Promise<SeedBrand | null> {
  const numericId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10)
  if (!numericId || isNaN(numericId)) return null

  const slug =
    data.slug ||
    data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  try {
    const [updated] = await db
      .update(brands)
      .set({
        name: data.name,
        slug,
        ...(data.logo !== undefined ? { logo: data.logo } : {}),
        ...(typeof data.top === "boolean" ? { top: data.top } : {}),
        updatedAt: new Date(),
      })
      .where(eq(brands.id, numericId))
      .returning()

    if (updated) {
      return {
        id: String(updated.id),
        name: updated.name,
        slug: updated.slug,
        logo: updated.logo || "/assets/img/placeholder.jpg",
        top: updated.top,
        productCount: 0,
      }
    }
  } catch (err) {
    console.error("Error updating brand:", err)
  }
  return null
}

