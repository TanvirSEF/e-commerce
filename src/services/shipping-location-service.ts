import { db } from "../db"
import {
  shippingCities,
  type ShippingCity,
  type NewShippingCity,
  shippingAreas,
  type ShippingArea,
  type NewShippingArea,
  carriers,
  type Carrier,
  type NewCarrier,
} from "../db/schema"
import { eq, desc, ilike, and, sql } from "drizzle-orm"

// ----------------------------------------------------------------------------
// Shipping Cities (Pure DB - Laravel: CityController)
// ----------------------------------------------------------------------------

export async function getAllShippingCities(search?: string): Promise<ShippingCity[]> {
  try {
    const list = await db
      .select()
      .from(shippingCities)
      .where(search ? ilike(shippingCities.name, `%${search}%`) : undefined)
      .orderBy(shippingCities.state, shippingCities.name)

    return list || []
  } catch (error) {
    console.warn("DB getAllShippingCities error:", error)
    return []
  }
}

export async function toggleCityDeliveryStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db
      .update(shippingCities)
      .set({ status })
      .where(eq(shippingCities.id, id))
    return true
  } catch (error) {
    console.error("Failed to toggle city status:", error)
    return false
  }
}

export async function createShippingCity(data: {
  name: string
  state: string
  cost: string
  zoneId?: number
}): Promise<ShippingCity | null> {
  try {
    const [inserted] = await db
      .insert(shippingCities)
      .values({
        name: data.name,
        state: data.state,
        country: "Bangladesh",
        cost: data.cost,
        zoneId: data.zoneId || 1,
        status: true,
      })
      .returning()
    return inserted || null
  } catch (error) {
    console.error("Failed to create shipping city:", error)
    return null
  }
}

// ----------------------------------------------------------------------------
// Shipping Carriers (Pure DB - Laravel: CarrierController)
// ----------------------------------------------------------------------------

export async function getAllCarriers(search?: string): Promise<Carrier[]> {
  try {
    const query = db.select().from(carriers)
    const list = search
      ? await query.where(ilike(carriers.name, `%${search}%`)).orderBy(desc(carriers.id))
      : await query.orderBy(desc(carriers.id))

    return list || []
  } catch (error) {
    console.warn("DB getAllCarriers error:", error)
    return []
  }
}

export async function createCarrier(data: {
  name: string
  transitTime: string
  logo?: string
  freeShipping?: boolean
  status?: boolean
}): Promise<Carrier | null> {
  try {
    const [inserted] = await db
      .insert(carriers)
      .values({
        name: data.name,
        transitTime: data.transitTime,
        logo: data.logo || null,
        freeShipping: data.freeShipping ?? false,
        status: data.status ?? true,
      })
      .returning()
    return inserted || null
  } catch (error) {
    console.error("Failed to create carrier:", error)
    return null
  }
}

export async function updateCarrier(
  id: number,
  data: Partial<Omit<Carrier, "id" | "createdAt" | "updatedAt">>
): Promise<boolean> {
  try {
    await db
      .update(carriers)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(carriers.id, id))
    return true
  } catch (error) {
    console.error("Failed to update carrier:", error)
    return false
  }
}

export async function toggleCarrierStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db
      .update(carriers)
      .set({ status, updatedAt: new Date() })
      .where(eq(carriers.id, id))
    return true
  } catch (error) {
    console.error("Failed to toggle carrier status:", error)
    return false
  }
}

export async function deleteCarrier(id: number): Promise<boolean> {
  try {
    await db.delete(carriers).where(eq(carriers.id, id))
    return true
  } catch (error) {
    console.error("Failed to delete carrier:", error)
    return false
  }
}

// ----------------------------------------------------------------------------
// Shipping Areas (Pure DB - Laravel: AreaController)
// ----------------------------------------------------------------------------

let areasTableInitialized = false

async function ensureShippingAreasTable() {
  if (areasTableInitialized) return
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "shipping_areas" (
        "id" serial PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "city" varchar(255) NOT NULL,
        "state" varchar(255) NOT NULL DEFAULT 'Dhaka Division',
        "country" varchar(100) NOT NULL DEFAULT 'Bangladesh',
        "city_id" integer,
        "status" boolean NOT NULL DEFAULT true,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      );
    `)
    areasTableInitialized = true
  } catch (err) {
    console.warn("ensureShippingAreasTable error:", err)
  }
}

export async function getAllAreas(search?: string, city?: string): Promise<ShippingArea[]> {
  await ensureShippingAreasTable()
  try {
    const conditions = []
    if (search) {
      conditions.push(ilike(shippingAreas.name, `%${search}%`))
    }
    if (city && city !== "all") {
      conditions.push(eq(shippingAreas.city, city))
    }

    if (conditions.length > 0) {
      return await db
        .select()
        .from(shippingAreas)
        .where(and(...conditions))
        .orderBy(desc(shippingAreas.id))
    }
    return await db.select().from(shippingAreas).orderBy(desc(shippingAreas.id))
  } catch (error) {
    console.warn("DB getAllAreas error:", error)
    return []
  }
}

export async function createArea(data: {
  name: string
  city: string
  state?: string
  country?: string
  status?: boolean
}): Promise<ShippingArea | null> {
  await ensureShippingAreasTable()
  try {
    const [inserted] = await db
      .insert(shippingAreas)
      .values({
        name: data.name,
        city: data.city,
        state: data.state || "Dhaka Division",
        country: data.country || "Bangladesh",
        status: data.status ?? true,
      })
      .returning()
    return inserted || null
  } catch (error) {
    console.error("Failed to create area:", error)
    return null
  }
}

export async function updateArea(
  id: number,
  data: Partial<Omit<ShippingArea, "id" | "createdAt" | "updatedAt">>
): Promise<boolean> {
  await ensureShippingAreasTable()
  try {
    await db
      .update(shippingAreas)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(shippingAreas.id, id))
    return true
  } catch (error) {
    console.error("Failed to update area:", error)
    return false
  }
}

export async function toggleAreaStatus(id: number, status: boolean): Promise<boolean> {
  await ensureShippingAreasTable()
  try {
    await db
      .update(shippingAreas)
      .set({ status, updatedAt: new Date() })
      .where(eq(shippingAreas.id, id))
    return true
  } catch (error) {
    console.error("Failed to toggle area status:", error)
    return false
  }
}

export async function deleteArea(id: number): Promise<boolean> {
  await ensureShippingAreasTable()
  try {
    await db.delete(shippingAreas).where(eq(shippingAreas.id, id))
    return true
  } catch (error) {
    console.error("Failed to delete area:", error)
    return false
  }
}
