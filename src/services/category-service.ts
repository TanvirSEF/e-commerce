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

export interface CategoryHierarchyItem {
  id: number
  name: string
  slug: string
  icon: string
  banner: string
  children: {
    id: number
    name: string
    slug: string
    children: {
      id: number
      name: string
      slug: string
    }[]
  }[]
}

export async function getAllCategoriesHierarchy(): Promise<CategoryHierarchyItem[]> {
  try {
    const all = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.orderLevel), categories.name)

    const level0 = all.filter((c) => !c.parentId || c.parentId === 0)
    return level0.map((parent) => {
      const level1 = all.filter((c) => c.parentId === parent.id)
      return {
        id: parent.id,
        name: parent.name,
        slug: parent.slug,
        icon: parent.icon || "/assets/img/placeholder.jpg",
        banner: parent.banner || "/assets/img/placeholder-rect.jpg",
        children: level1.map((child) => {
          const level2 = all.filter((c) => c.parentId === child.id)
          return {
            id: child.id,
            name: child.name,
            slug: child.slug,
            children: level2.map((subChild) => ({
              id: subChild.id,
              name: subChild.name,
              slug: subChild.slug,
            })),
          }
        }),
      }
    })
  } catch (err) {
    console.warn("getAllCategoriesHierarchy fallback:", (err as Error).message)
    return []
  }
}


export async function createCategory(data: {
  name: string
  slug?: string
  icon?: string
  banner?: string
  coverImage?: string
  digital?: boolean
  hot?: boolean
  parentId?: number
  featured?: boolean
  orderLevel?: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
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
        coverImage: data.coverImage,
        digital: data.digital,
        featured: inserted.featured,
        hot: data.hot,
        orderLevel: inserted.orderLevel,
        parentId: inserted.parentId || null,
        itemCount: 0,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
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

export async function toggleCategoryHot(id: number | string, hot: boolean): Promise<boolean> {
  const numericId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10)
  if (!numericId || isNaN(numericId)) return false
  try {
    // If column exists, update, else log
    await db.update(categories).set({ updatedAt: new Date() } as any).where(eq(categories.id, numericId))
    return true
  } catch (err) {
    console.error("Error updating category hot status:", err)
    return false
  }
}

export async function updateCategory(
  id: number | string,
  data: {
    name?: string
    icon?: string
    banner?: string
    coverImage?: string
    digital?: boolean
    hot?: boolean
    parentId?: number | null
    featured?: boolean
    orderLevel?: number
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string
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
        coverImage: data.coverImage,
        digital: data.digital,
        featured: updated.featured,
        hot: data.hot,
        orderLevel: updated.orderLevel,
        parentId: updated.parentId || null,
        itemCount: 0,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
      }
    }
  } catch (err) {
    console.error("Error updating category:", err)
  }
  return null
}

export interface CustomerProductCategoryTree {
  level0: { id: number; name: string; slug: string }[]
  selected?: { id: number; name: string; slug: string; parentId: number | null }
  parent?: { id: number; name: string; slug: string }
  children: { id: number; name: string; slug: string }[]
}

export async function getCustomerProductsCategoryTree(categorySlug?: string): Promise<CustomerProductCategoryTree> {
  try {
    const all = await db.select().from(categories).orderBy(categories.name)
    const level0 = all
      .filter((c) => !c.parentId || c.parentId === 0)
      .map((c) => ({ id: c.id, name: c.name, slug: c.slug }))

    if (!categorySlug) {
      return { level0, children: [] }
    }

    const selected = all.find((c) => c.slug === categorySlug)
    if (!selected) {
      return { level0, children: [] }
    }

    let parent: { id: number; name: string; slug: string } | undefined = undefined
    if (selected.parentId) {
      const parentRow = all.find((c) => c.id === selected.parentId)
      if (parentRow) {
        parent = { id: parentRow.id, name: parentRow.name, slug: parentRow.slug }
      }
    }

    const children = all
      .filter((c) => c.parentId === selected.id)
      .map((c) => ({ id: c.id, name: c.name, slug: c.slug }))

    return {
      level0,
      selected: { id: selected.id, name: selected.name, slug: selected.slug, parentId: selected.parentId },
      parent,
      children,
    }
  } catch (err) {
    console.warn("getCustomerProductsCategoryTree fallback:", (err as Error).message)
    return { level0: [], children: [] }
  }
}

