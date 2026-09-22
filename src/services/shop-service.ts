import { db } from "../db"
import { shops } from "../db/schema"
import { eq, desc } from "drizzle-orm"
import { SEED_SHOPS, SeedShop, SEED_PRODUCTS, SeedProduct, SEED_COUPONS, SeedCoupon } from "../db/seed/data"

export async function getShops(): Promise<SeedShop[]> {
  try {
    const rows = await db.select().from(shops).orderBy(desc(shops.rating), shops.name)
    if (rows.length > 0) {
      return rows.map((s) => ({
        id: String(s.id),
        name: s.name,
        slug: s.slug,
        logo: s.logo || "/assets/img/placeholder.jpg",
        topBanner: s.topBanner || "/assets/img/placeholder-rect.jpg",
        sliders: s.sliders || ["/assets/img/placeholder-rect.jpg"],
        address: s.address || "Dhaka, Bangladesh",
        phone: s.phone || "+880 1700 000000",
        rating: Number(s.rating || 0),
        reviewCount: s.numOfReviews,
        followersCount: 350,
        verificationStatus: s.verificationStatus,
        memberSince: "15 Jan 2023",
        facebook: s.facebook || undefined,
        instagram: s.instagram || undefined,
        twitter: s.twitter || undefined,
        youtube: s.youtube || undefined,
      }))
    }
  } catch (err) {
    console.warn("DB getShops fallback to SEED_SHOPS:", (err as Error).message)
  }
  return SEED_SHOPS
}

export async function getShopBySlug(slug: string): Promise<SeedShop | null> {
  try {
    const [row] = await db.select().from(shops).where(eq(shops.slug, slug)).limit(1)
    if (row) {
      return {
        id: String(row.id),
        name: row.name,
        slug: row.slug,
        logo: row.logo || "/assets/img/placeholder.jpg",
        topBanner: row.topBanner || "/assets/img/placeholder-rect.jpg",
        sliders: row.sliders || ["/assets/img/placeholder-rect.jpg"],
        address: row.address || "Dhaka, Bangladesh",
        phone: row.phone || "+880 1700 000000",
        rating: Number(row.rating || 0),
        reviewCount: row.numOfReviews,
        followersCount: 420,
        verificationStatus: row.verificationStatus,
        memberSince: "15 Jan 2023",
        facebook: row.facebook || undefined,
        instagram: row.instagram || undefined,
        twitter: row.twitter || undefined,
        youtube: row.youtube || undefined,
      }
    }
  } catch (err) {
    console.warn("DB getShopBySlug fallback:", (err as Error).message)
  }
  return SEED_SHOPS.find((s) => s.slug === slug) || null
}

export async function getShopProducts(
  shopSlug: string,
  options: {
    type?: string
    categorySlug?: string
    minPrice?: number
    maxPrice?: number
    rating?: number
    sort?: string
  } = {}
): Promise<{ products: SeedProduct[]; total: number }> {
  let list = SEED_PRODUCTS.filter((p) => p.sellerSlug === shopSlug)
  if (list.length === 0) {
    // If specific shop has few products, share sample products
    list = SEED_PRODUCTS.slice(0, 6)
  }

  if (options.type === "top-selling") {
    list = [...list].sort((a, b) => b.salesCount - a.salesCount)
  }

  if (options.categorySlug) {
    list = list.filter((p) => p.categorySlug === options.categorySlug)
  }

  if (options.minPrice !== undefined) {
    list = list.filter((p) => p.price >= (options.minPrice ?? 0))
  }

  if (options.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= (options.maxPrice ?? 999999))
  }

  if (options.rating !== undefined && options.rating > 0) {
    list = list.filter((p) => p.rating >= (options.rating ?? 0))
  }

  if (options.sort === "price-low-to-high") {
    list = [...list].sort((a, b) => a.price - b.price)
  } else if (options.sort === "price-high-to-low") {
    list = [...list].sort((a, b) => b.price - a.price)
  }

  return {
    products: list,
    total: list.length,
  }
}

export async function getShopCoupons(shopSlug: string): Promise<SeedCoupon[]> {
  return SEED_COUPONS.filter((c) => !c.shopSlug || c.shopSlug === shopSlug)
}
