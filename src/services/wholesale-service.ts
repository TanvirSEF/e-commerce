import { db } from "../db"
import { wholesalePrices, type WholesalePrice } from "../db/schema"
import { eq } from "drizzle-orm"
import { SEED_PRODUCTS, type SeedProduct } from "../db/seed/data"

export interface WholesaleTier {
  id: number
  productId: number | string
  minQty: number
  maxQty: number
  price: number
}

export const SEED_WHOLESALE_TIERS: WholesaleTier[] = [
  { id: 1, productId: 1, minQty: 5, maxQty: 19, price: 18.0 },
  { id: 2, productId: 1, minQty: 20, maxQty: 49, price: 15.0 },
  { id: 3, productId: 1, minQty: 50, maxQty: 999, price: 12.0 },
  { id: 4, productId: 2, minQty: 10, maxQty: 49, price: 42.0 },
  { id: 5, productId: 2, minQty: 50, maxQty: 999, price: 36.0 },
  { id: 6, productId: 4, minQty: 5, maxQty: 24, price: 29.0 },
  { id: 7, productId: 4, minQty: 25, maxQty: 999, price: 24.0 },
]

let inMemoryTiers: WholesaleTier[] = [...SEED_WHOLESALE_TIERS]

export async function getAllWholesaleProducts(filter: "all" | "inhouse" | "seller" = "all") {
  const wholesaleProductIds = Array.from(new Set(inMemoryTiers.map((t) => String(t.productId))))
  let list = SEED_PRODUCTS.filter((p) => wholesaleProductIds.includes(String(p.id)))

  if (filter === "inhouse") {
    list = list.filter((p) => p.sellerSlug === "inhouse" || !p.sellerSlug)
  } else if (filter === "seller") {
    list = list.filter((p) => p.sellerSlug && p.sellerSlug !== "inhouse")
  }

  return list.map((p) => ({
    ...p,
    tiers: inMemoryTiers.filter((t) => String(t.productId) === String(p.id)),
  }))
}

export async function getWholesaleTiersForProduct(productId: string | number): Promise<WholesaleTier[]> {
  try {
    const rows = await db
      .select()
      .from(wholesalePrices)
      .where(eq(wholesalePrices.productId, Number(productId)))
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        productId: r.productId,
        minQty: r.minQty,
        maxQty: r.maxQty,
        price: Number(r.price),
      }))
    }
  } catch (err) {
    console.warn("getWholesaleTiersForProduct fallback:", (err as Error).message)
  }
  return inMemoryTiers.filter((t) => String(t.productId) === String(productId))
}

export async function addWholesaleTier(data: {
  productId: string | number
  minQty: number
  maxQty: number
  price: number
}): Promise<WholesaleTier> {
  const newTier: WholesaleTier = {
    id: inMemoryTiers.length + 1,
    productId: data.productId,
    minQty: data.minQty,
    maxQty: data.maxQty,
    price: data.price,
  }
  try {
    const [inserted] = await db
      .insert(wholesalePrices)
      .values({
        productId: Number(data.productId),
        minQty: data.minQty,
        maxQty: data.maxQty,
        price: String(data.price),
      })
      .returning()
    if (inserted) {
      return {
        id: inserted.id,
        productId: inserted.productId,
        minQty: inserted.minQty,
        maxQty: inserted.maxQty,
        price: Number(inserted.price),
      }
    }
  } catch (err) {
    console.warn("addWholesaleTier fallback:", (err as Error).message)
  }
  inMemoryTiers.push(newTier)
  return newTier
}

export async function deleteWholesaleTier(id: number): Promise<boolean> {
  try {
    await db.delete(wholesalePrices).where(eq(wholesalePrices.id, id))
    return true
  } catch (err) {
    console.warn("deleteWholesaleTier fallback:", (err as Error).message)
  }
  inMemoryTiers = inMemoryTiers.filter((t) => t.id !== id)
  return true
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
