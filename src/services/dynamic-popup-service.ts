import { db } from "../db"
import { dynamicPopups, type DynamicPopup, type NewDynamicPopup } from "../db/schema"
import { eq, desc } from "drizzle-orm"

const SEED_POPUPS: DynamicPopup[] = [
  {
    id: 1,
    title: "Exclusive Eid Mega Offer - Flat 25% Off!",
    summary: "Enjoy huge discounts across our whole fashion and lifestyle collections today.",
    bannerUrl: "/assets/img/slider/1.png",
    btnText: "Shop The Sale",
    btnBackgroundColor: "#d43533",
    btnTextColor: "white",
    link: "/flash-deals",
    delaySec: 3,
    durationSec: 15,
    status: true,
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-03-01"),
  },
]

export async function getAllDynamicPopups(): Promise<DynamicPopup[]> {
  try {
    const list = await db.select().from(dynamicPopups).orderBy(desc(dynamicPopups.createdAt))
    if (!list || list.length === 0) return SEED_POPUPS
    return list
  } catch (error) {
    console.warn("DB getAllDynamicPopups fallback:", error)
    return SEED_POPUPS
  }
}

export async function getActiveDynamicPopup(): Promise<DynamicPopup | null> {
  try {
    const [row] = await db
      .select()
      .from(dynamicPopups)
      .where(eq(dynamicPopups.status, true))
      .orderBy(desc(dynamicPopups.createdAt))
      .limit(1)

    if (row) return row
  } catch (error) {
    console.warn("DB getActiveDynamicPopup fallback:", error)
  }
  return SEED_POPUPS[0] || null
}

export async function createDynamicPopup(data: {
  title: string
  summary?: string
  bannerUrl: string
  btnText?: string
  btnBackgroundColor?: string
  btnTextColor?: string
  link?: string
  delaySec?: number
  durationSec?: number
}): Promise<DynamicPopup | null> {
  try {
    const [inserted] = await db
      .insert(dynamicPopups)
      .values({
        title: data.title,
        summary: data.summary || null,
        bannerUrl: data.bannerUrl,
        btnText: data.btnText || "Shop Now",
        btnBackgroundColor: data.btnBackgroundColor || "#d43533",
        btnTextColor: data.btnTextColor || "white",
        link: data.link || null,
        delaySec: data.delaySec ?? 3,
        durationSec: data.durationSec ?? 15,
        status: true,
      })
      .returning()
    return inserted || null
  } catch (error) {
    console.error("Failed to create dynamic popup:", error)
    return null
  }
}

export async function toggleDynamicPopupStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db
      .update(dynamicPopups)
      .set({ status, updatedAt: new Date() })
      .where(eq(dynamicPopups.id, id))
    return true
  } catch (error) {
    console.error("Failed to toggle popup status:", error)
    return false
  }
}

export async function deleteDynamicPopup(id: number): Promise<boolean> {
  try {
    await db.delete(dynamicPopups).where(eq(dynamicPopups.id, id))
    return true
  } catch (error) {
    console.error("Failed to delete dynamic popup:", error)
    return false
  }
}
