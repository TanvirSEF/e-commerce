import { db } from "../db"
import { shippingCities, type ShippingCity, type NewShippingCity } from "../db/schema"
import { eq, desc, ilike } from "drizzle-orm"

const SEED_CITIES: ShippingCity[] = [
  { id: 1, name: "Dhaka North", state: "Dhaka", country: "Bangladesh", zoneId: 1, cost: "60.00", status: true, createdAt: new Date("2026-01-01") },
  { id: 2, name: "Dhaka South", state: "Dhaka", country: "Bangladesh", zoneId: 1, cost: "60.00", status: true, createdAt: new Date("2026-01-01") },
  { id: 3, name: "Gazipur", state: "Dhaka", country: "Bangladesh", zoneId: 2, cost: "80.00", status: true, createdAt: new Date("2026-01-01") },
  { id: 4, name: "Narayanganj", state: "Dhaka", country: "Bangladesh", zoneId: 2, cost: "80.00", status: true, createdAt: new Date("2026-01-01") },
  { id: 5, name: "Chattogram Metro", state: "Chattogram", country: "Bangladesh", zoneId: 3, cost: "120.00", status: true, createdAt: new Date("2026-01-01") },
  { id: 6, name: "Cox's Bazar", state: "Chattogram", country: "Bangladesh", zoneId: 3, cost: "130.00", status: true, createdAt: new Date("2026-01-01") },
  { id: 7, name: "Sylhet Sadar", state: "Sylhet", country: "Bangladesh", zoneId: 3, cost: "120.00", status: true, createdAt: new Date("2026-01-01") },
  { id: 8, name: "Rajshahi City", state: "Rajshahi", country: "Bangladesh", zoneId: 3, cost: "120.00", status: true, createdAt: new Date("2026-01-01") },
  { id: 9, name: "Khulna Metro", state: "Khulna", country: "Bangladesh", zoneId: 3, cost: "120.00", status: true, createdAt: new Date("2026-01-01") },
  { id: 10, name: "Barishal Sadar", state: "Barishal", country: "Bangladesh", zoneId: 3, cost: "120.00", status: true, createdAt: new Date("2026-01-01") },
]

export async function getAllShippingCities(search?: string): Promise<ShippingCity[]> {
  try {
    const list = await db
      .select()
      .from(shippingCities)
      .where(search ? ilike(shippingCities.name, `%${search}%`) : undefined)
      .orderBy(shippingCities.state, shippingCities.name)

    if (!list || list.length === 0) {
      if (search) {
        return SEED_CITIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      }
      return SEED_CITIES
    }
    return list
  } catch (error) {
    console.warn("DB getAllShippingCities fallback:", error)
    if (search) {
      return SEED_CITIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    }
    return SEED_CITIES
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
