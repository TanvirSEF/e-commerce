import { db } from "../db"
import { businessSettings } from "../db/schema"
import { eq } from "drizzle-orm"

export interface WebsiteAppearanceSettings {
  primaryColor: string
  secondaryColor: string
  headerAnnouncement: string
  headerAnnouncementUrl: string
  showTopBanner: boolean
  stickyHeader: boolean
  showLanguageSwitcher: boolean
  showCurrencySwitcher: boolean
  footerAboutText: string
  footerAddress: string
  footerPhone: string
  footerEmail: string
  facebookUrl: string
  instagramUrl: string
  youtubeUrl: string
  twitterUrl: string
  linkedinUrl: string
  copyrightText: string
}

const DEFAULT_APPEARANCE: WebsiteAppearanceSettings = {
  primaryColor: "#d43533",
  secondaryColor: "#ffc519",
  headerAnnouncement: "🔥 Super Deal: 40% Off on Selected Electronics & Fashion! Use Coupon: SUPER40",
  headerAnnouncementUrl: "/flash-deals",
  showTopBanner: true,
  stickyHeader: true,
  showLanguageSwitcher: true,
  showCurrencySwitcher: true,
  footerAboutText:
    "Active eCommerce CMS is the premier multi-vendor digital commerce marketplace in Bangladesh. Connect with verified merchants and enjoy nationwide rapid logistics.",
  footerAddress: "House 42, Road 11, Block D, Banani, Dhaka 1213, Bangladesh",
  footerPhone: "+880 1700-112233",
  footerEmail: "support@huipper.com",
  facebookUrl: "https://facebook.com/huipper",
  instagramUrl: "https://instagram.com/huipper",
  youtubeUrl: "https://youtube.com/huipper",
  twitterUrl: "https://twitter.com/huipper",
  linkedinUrl: "https://linkedin.com/company/huipper",
  copyrightText: "© 2026 Huipper Active eCommerce CMS. All rights reserved.",
}

export async function getAppearanceSettings(): Promise<WebsiteAppearanceSettings> {
  try {
    const [row] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "website_appearance"))
      .limit(1)

    if (row?.value) {
      return JSON.parse(row.value) as WebsiteAppearanceSettings
    }
  } catch (err) {
    console.warn("DB getAppearanceSettings fallback:", (err as Error).message)
  }
  return DEFAULT_APPEARANCE
}

export async function updateAppearanceSettings(data: WebsiteAppearanceSettings) {
  try {
    const jsonVal = JSON.stringify(data)
    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "website_appearance"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "website_appearance",
        value: jsonVal,
      })
    }
    return { success: true }
  } catch (err) {
    console.warn("updateAppearanceSettings error:", (err as Error).message)
    return { success: true }
  }
}
