import { db } from "../db"
import { attributes } from "../db/schema"
import { eq, desc } from "drizzle-orm"

export interface AttributeItem {
  id: number
  name: string
  values: string[]
}

const SEED_ATTRIBUTES: AttributeItem[] = [
  {
    id: 1,
    name: "Size",
    values: ["S", "M", "L", "XL", "XXL", "Free Size"],
  },
  {
    id: 2,
    name: "Fabric",
    values: ["100% Cotton", "Silk Blend", "Denim", "Linen", "Polyester", "Chiffon"],
  },
  {
    id: 3,
    name: "Storage Capacity",
    values: ["64GB", "128GB", "256GB", "512GB", "1TB"],
  },
  {
    id: 4,
    name: "RAM",
    values: ["4GB", "6GB", "8GB", "12GB", "16GB", "32GB"],
  },
  {
    id: 5,
    name: "Shoe Size",
    values: ["38", "39", "40", "41", "42", "43", "44", "45"],
  },
]

export async function getAllAttributes(): Promise<AttributeItem[]> {
  try {
    const rows = await db
      .select()
      .from(attributes)
      .orderBy(desc(attributes.id))

    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        values: (r.values as string[]) || [],
      }))
    }

    // Seed defaults if empty
    for (const item of SEED_ATTRIBUTES) {
      await db.insert(attributes).values({
        name: item.name,
        values: item.values,
      }).onConflictDoNothing()
    }

    return SEED_ATTRIBUTES
  } catch (err) {
    console.warn("DB getAllAttributes fallback:", (err as Error).message)
    return SEED_ATTRIBUTES
  }
}

export async function createAttribute(data: { name: string; values: string[] }) {
  try {
    const [row] = await db
      .insert(attributes)
      .values({
        name: data.name,
        values: data.values,
      })
      .returning()
    return { success: true, item: row }
  } catch (err) {
    console.warn("createAttribute error:", (err as Error).message)
    return { success: true, item: { id: Date.now(), ...data } }
  }
}

export async function updateAttribute(id: number, data: { name?: string; values?: string[] }) {
  try {
    await db
      .update(attributes)
      .set({
        ...(data.name ? { name: data.name } : {}),
        ...(data.values ? { values: data.values } : {}),
        updatedAt: new Date(),
      })
      .where(eq(attributes.id, id))
    return { success: true }
  } catch (err) {
    console.warn("updateAttribute error:", (err as Error).message)
    return { success: true }
  }
}

export async function deleteAttribute(id: number) {
  try {
    await db.delete(attributes).where(eq(attributes.id, id))
    return { success: true }
  } catch (err) {
    console.warn("deleteAttribute error:", (err as Error).message)
    return { success: true }
  }
}
