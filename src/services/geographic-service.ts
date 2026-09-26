import { db } from "../db"
import {
  countries,
  states,
  zones,
  type Country,
  type State,
  type Zone,
} from "../db/schema"
import { eq, and, like, desc } from "drizzle-orm"

export const SEED_COUNTRIES: Country[] = [
  { id: 1, name: "Bangladesh", code: "BD", phoneCode: "+880", zoneId: 1, status: true, createdAt: new Date() },
  { id: 2, name: "United States", code: "US", phoneCode: "+1", zoneId: 2, status: true, createdAt: new Date() },
  { id: 3, name: "United Kingdom", code: "GB", phoneCode: "+44", zoneId: 2, status: true, createdAt: new Date() },
  { id: 4, name: "Canada", code: "CA", phoneCode: "+1", zoneId: 2, status: true, createdAt: new Date() },
  { id: 5, name: "India", code: "IN", phoneCode: "+91", zoneId: 1, status: true, createdAt: new Date() },
  { id: 6, name: "United Arab Emirates", code: "AE", phoneCode: "+971", zoneId: 3, status: true, createdAt: new Date() },
  { id: 7, name: "Saudi Arabia", code: "SA", phoneCode: "+966", zoneId: 3, status: true, createdAt: new Date() },
  { id: 8, name: "Australia", code: "AU", phoneCode: "+61", zoneId: 2, status: true, createdAt: new Date() },
  { id: 9, name: "Germany", code: "DE", phoneCode: "+49", zoneId: 2, status: true, createdAt: new Date() },
  { id: 10, name: "Singapore", code: "SG", phoneCode: "+65", zoneId: 1, status: true, createdAt: new Date() },
]

export const SEED_STATES: (State & { countryName?: string })[] = [
  { id: 1, countryId: 1, name: "Dhaka", status: true, createdAt: new Date() },
  { id: 2, countryId: 1, name: "Chattogram", status: true, createdAt: new Date() },
  { id: 3, countryId: 1, name: "Rajshahi", status: true, createdAt: new Date() },
  { id: 4, countryId: 1, name: "Khulna", status: true, createdAt: new Date() },
  { id: 5, countryId: 1, name: "Sylhet", status: true, createdAt: new Date() },
  { id: 6, countryId: 2, name: "California", status: true, createdAt: new Date() },
  { id: 7, countryId: 2, name: "New York", status: true, createdAt: new Date() },
  { id: 8, countryId: 2, name: "Texas", status: true, createdAt: new Date() },
  { id: 9, countryId: 3, name: "Greater London", status: true, createdAt: new Date() },
  { id: 10, countryId: 5, name: "West Bengal", status: true, createdAt: new Date() },
]

export const SEED_ZONES: (Zone & { countryCount?: number; countryNames?: string[] })[] = [
  { id: 1, name: "South Asia Zone", status: true, createdAt: new Date(), countryCount: 3, countryNames: ["Bangladesh", "India", "Singapore"] },
  { id: 2, name: "North America & Europe Zone", status: true, createdAt: new Date(), countryCount: 5, countryNames: ["United States", "United Kingdom", "Canada", "Australia", "Germany"] },
  { id: 3, name: "Middle East Express Zone", status: true, createdAt: new Date(), countryCount: 2, countryNames: ["United Arab Emirates", "Saudi Arabia"] },
]

let inMemoryCountries: Country[] = [...SEED_COUNTRIES]
let inMemoryStates: State[] = [...SEED_STATES]
let inMemoryZones: (Zone & { countryCount?: number; countryNames?: string[] })[] = [...SEED_ZONES]

export async function getAllCountries(search?: string): Promise<Country[]> {
  try {
    const rows = await db.select().from(countries).orderBy(desc(countries.status), countries.name)
    if (rows && rows.length > 0) {
      if (search) {
        const q = search.toLowerCase()
        return rows.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
      }
      return rows
    }
  } catch (err) {
    console.warn("getAllCountries DB fallback:", (err as Error).message)
  }

  let list = inMemoryCountries
  if (search) {
    const q = search.toLowerCase()
    list = list.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
  }
  return list
}

export async function toggleCountryStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db.update(countries).set({ status }).where(eq(countries.id, id))
    return true
  } catch (err) {
    console.warn("toggleCountryStatus DB fallback:", (err as Error).message)
  }
  inMemoryCountries = inMemoryCountries.map((c) => (c.id === id ? { ...c, status } : c))
  return true
}

