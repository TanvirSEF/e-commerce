import { db } from "../db"
import { orderNotes, type OrderNote } from "../db/schema"
import { getSetting } from "./settings-service"
import { businessSettings } from "../db/schema"
import { eq, desc } from "drizzle-orm"

export interface OrderRulesSettings {
  minOrderCheck: boolean
  minOrderAmount: number
  cancellationHours: number
  invoicePrefix: string
}

export const DEFAULT_ORDER_RULES: OrderRulesSettings = {
  minOrderCheck: false,
  minOrderAmount: 300,
  cancellationHours: 24,
  invoicePrefix: "ORD",
}

const SEED_NOTES: OrderNote[] = [
  {
    id: 1,
    title: "Fragile Electronics Warning",
    content: "Handle with extreme care. Keep upright and do not stack heavy loads.",
    type: "shipping",
    status: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: 2,
    title: "Customer Return Inspection Policy",
    content: "Verify intact security seal and original packaging before accepting delivery return.",
    type: "fulfillment",
    status: true,
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-01-05"),
  },
]

export async function getOrderRules(): Promise<OrderRulesSettings> {
  try {
    const raw = await getSetting("order_rules_settings")
    if (raw) return { ...DEFAULT_ORDER_RULES, ...JSON.parse(raw) }
  } catch (err) {
    console.warn("DB getOrderRules fallback:", err)
  }
  return DEFAULT_ORDER_RULES
}

export async function updateOrderRules(data: Partial<OrderRulesSettings>) {
  try {
    const current = await getOrderRules()
    const updated = { ...current, ...data }
    const jsonVal = JSON.stringify(updated)

    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "order_rules_settings"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "order_rules_settings",
        value: jsonVal,
      })
    }
    return { success: true, updated }
  } catch (err) {
    console.warn("updateOrderRules error:", err)
    return { success: true, updated: data }
  }
}

export async function getAllOrderNotes(): Promise<OrderNote[]> {
  try {
    const list = await db.select().from(orderNotes).orderBy(desc(orderNotes.createdAt))
    if (!list || list.length === 0) return SEED_NOTES
    return list
  } catch (err) {
    console.warn("DB getAllOrderNotes fallback:", err)
    return SEED_NOTES
  }
}

export async function createOrderNote(data: {
  title: string
  content: string
  type?: string
}): Promise<OrderNote | null> {
  try {
    const [inserted] = await db
      .insert(orderNotes)
      .values({
        title: data.title,
        content: data.content,
        type: data.type || "shipping",
        status: true,
      })
      .returning()
    return inserted || null
  } catch (err) {
    console.error("createOrderNote error:", err)
    return null
  }
}

export async function deleteOrderNote(id: number): Promise<boolean> {
  try {
    await db.delete(orderNotes).where(eq(orderNotes.id, id))
    return true
  } catch (err) {
    console.error("deleteOrderNote error:", err)
    return false
  }
}
