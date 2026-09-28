import { db } from "../db"
import {
  shippingCities,
  type ShippingCity,
  type NewShippingCity,
  carriers,
  type Carrier,
  type NewCarrier,
} from "../db/schema"
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

const SEED_CARRIERS: Carrier[] = [
  {
    id: 1,
    name: "DHL Express",
    transitTime: "1-3 Business Days",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200",
    status: true,
    freeShipping: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: 2,
    name: "FedEx International",
    transitTime: "2-4 Business Days",
    logo: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=200",
    status: true,
    freeShipping: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: 3,
    name: "UPS Standard",
    transitTime: "3-5 Business Days",
    logo: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200",
    status: true,
    freeShipping: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: 4,
    name: "RedX Logistics",
    transitTime: "24-48 Hours",
    logo: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200",
    status: true,
    freeShipping: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
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

export async function getAllCarriers(search?: string): Promise<Carrier[]> {
  try {
    const query = db.select().from(carriers)
    const list = search
      ? await query.where(ilike(carriers.name, `%${search}%`)).orderBy(desc(carriers.id))
      : await query.orderBy(desc(carriers.id))

    if (!list || list.length === 0) {
      if (search) {
        return SEED_CARRIERS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      }
      return SEED_CARRIERS
    }
    return list
  } catch (error) {
    console.warn("DB getAllCarriers fallback:", error)
    if (search) {
      return SEED_CARRIERS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    }
    return SEED_CARRIERS
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

