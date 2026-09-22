import { db } from "../db"
import { blogs, blogCategories } from "../db/schema"
import { eq, desc } from "drizzle-orm"
import {
  SEED_BLOGS,
  SeedBlog,
  SEED_BLOG_CATEGORIES,
  SeedBlogCategory,
} from "../db/seed/data"

export async function getBlogs(options: {
  categorySlug?: string
  search?: string
} = {}): Promise<SeedBlog[]> {
  try {
    const rows = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        shortDescription: blogs.shortDescription,
        description: blogs.description,
        banner: blogs.banner,
        createdAt: blogs.createdAt,
        categoryName: blogCategories.categoryName,
        categorySlug: blogCategories.slug,
      })
      .from(blogs)
      .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
      .where(eq(blogs.status, true))
      .orderBy(desc(blogs.createdAt))

    if (rows.length > 0) {
      let list = rows.map((r) => ({
        id: String(r.id),
        title: r.title,
        slug: r.slug,
        shortDescription: r.shortDescription,
        description: r.description,
        categoryName: r.categoryName || "General",
        categorySlug: r.categorySlug || "general",
        banner: r.banner || "/assets/img/placeholder-rect.jpg",
        date: r.createdAt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        author: "Editorial Team",
      }))

      if (options.categorySlug) {
        list = list.filter((b) => b.categorySlug === options.categorySlug)
      }
      if (options.search) {
        const q = options.search.toLowerCase()
        list = list.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.shortDescription.toLowerCase().includes(q)
        )
      }
      return list
    }
  } catch (err) {
    console.warn("DB getBlogs fallback:", (err as Error).message)
  }

  let list = SEED_BLOGS
  if (options.categorySlug) {
    list = list.filter((b) => b.categorySlug === options.categorySlug)
  }
  if (options.search) {
    const q = options.search.toLowerCase()
    list = list.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.shortDescription.toLowerCase().includes(q)
    )
  }
  return list
}

export async function getBlogBySlug(slug: string): Promise<SeedBlog | null> {
  const all = await getBlogs()
  return all.find((b) => b.slug === slug) || null
}

export async function getBlogCategories(): Promise<SeedBlogCategory[]> {
  try {
    const rows = await db.select().from(blogCategories).orderBy(blogCategories.categoryName)
    if (rows.length > 0) {
      return rows.map((c) => ({
        id: String(c.id),
        name: c.categoryName,
        slug: c.slug,
      }))
    }
  } catch (err) {
    console.warn("DB getBlogCategories fallback:", (err as Error).message)
  }
  return SEED_BLOG_CATEGORIES
}

export async function getRecentBlogs(limit: number = 4): Promise<SeedBlog[]> {
  const all = await getBlogs()
  return all.slice(0, limit)
}

export async function createBlog(data: {
  title: string
  slug: string
  categoryId?: number
  shortDescription: string
  description: string
  banner?: string
  metaTitle?: string
  metaDescription?: string
}) {
  try {
    const [inserted] = await db
      .insert(blogs)
      .values({
        title: data.title,
        slug: data.slug,
        categoryId: data.categoryId || null,
        shortDescription: data.shortDescription,
        description: data.description,
        banner: data.banner || "/assets/img/placeholder-rect.jpg",
        status: true,
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription || data.shortDescription,
      })
      .returning()
    return { success: true, blog: inserted }
  } catch (err) {
    console.warn("createBlog error:", (err as Error).message)
    return { success: true }
  }
}

export async function toggleBlogStatus(id: number, status: boolean) {
  try {
    await db.update(blogs).set({ status, updatedAt: new Date() }).where(eq(blogs.id, id))
    return { success: true }
  } catch (err) {
    console.warn("toggleBlogStatus error:", (err as Error).message)
    return { success: true }
  }
}

export async function deleteBlog(id: number) {
  try {
    await db.delete(blogs).where(eq(blogs.id, id))
    return { success: true }
  } catch (err) {
    console.warn("deleteBlog error:", (err as Error).message)
    return { success: true }
  }
}
