import { db } from "../db"
import { products, categories, brands } from "../db/schema"
import { eq, ilike, and, gte, lte, desc, asc, count } from "drizzle-orm"
import { SEED_PRODUCTS, SeedProduct } from "../db/seed/data"

export interface ProductFilters {
  category?: string
  categorySlug?: string
  brand?: string
  brandSlug?: string
  q?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sort?: "newest" | "oldest" | "price-asc" | "price-desc" | "price_low_high" | "price_high_low" | "rating"
  page?: number
  limit?: number
  featured?: boolean
  todaysDeal?: boolean
}

export async function getProducts(filters: ProductFilters = {}): Promise<{ data: SeedProduct[]; total: number }> {
  const catSlug = filters.categorySlug || filters.category
  const bSlug = filters.brandSlug || filters.brand
  const searchTerm = filters.search || filters.q
  const { minPrice, maxPrice, page = 1, limit = 12, featured, todaysDeal } = filters
  const sort = filters.sort || "newest"

  try {
    const conditions = [eq(products.published, true)]

    if (catSlug) {
      conditions.push(eq(categories.slug, catSlug))
    }
    if (bSlug) {
      conditions.push(eq(brands.slug, bSlug))
    }
    if (searchTerm) {
      conditions.push(ilike(products.name, `%${searchTerm}%`))
    }
    if (minPrice !== undefined) {
      conditions.push(gte(products.unitPrice, minPrice.toString()))
    }
    if (maxPrice !== undefined) {
      conditions.push(lte(products.unitPrice, maxPrice.toString()))
    }
    if (featured !== undefined) {
      conditions.push(eq(products.featured, featured))
    }
    if (todaysDeal !== undefined) {
      conditions.push(eq(products.todaysDeal, todaysDeal))
    }

    let orderByClause = desc(products.createdAt)
    if (sort === "oldest") orderByClause = asc(products.createdAt)
    if (sort === "price-asc" || sort === "price_low_high") orderByClause = asc(products.unitPrice)
    if (sort === "price-desc" || sort === "price_high_low") orderByClause = desc(products.unitPrice)
    if (sort === "rating") orderByClause = desc(products.rating)

    const offset = (page - 1) * limit

    const [totalRes] = await db
      .select({ count: count() })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(and(...conditions))

    const total = Number(totalRes?.count || 0)

    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        unitPrice: products.unitPrice,
        purchasePrice: products.purchasePrice,
        discount: products.discount,
        discountType: products.discountType,
        currentStock: products.currentStock,
        unit: products.unit,
        rating: products.rating,
        numOfReviews: products.numOfReviews,
        numOfSale: products.numOfSale,
        thumbnailImg: products.thumbnailImg,
        photos: products.photos,
        colors: products.colors,
        choiceOptions: products.choiceOptions,
        variations: products.variations,
        featured: products.featured,
        todaysDeal: products.todaysDeal,
        description: products.description,
        categorySlug: categories.slug,
        categoryName: categories.name,
        brandSlug: brands.slug,
        brandName: brands.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(and(...conditions))
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset)

    if (rows.length > 0) {
      const data: SeedProduct[] = rows.map((p) => ({
        id: String(p.id),
        name: p.name,
        slug: p.slug,
        sku: p.sku || "",
        categorySlug: p.categorySlug || "",
        brandSlug: p.brandSlug || "",
        price: Number(p.unitPrice),
        originalPrice: p.purchasePrice ? Number(p.purchasePrice) : Number(p.unitPrice),
        discountPercent: Number(p.discount),
        rating: Number(p.rating),
        reviewCount: p.numOfReviews,
        salesCount: p.numOfSale,
        stock: p.currentStock,
        unit: p.unit,
        thumbnail: p.thumbnailImg,
        images: p.photos || [],
        colors: (p.colors || []).map((hex, i) => ({ name: `Color ${i + 1}`, hex })),
        sizes: (p.choiceOptions?.[0]?.values as string[]) || [],
        featured: p.featured,
        todaysDeal: p.todaysDeal,
        sellerName: "Active eCommerce Outlet",
        sellerSlug: "active-outlet",
        description: p.description || "",
        specifications: [],
        reviews: [],
      }))

      return { data, total }
    }
  } catch (err) {
    console.warn("DB getProducts fallback to SEED_PRODUCTS:", (err as Error).message)
  }

  // Fallback to in-memory SEED_PRODUCTS
  let list = [...SEED_PRODUCTS]
  if (catSlug) {
    list = list.filter((p) => p.categorySlug === catSlug)
  }
  if (bSlug) {
    list = list.filter((p) => p.brandSlug === bSlug)
  }
  if (searchTerm) {
    const q = searchTerm.toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(q))
  }
  if (minPrice !== undefined) {
    list = list.filter((p) => p.price >= (minPrice ?? 0))
  }
  if (maxPrice !== undefined) {
    list = list.filter((p) => p.price <= (maxPrice ?? 999999))
  }
  if (featured !== undefined) {
    list = list.filter((p) => p.featured === featured)
  }
  if (todaysDeal !== undefined) {
    list = list.filter((p) => p.todaysDeal === todaysDeal)
  }

  const offset = (page - 1) * limit
  return {
    data: list.slice(offset, offset + limit),
    total: list.length,
  }
}

export async function getProductBySlug(slug: string): Promise<SeedProduct | null> {
  try {
    const [row] = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        unitPrice: products.unitPrice,
        purchasePrice: products.purchasePrice,
        discount: products.discount,
        discountType: products.discountType,
        currentStock: products.currentStock,
        unit: products.unit,
        rating: products.rating,
        numOfReviews: products.numOfReviews,
        numOfSale: products.numOfSale,
        thumbnailImg: products.thumbnailImg,
        photos: products.photos,
        colors: products.colors,
        choiceOptions: products.choiceOptions,
        variations: products.variations,
        featured: products.featured,
        todaysDeal: products.todaysDeal,
        description: products.description,
        categorySlug: categories.slug,
        categoryName: categories.name,
        brandSlug: brands.slug,
        brandName: brands.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(and(eq(products.slug, slug), eq(products.published, true)))
      .limit(1)

    if (row) {
      return {
        id: String(row.id),
        name: row.name,
        slug: row.slug,
        sku: row.sku || "",
        categorySlug: row.categorySlug || "",
        brandSlug: row.brandSlug || "",
        price: Number(row.unitPrice),
        originalPrice: row.purchasePrice ? Number(row.purchasePrice) : Number(row.unitPrice),
        discountPercent: Number(row.discount),
        rating: Number(row.rating),
        reviewCount: row.numOfReviews,
        salesCount: row.numOfSale,
        stock: row.currentStock,
        unit: row.unit,
        thumbnail: row.thumbnailImg,
        images: row.photos?.length ? row.photos : [row.thumbnailImg],
        colors: (row.colors || []).map((hex, i) => ({ name: `Color ${i + 1}`, hex })),
        sizes: (row.choiceOptions?.[0]?.values as string[]) || [],
        featured: row.featured,
        todaysDeal: row.todaysDeal,
        sellerName: "Active eCommerce Outlet",
        sellerSlug: "active-outlet",
        description: row.description || "",
        specifications: [
          { label: "Category", value: row.categoryName || "General" },
          { label: "Brand", value: row.brandName || "Active" },
          { label: "Unit", value: row.unit },
          { label: "Stock", value: `${row.currentStock} items left` },
        ],
        reviews: [],
      }
    }
  } catch (err) {
    console.warn("DB getProductBySlug fallback:", (err as Error).message)
  }

  return SEED_PRODUCTS.find((p) => p.slug === slug) || null
}
