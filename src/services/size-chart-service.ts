import { db } from "../db"
import { sizeCharts, type SizeChart, type SizeMeasurementRow } from "../db/schema"
import { eq, desc } from "drizzle-orm"

const SEED_SIZE_CHARTS: SizeChart[] = [
  {
    id: 1,
    name: "Men's T-Shirts & Polos Size Chart",
    categoryId: 2, // Fashion / Apparel
    fitType: "Regular",
    unit: "in",
    measurements: [
      { size: "S", chest: "36-38", waist: "30-32", length: "27", shoulder: "17" },
      { size: "M", chest: "39-41", waist: "33-35", length: "28", shoulder: "18" },
      { size: "L", chest: "42-44", waist: "36-38", length: "29", shoulder: "19" },
      { size: "XL", chest: "45-47", waist: "39-41", length: "30", shoulder: "20" },
      { size: "XXL", chest: "48-50", waist: "42-44", length: "31", shoulder: "21" },
    ],
    status: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: 2,
    name: "Women's Dresses & Kurtis Measurement Guide",
    categoryId: 2,
    fitType: "Slim",
    unit: "in",
    measurements: [
      { size: "S", chest: "34", waist: "28", hip: "36", length: "38" },
      { size: "M", chest: "36", waist: "30", hip: "38", length: "39" },
      { size: "L", chest: "38", waist: "32", hip: "40", length: "40" },
      { size: "XL", chest: "40", waist: "34", hip: "42", length: "41" },
    ],
    status: true,
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-01-10"),
  },
]

export async function getAllSizeCharts(): Promise<SizeChart[]> {
  try {
    const list = await db.select().from(sizeCharts).orderBy(desc(sizeCharts.createdAt))
    if (!list || list.length === 0) return SEED_SIZE_CHARTS
    return list
  } catch (error) {
    console.warn("DB getAllSizeCharts fallback:", error)
    return SEED_SIZE_CHARTS
  }
}

export async function getSizeChartByCategory(categoryId: number): Promise<SizeChart | null> {
  try {
    const [row] = await db
      .select()
      .from(sizeCharts)
      .where(eq(sizeCharts.categoryId, categoryId))
      .limit(1)

    if (row) return row
  } catch (error) {
    console.warn("DB getSizeChartByCategory fallback:", error)
  }
  return SEED_SIZE_CHARTS.find((sc) => sc.categoryId === categoryId) || SEED_SIZE_CHARTS[0]
}

export async function createSizeChart(data: {
  name: string
  categoryId: number
  fitType: string
  unit: string
  measurements: SizeMeasurementRow[]
}): Promise<SizeChart | null> {
  try {
    const [inserted] = await db
      .insert(sizeCharts)
      .values({
        name: data.name,
        categoryId: data.categoryId,
        fitType: data.fitType || "Regular",
        unit: data.unit || "in",
        measurements: data.measurements || [],
        status: true,
      })
      .returning()
    return inserted || null
  } catch (error) {
    console.error("Failed to create size chart:", error)
    return null
  }
}

export async function deleteSizeChart(id: number): Promise<boolean> {
  try {
    await db.delete(sizeCharts).where(eq(sizeCharts.id, id))
    return true
  } catch (error) {
    console.error("Failed to delete size chart:", error)
    return false
  }
}
