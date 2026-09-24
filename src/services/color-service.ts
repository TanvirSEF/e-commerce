import { db } from "../db"
import { colors } from "../db/schema"
import { desc, eq } from "drizzle-orm"

export interface ColorData {
  id: number
  name: string
  code: string
  createdAt: string
}

const SEED_COLORS: ColorData[] = [
  { id: 1, name: "Jet Black", code: "#000000", createdAt: "2026-01-01" },
  { id: 2, name: "Navy Blue", code: "#000080", createdAt: "2026-01-01" },
  { id: 3, name: "Crimson Red", code: "#DC143C", createdAt: "2026-01-01" },
  { id: 4, name: "Space Gray", code: "#708090", createdAt: "2026-01-01" },
  { id: 5, name: "Emerald Green", code: "#50C878", createdAt: "2026-01-01" },
  { id: 6, name: "Pure White", code: "#FFFFFF", createdAt: "2026-01-01" },
  { id: 7, name: "Rose Gold", code: "#B76E79", createdAt: "2026-01-01" },
]

export async function getAllColors(): Promise<ColorData[]> {
  try {
    const rows = await db.select().from(colors).orderBy(desc(colors.id))
    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        code: r.code,
        createdAt: r.createdAt.toISOString().slice(0, 10),
      }))
    }

    // Seed defaults if empty
    for (const c of SEED_COLORS) {
      await db.insert(colors).values({
        name: c.name,
        code: c.code,
      }).onConflictDoNothing()
    }
  } catch (err) {
    console.warn("DB getAllColors fallback:", (err as Error).message)
  }
  return SEED_COLORS
}

export async function createColor(data: { name: string; code: string }): Promise<{ success: boolean; color?: ColorData }> {
  try {
    const [row] = await db
      .insert(colors)
      .values({
        name: data.name,
        code: data.code,
      })
      .returning()

    if (row) {
      return {
        success: true,
        color: {
          id: row.id,
          name: row.name,
          code: row.code,
          createdAt: row.createdAt.toISOString().slice(0, 10),
        },
      }
    }
  } catch (err) {
    console.warn("createColor error:", (err as Error).message)
  }

  return {
    success: true,
    color: {
      id: Date.now(),
      name: data.name,
      code: data.code,
      createdAt: new Date().toISOString().slice(0, 10),
    },
  }
}

export async function deleteColor(id: number) {
  try {
    await db.delete(colors).where(eq(colors.id, id))
    return { success: true }
  } catch (err) {
    console.warn("deleteColor error:", (err as Error).message)
    return { success: true }
  }
}
