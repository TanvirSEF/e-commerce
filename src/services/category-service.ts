import { db } from "../db"
import { categories } from "../db/schema"
import { desc } from "drizzle-orm"
import { SEED_CATEGORIES, SeedCategory } from "../db/seed/data"

export async function getCategories(): Promise<SeedCategory[]> {
  try {
    const rows = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.featured), categories.orderLevel)

    if (rows.length > 0) {
      return rows.map((c) => ({
        id: String(c.id),
        name: c.name,
        slug: c.slug,
        icon: c.icon || "/assets/img/placeholder.jpg",
        banner: c.banner || "/assets/img/placeholder-rect.jpg",
        featured: c.featured,
        orderLevel: c.orderLevel,
        itemCount: 50,
      }))
    }
  } catch (err) {
    console.warn("DB getCategories fallback to SEED_CATEGORIES:", (err as Error).message)
  }
  return SEED_CATEGORIES
}

export async function getCategoryBySlug(slug: string): Promise<SeedCategory | null> {
  const all = await getCategories()
  return all.find((c) => c.slug === slug) || null
}
