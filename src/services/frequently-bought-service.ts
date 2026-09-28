import { db } from "../db"
import {
  products,
  frequentlyBoughtProducts,
  lastViewedProducts,
  categories,
} from "../db/schema"
import { eq, and, ne, desc, sql } from "drizzle-orm"
import { SEED_PRODUCTS, type SeedProduct } from "../db/seed/data"

export interface FrequentlyBoughtItem {
  id: number | string
  name: string
  slug: string
  thumbnail: string
  price: number
  originalPrice: number
  discountPercent: number
  categoryName?: string
}

export async function getFrequentlyBoughtProducts(
  productId: number,
  limit: number = 6
): Promise<FrequentlyBoughtItem[]> {
  try {
    // 1. Check if the product has a specific frequently bought selection type
    const [currentProd] = await db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        selectionType: products.frequentlyBoughtSelectionType,
      })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    if (currentProd) {
      if (currentProd.selectionType === "category") {
        // Query category-specific linked products or products from the same category
        const fqCategoryRecord = await db
          .select({ categoryId: frequentlyBoughtProducts.categoryId })
          .from(frequentlyBoughtProducts)
          .where(
            and(
              eq(frequentlyBoughtProducts.productId, productId),
              sql`${frequentlyBoughtProducts.categoryId} IS NOT NULL`
            )
          )
          .limit(1)

        const targetCatId = fqCategoryRecord[0]?.categoryId || currentProd.categoryId

        if (targetCatId) {
          const catProducts = await db
            .select()
            .from(products)
            .where(
              and(
                eq(products.categoryId, targetCatId),
                eq(products.published, true),
                ne(products.id, productId)
              )
            )
            .limit(limit)

          if (catProducts.length > 0) {
            return catProducts.map(mapProductToItem)
          }
        }
      } else {
        // Explicitly selected products
        const linked = await db
          .select({
            p: products,
          })
          .from(frequentlyBoughtProducts)
          .innerJoin(
            products,
            eq(frequentlyBoughtProducts.frequentlyBoughtProductId, products.id)
          )
          .where(
            and(
              eq(frequentlyBoughtProducts.productId, productId),
              eq(products.published, true)
            )
          )
          .limit(limit)

        if (linked.length > 0) {
          return linked.map((row) => mapProductToItem(row.p))
        }
      }
    }

    // 2. Default fallback: other products from DB
    const fallbackDb = await db
      .select()
      .from(products)
      .where(and(eq(products.published, true), ne(products.id, productId)))
      .limit(limit)

    if (fallbackDb.length > 0) {
      return fallbackDb.map(mapProductToItem)
    }
  } catch (err) {
    console.warn("DB getFrequentlyBoughtProducts fallback:", err)
  }

  // 3. Static fallback
  return SEED_PRODUCTS.filter((p) => p.id !== String(productId))
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      thumbnail: p.thumbnail,
      price: p.price,
      originalPrice: p.originalPrice || Math.round(p.price * 1.25),
      discountPercent: p.discountPercent || 20,
    }))
}

function mapProductToItem(p: typeof products.$inferSelect): FrequentlyBoughtItem {
  const price = Number(p.unitPrice) || 0
  const discount = Number(p.discount) || 0
  const originalPrice =
    p.discountType === "percent" && discount > 0
      ? Math.round(price / (1 - discount / 100))
      : p.discountType === "flat" && discount > 0
      ? price + discount
      : price

  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    thumbnail: p.thumbnailImg,
    price,
    originalPrice,
    discountPercent,
  }
}

export async function recordProductView(userId: string, productId: number): Promise<void> {
  try {
    if (!userId || !productId) return
    await db.insert(lastViewedProducts).values({
      userId,
      productId,
    })
  } catch (err) {
    console.warn("Failed to record product view:", err)
  }
}

export async function getLastViewedProducts(
  userId: string,
  limit: number = 8
): Promise<FrequentlyBoughtItem[]> {
  try {
    if (!userId) return []

    const rows = await db
      .select({ p: products })
      .from(lastViewedProducts)
      .innerJoin(products, eq(lastViewedProducts.productId, products.id))
      .where(
        and(
          eq(lastViewedProducts.userId, userId),
          eq(products.published, true)
        )
      )
      .orderBy(desc(lastViewedProducts.createdAt))
      .limit(limit)

    return rows.map((r) => mapProductToItem(r.p))
  } catch (err) {
    console.warn("getLastViewedProducts fallback:", err)
    return []
  }
}
