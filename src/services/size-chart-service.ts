import { db } from "../db"
import { sizeCharts, measurementPoints, type SizeChart, type SizeMeasurementRow, type MeasurementPoint } from "../db/schema"
import { eq, desc, asc } from "drizzle-orm"

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

const SEED_MEASUREMENT_POINTS: MeasurementPoint[] = [
  { id: 1, name: "Chest", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15") },
  { id: 2, name: "Waist", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15") },
  { id: 3, name: "Hips", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15") },
  { id: 4, name: "Length", createdAt: new Date("2024-01-16"), updatedAt: new Date("2024-01-16") },
  { id: 5, name: "Shoulder", createdAt: new Date("2024-01-16"), updatedAt: new Date("2024-01-16") },
  { id: 6, name: "Inseam", createdAt: new Date("2024-01-18"), updatedAt: new Date("2024-01-18") },
  { id: 7, name: "Sleeve Length", createdAt: new Date("2024-01-20"), updatedAt: new Date("2024-01-20") },
  { id: 8, name: "Collar / Neck", createdAt: new Date("2024-01-22"), updatedAt: new Date("2024-01-22") },
]

export async function getAllMeasurementPoints(): Promise<MeasurementPoint[]> {
  try {
    const list = await db.select().from(measurementPoints).orderBy(desc(measurementPoints.id))
    if (!list || list.length === 0) {
      // Seed default measurement points
      for (const p of SEED_MEASUREMENT_POINTS) {
        await db.insert(measurementPoints).values({ name: p.name }).onConflictDoNothing()
      }
      const seeded = await db.select().from(measurementPoints).orderBy(desc(measurementPoints.id))
      return seeded.length > 0 ? seeded : SEED_MEASUREMENT_POINTS
    }
    return list
  } catch (error) {
    console.warn("DB getAllMeasurementPoints fallback:", error)
    return SEED_MEASUREMENT_POINTS
  }
}

export async function createMeasurementPoint(name: string): Promise<MeasurementPoint | null> {
  try {
    const [inserted] = await db
      .insert(measurementPoints)
      .values({ name })
      .returning()
    return inserted || null
  } catch (error) {
    console.error("Failed to create measurement point:", error)
    return {
      id: Date.now(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}

export async function updateMeasurementPoint(id: number, name: string): Promise<boolean> {
  try {
    await db
      .update(measurementPoints)
      .set({ name, updatedAt: new Date() })
      .where(eq(measurementPoints.id, id))
    return true
  } catch (error) {
    console.error("Failed to update measurement point:", error)
    return false
  }
}

export async function deleteMeasurementPoint(id: number): Promise<boolean> {
  try {
    await db.delete(measurementPoints).where(eq(measurementPoints.id, id))
    return true
  } catch (error) {
    console.error("Failed to delete measurement point:", error)
    return false
  }
}
