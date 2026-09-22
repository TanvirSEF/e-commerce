import { db } from "../db"
import { brands } from "../db/schema"
import { desc } from "drizzle-orm"
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
