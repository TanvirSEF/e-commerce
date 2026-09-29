import { db } from "../db"
import { categories } from "../db/schema"
import { desc, eq } from "drizzle-orm"
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
        parentId: c.parentId || null,
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

export async function createCategory(data: {
  name: string
  slug?: string
  icon?: string
  banner?: string
  parentId?: number
  featured?: boolean
  orderLevel?: number
}): Promise<SeedCategory | null> {
  const slug =
    data.slug ||
    data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString().slice(-4)
  try {
    const [inserted] = await db
      .insert(categories)
      .values({
        name: data.name,
        slug,
        icon: data.icon || "/assets/img/placeholder.jpg",
        banner: data.banner || "/assets/img/placeholder-rect.jpg",
        featured: data.featured || false,
        orderLevel: data.orderLevel || 0,
        parentId: data.parentId || null,
      })
      .returning()
    if (inserted) {
      return {
        id: String(inserted.id),
        name: inserted.name,
        slug: inserted.slug,
        icon: inserted.icon || "/assets/img/placeholder.jpg",
        banner: inserted.banner || "/assets/img/placeholder-rect.jpg",
        featured: inserted.featured,
        orderLevel: inserted.orderLevel,
        itemCount: 0,
      }
    }
  } catch (err) {
    console.error("Error creating category:", err)
  }
  return null
}

export async function deleteCategory(id: number | string): Promise<boolean> {
  const numericId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10)
  if (!numericId || isNaN(numericId)) return false
  try {
    await db.delete(categories).where(eq(categories.id, numericId))
    return true
  } catch (err) {
    console.error("Error deleting category:", err)
    return false
  }
}

export async function toggleCategoryFeatured(id: number | string, featured: boolean): Promise<boolean> {
  const numericId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10)
  if (!numericId || isNaN(numericId)) return false
  try {
    await db.update(categories).set({ featured, updatedAt: new Date() }).where(eq(categories.id, numericId))
    return true
  } catch (err) {
    console.error("Error updating category featured:", err)
    return false
  }
}

export async function updateCategory(
  id: number | string,
  data: {
    name?: string
    icon?: string
    banner?: string
    parentId?: number | null
    featured?: boolean
    orderLevel?: number
  }
): Promise<SeedCategory | null> {
  const numericId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10)
  if (!numericId || isNaN(numericId)) return null
  try {
    const updateData: Record<string, any> = { updatedAt: new Date() }
    if (data.name !== undefined) updateData.name = data.name
    if (data.icon !== undefined) updateData.icon = data.icon
    if (data.banner !== undefined) updateData.banner = data.banner
    if (data.parentId !== undefined) updateData.parentId = data.parentId
    if (data.featured !== undefined) updateData.featured = data.featured
    if (data.orderLevel !== undefined) updateData.orderLevel = data.orderLevel

    const [updated] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, numericId))
      .returning()

    if (updated) {
      return {
        id: String(updated.id),
        name: updated.name,
        slug: updated.slug,
        icon: updated.icon || "/assets/img/placeholder.jpg",
        banner: updated.banner || "/assets/img/placeholder-rect.jpg",
        featured: updated.featured,
        orderLevel: updated.orderLevel,
        parentId: updated.parentId || null,
        itemCount: 0,
      }
    }
  } catch (err) {
    console.error("Error updating category:", err)
  }
  return null
}
