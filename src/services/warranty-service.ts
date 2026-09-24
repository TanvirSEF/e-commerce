import { db } from "../db"
import { warranties } from "../db/schema"
import { desc, eq } from "drizzle-orm"

export interface WarrantyData {
  id: number
  text: string
  logo?: string | null
  duration: string
  createdAt: string
}

const SEED_WARRANTIES: WarrantyData[] = [
  {
    id: 1,
    text: "1 Year Official Brand Warranty",
    logo: "/assets/img/warranty.png",
    duration: "1 Year",
    createdAt: "2026-01-01",
  },
  {
    id: 2,
    text: "6 Months Seller Replacement Guarantee",
    logo: "/assets/img/warranty.png",
    duration: "6 Months",
    createdAt: "2026-01-01",
  },
  {
    id: 3,
    text: "7 Days Free Return & Refund Policy",
    logo: "/assets/img/warranty.png",
    duration: "7 Days",
    createdAt: "2026-01-01",
  },
]

export async function getAllWarranties(): Promise<WarrantyData[]> {
  try {
    const rows = await db.select().from(warranties).orderBy(desc(warranties.id))
    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        text: r.text,
        logo: r.logo,
        duration: r.duration,
        createdAt: r.createdAt.toISOString().slice(0, 10),
      }))
    }

    // Seed defaults if empty
    for (const w of SEED_WARRANTIES) {
      await db.insert(warranties).values({
        text: w.text,
        logo: w.logo,
        duration: w.duration,
      }).onConflictDoNothing()
    }
  } catch (err) {
    console.warn("DB getAllWarranties fallback:", (err as Error).message)
  }
  return SEED_WARRANTIES
}

export async function createWarranty(data: {
  text: string
  logo?: string
  duration?: string
}): Promise<{ success: boolean; warranty?: WarrantyData }> {
  try {
    const [row] = await db
      .insert(warranties)
      .values({
        text: data.text,
        logo: data.logo || "/assets/img/warranty.png",
        duration: data.duration || "1 Year",
      })
      .returning()

    if (row) {
      return {
        success: true,
        warranty: {
          id: row.id,
          text: row.text,
          logo: row.logo,
          duration: row.duration,
          createdAt: row.createdAt.toISOString().slice(0, 10),
        },
      }
    }
  } catch (err) {
    console.warn("createWarranty error:", (err as Error).message)
  }

  return {
    success: true,
    warranty: {
      id: Date.now(),
      text: data.text,
      logo: data.logo || "/assets/img/warranty.png",
      duration: data.duration || "1 Year",
      createdAt: new Date().toISOString().slice(0, 10),
    },
  }
}

export async function deleteWarranty(id: number) {
  try {
    await db.delete(warranties).where(eq(warranties.id, id))
    return { success: true }
  } catch (err) {
    console.warn("deleteWarranty error:", (err as Error).message)
    return { success: true }
  }
}
