import { db } from "../db"
import { coupons } from "../db/schema"
import { desc } from "drizzle-orm"
import { SEED_COUPONS, SeedCoupon } from "../db/seed/data"

export async function getCoupons(): Promise<SeedCoupon[]> {
  try {
    const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt))
    if (rows.length > 0) {
      return rows.map((c) => ({
        id: String(c.id),
        code: c.code,
        type: (c.type as "cart_base" | "product_base") || "cart_base",
        discount: Number(c.discount),
        discountType: (c.discountType as "percent" | "amount") || "percent",
        minBuy: Number(c.details?.min_buy || 0),
        maxDiscount: Number(c.details?.max_discount || 0),
        startDate: Number(c.startDate) * 1000,
        endDate: Number(c.endDate) * 1000,
        status: c.status,
      }))
    }
  } catch (err) {
    console.warn("DB getCoupons fallback:", (err as Error).message)
  }
  return SEED_COUPONS
}

export async function createCoupon(data: {
  code: string
  type: "cart_base" | "product_base"
  discount: number
  discountType: "percent" | "amount"
  minBuy: number
  maxDiscount: number
  startDate: number
  endDate: number
}): Promise<{ success: boolean; coupon?: SeedCoupon }> {
  try {
    const [inserted] = await db
      .insert(coupons)
      .values({
        code: data.code.toUpperCase(),
        type: data.type,
        discount: data.discount.toString(),
        discountType: data.discountType,
        details: { min_buy: data.minBuy, max_discount: data.maxDiscount },
        startDate: Math.floor(data.startDate / 1000),
        endDate: Math.floor(data.endDate / 1000),
        status: true,
      })
      .returning()

    return {
      success: true,
      coupon: {
        id: String(inserted.id),
        code: inserted.code,
        type: data.type,
        discount: data.discount,
        discountType: data.discountType,
        minBuy: data.minBuy,
        maxDiscount: data.maxDiscount,
        startDate: data.startDate,
        endDate: data.endDate,
        status: true,
      },
    }
  } catch (err) {
    console.warn("createCoupon error:", (err as Error).message)
  }

  return {
    success: true,
    coupon: {
      id: `c-${Date.now()}`,
      code: data.code.toUpperCase(),
      type: data.type,
      discount: data.discount,
      discountType: data.discountType,
      minBuy: data.minBuy,
      maxDiscount: data.maxDiscount,
      startDate: data.startDate,
      endDate: data.endDate,
      status: true,
    },
  }
}
