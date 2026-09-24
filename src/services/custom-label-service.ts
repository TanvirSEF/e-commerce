import { db } from "../db"
import { customLabels, type CustomLabel, type NewCustomLabel } from "../db/schema"
import { eq, desc, ilike, and } from "drizzle-orm"

const SEED_LABELS: CustomLabel[] = [
  {
    id: 1,
    text: "Hot Deal",
    backgroundColor: "#e62e04",
    textColor: "#ffffff",
    userType: "admin",
    addedBy: "Admin",
    sellerAccess: true,
    status: true,
    productIds: [1, 2],
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-03-01"),
  },
  {
    id: 2,
    text: "Super Saver",
    backgroundColor: "#10b981",
    textColor: "#ffffff",
    userType: "admin",
    addedBy: "Admin",
    sellerAccess: true,
    status: true,
    productIds: [3, 4],
    createdAt: new Date("2026-03-05"),
    updatedAt: new Date("2026-03-05"),
  },
  {
    id: 3,
    text: "Trending 2026",
    backgroundColor: "#8b5cf6",
    textColor: "#ffffff",
    userType: "admin",
    addedBy: "Admin",
    sellerAccess: false,
    status: true,
    productIds: [5],
    createdAt: new Date("2026-03-10"),
    updatedAt: new Date("2026-03-10"),
  },
]

export async function getCustomLabels(options?: {
  userType?: string
  search?: string
}): Promise<CustomLabel[]> {
  try {
    const conditions = []
    if (options?.userType && options.userType !== "all") {
      conditions.push(eq(customLabels.userType, options.userType))
    }
    if (options?.search) {
      conditions.push(ilike(customLabels.text, `%${options.search}%`))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined
    const labels = await db
      .select()
      .from(customLabels)
      .where(whereClause)
      .orderBy(desc(customLabels.createdAt))

    if (!labels || labels.length === 0) {
      if (options?.search) {
        return SEED_LABELS.filter((l) =>
          l.text.toLowerCase().includes(options.search!.toLowerCase())
        )
      }
      return SEED_LABELS
    }
    return labels
  } catch (error) {
    console.warn("DB getCustomLabels fallback:", error)
    if (options?.search) {
      return SEED_LABELS.filter((l) =>
        l.text.toLowerCase().includes(options.search!.toLowerCase())
      )
    }
    return SEED_LABELS
  }
}

export async function createCustomLabel(data: {
  text: string
  backgroundColor: string
  textColor: string
  productIds?: number[]
  userType?: string
  addedBy?: string
  sellerAccess?: boolean
}): Promise<CustomLabel | null> {
  try {
    const [inserted] = await db
      .insert(customLabels)
      .values({
        text: data.text,
        backgroundColor: data.backgroundColor,
        textColor: data.textColor,
        productIds: data.productIds || [],
        userType: data.userType || "admin",
        addedBy: data.addedBy || "Admin",
        sellerAccess: data.sellerAccess ?? true,
        status: true,
      })
      .returning()
    return inserted || null
  } catch (error) {
    console.error("Failed to create custom label:", error)
    return null
  }
}

export async function toggleCustomLabelStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db
      .update(customLabels)
      .set({ status, updatedAt: new Date() })
      .where(eq(customLabels.id, id))
    return true
  } catch (error) {
    console.error("Failed to toggle custom label status:", error)
    return false
  }
}

export async function toggleCustomLabelSellerAccess(id: number, sellerAccess: boolean): Promise<boolean> {
  try {
    await db
      .update(customLabels)
      .set({ sellerAccess, updatedAt: new Date() })
      .where(eq(customLabels.id, id))
    return true
  } catch (error) {
    console.error("Failed to toggle custom label seller access:", error)
    return false
  }
}

export async function deleteCustomLabel(id: number): Promise<boolean> {
  try {
    await db.delete(customLabels).where(eq(customLabels.id, id))
    return true
  } catch (error) {
    console.error("Failed to delete custom label:", error)
    return false
  }
}
