import { db } from "../db"
import { blogs, blogCategories } from "../db/schema"
import { eq, desc, ilike, or, and, count } from "drizzle-orm"
import type { AdminBlogItem, AdminBlogsResponse, BlogCategoryItem, BlogInputData } from "@/types/blog"
import type { SeedBlog } from "../db/seed/data"

export * from "@/types/blog"

/**
 * 1:1 Active eCommerce Admin Blog List Query
 */
export async function getAllBlogsAdmin(params?: {
  search?: string
  status?: string
}): Promise<AdminBlogsResponse> {
  try {
    const search = params?.search?.trim()
    const statusFilter = params?.status && params.status !== "all" ? params.status : null

    const whereConditions = []
    if (search) {
      whereConditions.push(
        or(ilike(blogs.title, `%${search}%`), ilike(blogs.shortDescription, `%${search}%`), ilike(blogCategories.categoryName, `%${search}%`))
      )
    }
    if (statusFilter === "published") whereConditions.push(eq(blogs.status, true))
    else if (statusFilter === "draft") whereConditions.push(eq(blogs.status, false))

    const rows = await db
      .select({
        id: blogs.id, title: blogs.title, slug: blogs.slug, categoryId: blogs.categoryId,
        shortDescription: blogs.shortDescription, description: blogs.description,
        banner: blogs.banner, status: blogs.status, metaTitle: blogs.metaTitle,
        metaImg: blogs.metaImg, metaDescription: blogs.metaDescription, metaKeywords: blogs.metaKeywords,
        createdAt: blogs.createdAt, updatedAt: blogs.updatedAt,
        categoryName: blogCategories.categoryName, categorySlug: blogCategories.slug,
      })
      .from(blogs)
      .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(blogs.createdAt))

    const statusCountsRaw = await db
      .select({ status: blogs.status, count: count() })
      .from(blogs)
      .groupBy(blogs.status)

    let publishedCount = 0, draftCount = 0
    for (const sc of statusCountsRaw) {
      if (sc.status) publishedCount = Number(sc.count)
      else draftCount = Number(sc.count)
    }

    const [catCountRes] = await db.select({ val: count() }).from(blogCategories)
    const categoriesCount = Number(catCountRes?.val || 0)

    const items: AdminBlogItem[] = rows.map((r) => ({
      id: r.id, title: r.title, slug: r.slug, categoryId: r.categoryId,
      categoryName: r.categoryName || "General", categorySlug: r.categorySlug || "general",
      shortDescription: r.shortDescription, description: r.description, banner: r.banner || null,
      status: Boolean(r.status), metaTitle: r.metaTitle || null, metaImg: r.metaImg || null,
      metaDescription: r.metaDescription || null, metaKeywords: r.metaKeywords || null,
      createdAt: r.createdAt.toISOString().slice(0, 19).replace("T", " "),
      updatedAt: r.updatedAt.toISOString().slice(0, 19).replace("T", " "),
    }))

    return { blogs: items, total: publishedCount + draftCount, publishedCount, draftCount, categoriesCount }
  } catch (err) {
    console.error("Error in getAllBlogsAdmin:", err)
    return { blogs: [], total: 0, publishedCount: 0, draftCount: 0, categoriesCount: 0 }
  }
}

/**
 * 1:1 Active eCommerce Admin Blog Show/Edit Query
 */
export async function getBlogByIdAdmin(id: number): Promise<AdminBlogItem | null> {
  try {
    const [r] = await db
      .select({
        id: blogs.id, title: blogs.title, slug: blogs.slug, categoryId: blogs.categoryId,
        shortDescription: blogs.shortDescription, description: blogs.description,
        banner: blogs.banner, status: blogs.status, metaTitle: blogs.metaTitle,
        metaImg: blogs.metaImg, metaDescription: blogs.metaDescription, metaKeywords: blogs.metaKeywords,
        createdAt: blogs.createdAt, updatedAt: blogs.updatedAt,
        categoryName: blogCategories.categoryName, categorySlug: blogCategories.slug,
      })
      .from(blogs)
      .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
      .where(eq(blogs.id, id))

    if (!r) return null

    return {
      id: r.id, title: r.title, slug: r.slug, categoryId: r.categoryId,
      categoryName: r.categoryName || "General", categorySlug: r.categorySlug || "general",
      shortDescription: r.shortDescription, description: r.description, banner: r.banner || null,
      status: Boolean(r.status), metaTitle: r.metaTitle || null, metaImg: r.metaImg || null,
      metaDescription: r.metaDescription || null, metaKeywords: r.metaKeywords || null,
      createdAt: r.createdAt.toISOString().slice(0, 19).replace("T", " "),
      updatedAt: r.updatedAt.toISOString().slice(0, 19).replace("T", " "),
    }
  } catch (err) {
    console.error("Error in getBlogByIdAdmin:", err)
    return null
  }
}

/**
 * Get all blog categories
 */
