import { db } from "../db"
import { taxes, type Tax, type NewTax } from "../db/schema"
import { eq, desc } from "drizzle-orm"

const SEED_TAXES: Tax[] = [
  {
    id: 1,
    name: "VAT (Standard 15% NBR Bangladesh)",
    taxStatus: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: 2,
    name: "AIT (Advance Income Tax 5%)",
    taxStatus: true,
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-01-05"),
  },
  {
    id: 3,
    name: "Supplementary Duty (SD 10%)",
    taxStatus: false,
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-01-10"),
  },
]

export async function getAllTaxes(): Promise<Tax[]> {
  try {
    const list = await db.select().from(taxes).orderBy(desc(taxes.createdAt))
    if (!list || list.length === 0) {
      return SEED_TAXES
    }
    return list
  } catch (error) {
    console.warn("DB getAllTaxes fallback:", error)
    return SEED_TAXES
  }
}

export async function createTax(name: string): Promise<Tax | null> {
  try {
    const [inserted] = await db
      .insert(taxes)
      .values({
        name,
        taxStatus: true,
      })
      .returning()
    return inserted || null
  } catch (error) {
    console.error("Failed to create tax:", error)
    return null
  }
}

export async function updateTax(id: number, name: string): Promise<boolean> {
  try {
    await db
      .update(taxes)
      .set({ name, updatedAt: new Date() })
      .where(eq(taxes.id, id))
    return true
  } catch (error) {
    console.error("Failed to update tax:", error)
    return false
  }
}

export async function toggleTaxStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db
      .update(taxes)
      .set({ taxStatus: status, updatedAt: new Date() })
      .where(eq(taxes.id, id))
    return true
  } catch (error) {
    console.error("Failed to toggle tax status:", error)
    return false
  }
}

export async function deleteTax(id: number): Promise<boolean> {
  try {
    await db.delete(taxes).where(eq(taxes.id, id))
    return true
  } catch (error) {
    console.error("Failed to delete tax:", error)
    return false
  }
}
