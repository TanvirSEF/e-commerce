import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getCategories } from "@/services/category-service"
import { db } from "@/db"
import { businessSettings } from "@/db/schema"
import { ilike } from "drizzle-orm"
import { SellerCategoryDiscountView, type CategoryDiscountItem } from "./_components/category-discount-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Category Base Product Discount | Seller Portal",
  description: "Set sitewide promotional discounts across all your products in specific categories",
}

export default async function SellerCategoryDiscountPage() {
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const shopId = sellerData.shop.id
  const shopName = sellerData.shop.name

  // Fetch real categories from PostgreSQL
  const dbCategories = await getCategories()

  // Fetch any existing category discounts for this shop
  let discountMap = new Map<number, { discount: number; dateRange: string }>()
  try {
    const rows = await db
      .select()
      .from(businessSettings)
      .where(ilike(businessSettings.type, `cat_discount_shop_${shopId}_cat_%`))

    for (const r of rows) {
      const match = r.type.match(/cat_(\d+)$/)
      if (match && r.value) {
        const catId = parseInt(match[1], 10)
        try {
          const parsed = JSON.parse(r.value)
          discountMap.set(catId, {
            discount: Number(parsed.discount || 0),
            dateRange: parsed.dateRange || "",
          })
        } catch {}
      }
    }
  } catch (err) {
    console.warn("Category discount settings lookup error:", err)
  }

  const formatted: CategoryDiscountItem[] = dbCategories.map((c) => {
    const numId = Number(c.id) || 0
    const existing = discountMap.get(numId)
    return {
      id: numId,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      discount: existing?.discount || 0,
      dateRange: existing?.dateRange || "",
    }
  })

  return (
    <div className="p-4 md:p-6">
      <SellerCategoryDiscountView
        categories={formatted}
        shopId={shopId}
        shopName={shopName}
      />
    </div>
  )
}