export async function getBlogCategories(): Promise<BlogCategoryItem[]> {
  try {
    const rows = await db.select().from(blogCategories).orderBy(blogCategories.categoryName)
    return rows.map((c) => ({
      id: c.id, name: c.categoryName, categoryName: c.categoryName, slug: c.slug,
      createdAt: c.createdAt.toISOString().slice(0, 10),
    }))
  } catch (err) {
    console.error("Error in getBlogCategories:", err)
    return []
  }
}

/**
 * Create a new blog post
 */
export async function createBlog(data: BlogInputData) {
  const [inserted] = await db
    .insert(blogs)
    .values({
      title: data.title, slug: data.slug, categoryId: data.categoryId || null,
      shortDescription: data.shortDescription, description: data.description, banner: data.banner || null,
      status: data.status !== undefined ? data.status : true,
      metaTitle: data.metaTitle || data.title, metaImg: data.metaImg || data.banner || null,
      metaDescription: data.metaDescription || data.shortDescription, metaKeywords: data.metaKeywords || null,
    })
    .returning()

  return { success: true, blog: inserted }
}

/**
 * Update an existing blog post
 */
export async function updateBlog(id: number, data: BlogInputData) {
  const [updated] = await db
    .update(blogs)
    .set({
      title: data.title, slug: data.slug, categoryId: data.categoryId || null,
      shortDescription: data.shortDescription, description: data.description, banner: data.banner || null,
      status: data.status !== undefined ? data.status : true,
      metaTitle: data.metaTitle || data.title, metaImg: data.metaImg || data.banner || null,
      metaDescription: data.metaDescription || data.shortDescription, metaKeywords: data.metaKeywords || null,
      updatedAt: new Date(),
    })
    .where(eq(blogs.id, id))
    .returning()

  return { success: true, blog: updated }
}

/**
 * Toggle blog published status
 */
export async function toggleBlogStatus(id: number, status: boolean) {
  try {
    await db.update(blogs).set({ status, updatedAt: new Date() }).where(eq(blogs.id, id))
    return { success: true }
  } catch (err) {
    console.error("toggleBlogStatus error:", err)
    return { success: false }
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlog(id: number) {
  try {
    await db.delete(blogs).where(eq(blogs.id, id))
    return { success: true }
  } catch (err) {
    console.error("deleteBlog error:", err)
    return { success: false }
  }
}

/**
 * Frontend: Fetch published blogs
 */
export async function getBlogs(options: { categorySlug?: string; search?: string } = {}): Promise<SeedBlog[]> {
  try {
    const whereConditions = [eq(blogs.status, true)]
    if (options.categorySlug) whereConditions.push(eq(blogCategories.slug, options.categorySlug))
    if (options.search) {
      whereConditions.push(
        or(ilike(blogs.title, `%${options.search}%`), ilike(blogs.shortDescription, `%${options.search}%`))!
      )
    }

    const rows = await db
      .select({
        id: blogs.id, title: blogs.title, slug: blogs.slug, shortDescription: blogs.shortDescription,
        description: blogs.description, banner: blogs.banner, createdAt: blogs.createdAt,
        categoryName: blogCategories.categoryName, categorySlug: blogCategories.slug,
      })
      .from(blogs)
      .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
      .where(and(...whereConditions))
      .orderBy(desc(blogs.createdAt))

    return rows.map((r) => ({
      id: String(r.id), title: r.title, slug: r.slug, shortDescription: r.shortDescription,
      description: r.description, categoryName: r.categoryName || "General",
      categorySlug: r.categorySlug || "general", banner: r.banner || "/assets/img/placeholder-rect.jpg",
      date: r.createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      author: "Editorial Team",
    }))
  } catch (err) {
    console.error("getBlogs error:", err)
    return []
  }
}

/**
 * Frontend: Fetch single published blog by slug
 */
export async function getBlogBySlug(slug: string): Promise<SeedBlog | null> {
  try {
    const [r] = await db
      .select({
        id: blogs.id, title: blogs.title, slug: blogs.slug, shortDescription: blogs.shortDescription,
        description: blogs.description, banner: blogs.banner, createdAt: blogs.createdAt,
        categoryName: blogCategories.categoryName, categorySlug: blogCategories.slug,
      })
      .from(blogs)
      .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
      .where(and(eq(blogs.slug, slug), eq(blogs.status, true)))

    if (!r) return null

    return {
      id: String(r.id), title: r.title, slug: r.slug, shortDescription: r.shortDescription,
      description: r.description, categoryName: r.categoryName || "General",
      categorySlug: r.categorySlug || "general", banner: r.banner || "/assets/img/placeholder-rect.jpg",
      date: r.createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      author: "Editorial Team",
    }
  } catch (err) {
    console.error("getBlogBySlug error:", err)
    return null
  }
}

/**
 * Frontend: Recent blogs
 */
export async function getRecentBlogs(limit: number = 4): Promise<SeedBlog[]> {
  const all = await getBlogs()
  return all.slice(0, limit)
}
