import { db } from "../db"
import { wholesalePrices, products, type WholesalePrice } from "../db/schema"
import { eq, desc, or, inArray } from "drizzle-orm"

export interface WholesaleTier {
  id: number
  productId: number | string
  minQty: number
  maxQty: number
  price: number
}

export async function getAllWholesaleProducts(filter: "all" | "inhouse" | "seller" = "all", shopId?: number) {
  try {
    // 1. Fetch all wholesale price tiers from PostgreSQL
    const dbTiers = await db.select().from(wholesalePrices)

    const tierProductIds = Array.from(new Set(dbTiers.map((t) => t.productId)))

    // 2. Query products from PostgreSQL that have wholesale_product=true OR have tiers
    const dbProducts = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        unitPrice: products.unitPrice,
        currentStock: products.currentStock,
        thumbnailImg: products.thumbnailImg,
        addedBy: products.addedBy,
        wholesaleProduct: products.wholesaleProduct,
        categoryId: products.categoryId,
        shopId: products.shopId,
      })
      .from(products)
      .where(
        tierProductIds.length > 0
          ? or(eq(products.wholesaleProduct, true), inArray(products.id, tierProductIds))
          : eq(products.wholesaleProduct, true)
      )
      .orderBy(desc(products.id))

    // 3. Filter by type (all, inhouse, seller) and shopId
    let filtered = dbProducts
    if (shopId) {
      filtered = filtered.filter((p) => p.shopId === shopId || p.addedBy === "seller")
    } else if (filter === "inhouse") {
      filtered = filtered.filter((p) => p.addedBy === "admin" || !p.addedBy)
    } else if (filter === "seller") {
      filtered = filtered.filter((p) => p.addedBy === "seller")
    }

    return filtered.map((p) => {
      const pTiers = dbTiers
        .filter((t) => t.productId === p.id)
        .map((t) => ({
          id: t.id,
          productId: t.productId,
          minQty: t.minQty,
          maxQty: t.maxQty,
          price: Number(t.price),
        }))
        .sort((a, b) => a.minQty - b.minQty)

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.unitPrice),
        stock: p.currentStock,
        thumbnail: p.thumbnailImg || "/assets/img/placeholder.jpg",
        sellerName: p.addedBy === "seller" ? "Seller Store" : "In-House",
        tiers: pTiers,
      }
    })
  } catch (err) {
    console.error("DB getAllWholesaleProducts error:", err)
    return []
  }
}

export async function getWholesaleTiersForProduct(productId: string | number): Promise<WholesaleTier[]> {
  try {
    const rows = await db
      .select()
      .from(wholesalePrices)
      .where(eq(wholesalePrices.productId, Number(productId)))
      .orderBy(wholesalePrices.minQty)

    return rows.map((r) => ({
      id: r.id,
      productId: r.productId,
      minQty: r.minQty,
      maxQty: r.maxQty,
      price: Number(r.price),
    }))
  } catch (err) {
    console.warn("getWholesaleTiersForProduct error:", (err as Error).message)
    return []
  }
}

export async function addWholesaleTier(data: {
  productId: string | number
  minQty: number
  maxQty: number
  price: number
}): Promise<WholesaleTier> {
  const [inserted] = await db
    .insert(wholesalePrices)
    .values({
      productId: Number(data.productId),
      minQty: data.minQty,
      maxQty: data.maxQty,
      price: String(data.price),
    })
    .returning()

  // Ensure product is flagged as wholesale_product = true in DB
  await db
    .update(products)
    .set({ wholesaleProduct: true })
    .where(eq(products.id, Number(data.productId)))

  return {
    id: inserted.id,
    productId: inserted.productId,
    minQty: inserted.minQty,
    maxQty: inserted.maxQty,
    price: Number(inserted.price),
  }
}

export async function deleteWholesaleTier(id: number): Promise<boolean> {
  try {
    await db.delete(wholesalePrices).where(eq(wholesalePrices.id, id))
    return true
  } catch (err) {
    console.error("deleteWholesaleTier error:", err)
    return false
  }
}

export function calculateWholesalePrice(
  tiers: WholesaleTier[],
  basePrice: number,
  quantity: number
): { unitPrice: number; isDiscounted: boolean; activeTier?: WholesaleTier } {
  const matched = tiers.find((t) => quantity >= t.minQty && quantity <= t.maxQty)
  if (matched) {
    return { unitPrice: matched.price, isDiscounted: true, activeTier: matched }
  }
  return { unitPrice: basePrice, isDiscounted: false }
}
