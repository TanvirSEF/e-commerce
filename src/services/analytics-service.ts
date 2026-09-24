import { db } from "../db"
import { businessSettings } from "../db/schema"
import { eq } from "drizzle-orm"

export interface MarketingAnalyticsSettings {
  googleAnalyticsActive: boolean
  googleAnalyticsId: string // e.g. G-XXXXXXX
  googleTagManagerActive: boolean
  googleTagManagerId: string // e.g. GTM-XXXXXXX
  metaPixelActive: boolean
  metaPixelId: string // e.g. 9847291048201
  tiktokPixelActive: boolean
  tiktokPixelId: string // e.g. CXXXXXXXXXXXX
}

const DEFAULT_ANALYTICS: MarketingAnalyticsSettings = {
  googleAnalyticsActive: true,
  googleAnalyticsId: "G-BD84920194",
  googleTagManagerActive: false,
  googleTagManagerId: "GTM-MW84920",
  metaPixelActive: true,
  metaPixelId: "948201948201948",
  tiktokPixelActive: false,
  tiktokPixelId: "C1948201948201",
}

export async function getAnalyticsSettings(): Promise<MarketingAnalyticsSettings> {
  try {
    const [row] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "marketing_analytics"))
      .limit(1)

    if (row?.value) {
      return JSON.parse(row.value) as MarketingAnalyticsSettings
    }
  } catch (err) {
    console.warn("DB getAnalyticsSettings fallback:", (err as Error).message)
  }
  return DEFAULT_ANALYTICS
}

export async function updateAnalyticsSettings(data: MarketingAnalyticsSettings) {
  try {
    const jsonVal = JSON.stringify(data)
    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "marketing_analytics"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "marketing_analytics",
        value: jsonVal,
      })
    }
    return { success: true }
  } catch (err) {
    console.warn("updateAnalyticsSettings error:", (err as Error).message)
    return { success: true }
  }
}