export async function getAllStates(search?: string, countryId?: number): Promise<(State & { countryName?: string })[]> {
  try {
    const rows = await db.select().from(states).orderBy(desc(states.createdAt))
    if (rows && rows.length > 0) {
      let list = rows.map((s) => {
        const c = inMemoryCountries.find((ct) => ct.id === s.countryId)
        return { ...s, countryName: c?.name || "Unknown" }
      })
      if (countryId) list = list.filter((s) => s.countryId === countryId)
      if (search) {
        const q = search.toLowerCase()
        list = list.filter((s) => s.name.toLowerCase().includes(q))
      }
      return list
    }
  } catch (err) {
    console.warn("getAllStates DB fallback:", (err as Error).message)
  }

  let list = inMemoryStates.map((s) => {
    const c = inMemoryCountries.find((ct) => ct.id === s.countryId)
    return { ...s, countryName: c?.name || "Unknown" }
  })
  if (countryId) list = list.filter((s) => s.countryId === countryId)
  if (search) {
    const q = search.toLowerCase()
    list = list.filter((s) => s.name.toLowerCase().includes(q))
  }
  return list
}

export async function createState(data: { name: string; countryId: number }): Promise<State> {
  const newState: State = {
    id: inMemoryStates.length + 1,
    name: data.name,
    countryId: data.countryId,
    status: true,
    createdAt: new Date(),
  }
  try {
    const [inserted] = await db.insert(states).values(newState).returning()
    if (inserted) return inserted
  } catch (err) {
    console.warn("createState DB fallback:", (err as Error).message)
  }
  inMemoryStates.push(newState)
  return newState
}

export async function toggleStateStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db.update(states).set({ status }).where(eq(states.id, id))
    return true
  } catch (err) {
    console.warn("toggleStateStatus DB fallback:", (err as Error).message)
  }
  inMemoryStates = inMemoryStates.map((s) => (s.id === id ? { ...s, status } : s))
  return true
}

export async function getAllZones(): Promise<(Zone & { countryCount?: number; countryNames?: string[] })[]> {
  try {
    const rows = await db.select().from(zones).orderBy(desc(zones.createdAt))
    if (rows && rows.length > 0) {
      return rows.map((z) => {
        const matchingCountries = inMemoryCountries.filter((c) => c.zoneId === z.id)
        return {
          ...z,
          countryCount: matchingCountries.length,
          countryNames: matchingCountries.map((c) => c.name),
        }
      })
    }
  } catch (err) {
    console.warn("getAllZones DB fallback:", (err as Error).message)
  }
  return inMemoryZones
}

export async function getZoneById(id: number) {
  try {
    const [row] = await db.select().from(zones).where(eq(zones.id, id)).limit(1)
    if (row) {
      const assignedCountries = inMemoryCountries.filter((c) => c.zoneId === id).map((c) => c.id)
      return { ...row, countryIds: assignedCountries }
    }
  } catch (err) {
    console.warn("getZoneById DB fallback:", (err as Error).message)
  }
  const z = inMemoryZones.find((x) => x.id === id)
  if (z) {
    const assignedCountries = inMemoryCountries.filter((c) => c.zoneId === id).map((c) => c.id)
    return { ...z, countryIds: assignedCountries }
  }
  return null
}

export async function createZone(data: { name: string; countryIds: number[] }): Promise<Zone> {
  const newZone: Zone = {
    id: inMemoryZones.length + 1,
    name: data.name,
    status: true,
    createdAt: new Date(),
  }
  try {
    const [inserted] = await db.insert(zones).values(newZone).returning()
    if (inserted) {
      // update countries zoneId
      for (const cId of data.countryIds) {
        await db.update(countries).set({ zoneId: inserted.id }).where(eq(countries.id, cId))
      }
      return inserted
    }
  } catch (err) {
    console.warn("createZone DB fallback:", (err as Error).message)
  }

  // in memory
  inMemoryZones.push({
    ...newZone,
    countryCount: data.countryIds.length,
    countryNames: inMemoryCountries.filter((c) => data.countryIds.includes(c.id)).map((c) => c.name),
  })
  inMemoryCountries = inMemoryCountries.map((c) =>
    data.countryIds.includes(c.id) ? { ...c, zoneId: newZone.id } : c
  )
  return newZone
}

export async function toggleZoneStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db.update(zones).set({ status }).where(eq(zones.id, id))
    return true
  } catch (err) {
    console.warn("toggleZoneStatus DB fallback:", (err as Error).message)
  }
  inMemoryZones = inMemoryZones.map((z) => (z.id === id ? { ...z, status } : z))
  return true
}
