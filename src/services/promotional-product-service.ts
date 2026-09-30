import { db } from "../db"
import { products, categories, brands, shops } from "../db/schema"
import { eq, desc, asc, and, or, ilike, sql, inArray, gt, lte } from "drizzle-orm"

export interface PromotionalProductItem {
  id: number
  name: string
  slug: string
  sku: string | null
  thumbnailImg: string
  unitPrice: number
  discount: number
  discountType: string
  currentStock: number
  rating: number
  numOfReviews: number
  todaysDeal: boolean
  promotional: boolean
  published: boolean
  addedBy: string
  category: { id: number; name: string } | null
  brand: { id: number; name: string } | null
  shop: { id: number; name: string } | null
}

export interface GetPromotionalProductsParams {
  search?: string
  type?: string
  selectedFilter?: string[]
  brandId?: number
  categoryId?: number
  page?: number
  limit?: number
}

export interface PromotionalProductsResponse {
  products: PromotionalProductItem[]
  totalCount: number
  currentPage: number
  perPage: number
  totalPages: number
}

export async function getPromotionalProducts(
  params: GetPromotionalProductsParams = {}
): Promise<PromotionalProductsResponse> {
  const page = Math.max(1, params.page || 1)
  const limit = Math.max(1, params.limit || 15)
  const offset = (page - 1) * limit

  try {
    const conditions = [
      eq(products.promotional, true),
      eq(products.wholesaleProduct, false),
    ]

    if (params.search && params.search.trim()) {
      const q = `%${params.search.trim()}%`
      conditions.push(
        or(
          ilike(products.name, q),
          ilike(products.sku, q)
        )!
      )
    }

    if (params.categoryId) {
      conditions.push(eq(products.categoryId, params.categoryId))
    }

    if (params.brandId) {
      conditions.push(eq(products.brandId, params.brandId))
    }

    if (params.selectedFilter && params.selectedFilter.length > 0) {
      if (params.selectedFilter.includes("low-stock")) {
        conditions.push(lte(products.currentStock, 10))
      }
      if (params.selectedFilter.includes("all-discount")) {
        conditions.push(gt(products.discount, "0"))
      }
      if (params.selectedFilter.includes("all-publish")) {
        conditions.push(eq(products.published, true))
      }
    }

    const whereClause = and(...conditions)

    // Count query
    const [countRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(whereClause)

    const totalCount = countRow ? Number(countRow.count) : 0
    const totalPages = Math.ceil(totalCount / limit) || 1

    // Sorting
    let orderClause = desc(products.updatedAt)
    if (params.type === "rating,desc") {
      orderClause = desc(products.rating)
    } else if (params.type === "rating,asc") {
      orderClause = asc(products.rating)
    } else if (params.type === "unit_price,desc") {
      orderClause = desc(products.unitPrice)
    } else if (params.type === "unit_price,asc") {
      orderClause = asc(products.unitPrice)
    }

    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        thumbnailImg: products.thumbnailImg,
        unitPrice: products.unitPrice,
        discount: products.discount,
        discountType: products.discountType,
        currentStock: products.currentStock,
        rating: products.rating,
        numOfReviews: products.numOfReviews,
        todaysDeal: products.todaysDeal,
        promotional: products.promotional,
        published: products.published,
        addedBy: products.addedBy,
        categoryId: products.categoryId,
        categoryName: categories.name,
        brandId: products.brandId,
        brandName: brands.name,
        shopId: products.shopId,
        shopName: shops.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(shops, eq(products.shopId, shops.id))
      .where(whereClause)
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset)

    const mappedProducts: PromotionalProductItem[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      sku: r.sku,
      thumbnailImg: r.thumbnailImg || "/assets/img/placeholder.jpg",
      unitPrice: Number(r.unitPrice) || 0,
      discount: Number(r.discount) || 0,
      discountType: r.discountType || "percent",
      currentStock: r.currentStock || 0,
      rating: Number(r.rating) || 0,
      numOfReviews: r.numOfReviews || 0,
      todaysDeal: Boolean(r.todaysDeal),
      promotional: Boolean(r.promotional),
      published: Boolean(r.published),
      addedBy: r.addedBy || "admin",
      category: r.categoryId && r.categoryName ? { id: r.categoryId, name: r.categoryName } : null,
      brand: r.brandId && r.brandName ? { id: r.brandId, name: r.brandName } : null,
      shop: r.shopId && r.shopName ? { id: r.shopId, name: r.shopName } : null,
    }))

    return {
      products: mappedProducts,
      totalCount,
      currentPage: page,
      perPage: limit,
      totalPages,
    }
  } catch (error) {
    console.error("Error in getPromotionalProducts:", error)
    return {
      products: [],
      totalCount: 0,
      currentPage: 1,
      perPage: limit,
      totalPages: 1,
    }
  }
}

export interface SearchProductForPromotionalItem {
  id: number
  name: string
  thumbnailImg: string
  unitPrice: number
  promotional: boolean
}

export async function searchProductsForPromotional(params: {
  searchKey?: string
  categoryId?: number
}): Promise<SearchProductForPromotionalItem[]> {
  try {
    const conditions = [
      eq(products.wholesaleProduct, false),
      eq(products.published, true),
    ]

    if (params.searchKey && params.searchKey.trim()) {
      conditions.push(ilike(products.name, `%${params.searchKey.trim()}%`))
    }

    if (params.categoryId) {
      conditions.push(eq(products.categoryId, params.categoryId))
    }

    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        thumbnailImg: products.thumbnailImg,
        unitPrice: products.unitPrice,
        promotional: products.promotional,
      })
      .from(products)
      .where(and(...conditions))
      .orderBy(desc(products.updatedAt))
      .limit(50)

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      thumbnailImg: r.thumbnailImg || "/assets/img/placeholder.jpg",
      unitPrice: Number(r.unitPrice) || 0,
      promotional: Boolean(r.promotional),
    }))
  } catch (error) {
    console.error("Error in searchProductsForPromotional:", error)
    return []
  }
}

export async function updatePromotionalProducts(
  allIds: number[],
  checkedIds: number[]
): Promise<boolean> {
  if (!allIds || allIds.length === 0) return false

  try {
    if (checkedIds.length > 0) {
      await db
        .update(products)
        .set({ promotional: true, updatedAt: new Date() })
        .where(inArray(products.id, checkedIds))
    }

    const uncheckedIds = allIds.filter((id) => !checkedIds.includes(id))
    if (uncheckedIds.length > 0) {
      await db
        .update(products)
        .set({ promotional: false, todaysDeal: false, updatedAt: new Date() })
        .where(inArray(products.id, uncheckedIds))
    }

    return true
  } catch (error) {
    console.error("Error in updatePromotionalProducts:", error)
    return false
  }
}

export async function removePromotionalProducts(productIds: number[]): Promise<boolean> {
  if (!productIds || productIds.length === 0) return false
  return updatePromotionalProducts(productIds, [])
}

export async function togglePromotionalProductTodaysDeal(
  id: number,
  status: boolean
): Promise<boolean> {
  try {
    await db
      .update(products)
      .set({ todaysDeal: status, updatedAt: new Date() })
      .where(eq(products.id, id))
    return true
  } catch (error) {
    console.error("Error toggling product todaysDeal:", error)
    return false
  }
}

export async function getCategoriesForPromotional(): Promise<{ id: number; name: string }[]> {
  try {
    const rows = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .orderBy(categories.name)

    return rows
  } catch (error) {
    console.error("Error fetching categories for promotional:", error)
    return []
  }
}
