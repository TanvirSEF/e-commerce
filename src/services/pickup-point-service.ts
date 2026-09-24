import { db } from "../db"
import { pickupPoints, type PickupPoint, type NewPickupPoint } from "../db/schema"
import { eq, desc, ilike } from "drizzle-orm"

const SEED_PICKUP_POINTS: PickupPoint[] = [
  {
    id: 1,
    name: "Dhaka Central Hub - Dhanmondi",
    address: "House 42, Road 9/A, Dhanmondi R/A, Dhaka-1209",
    phone: "+880 1711-002233",
    managerName: "Rafiqul Islam",
    pickupStatus: true,
    cashOnPickupStatus: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: 2,
    name: "Gulshan Express Station",
    address: "Plot 15, Block SE(F), Gulshan-1, Dhaka-1212",
    phone: "+880 1819-445566",
    managerName: "Farhana Akter",
    pickupStatus: true,
    cashOnPickupStatus: true,
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-01-05"),
  },
  {
    id: 3,
    name: "Chattogram GEC Circle Station",
    address: "Sanmar Ocean City 4th Floor, GEC Circle, Nasirabad, Chattogram",
    phone: "+880 1912-778899",
    managerName: "Tanvir Ahmed",
    pickupStatus: true,
    cashOnPickupStatus: false,
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-01-10"),
  },
]

export async function getAllPickupPoints(search?: string): Promise<PickupPoint[]> {
  try {
    const list = await db
      .select()
      .from(pickupPoints)
      .where(search ? ilike(pickupPoints.name, `%${search}%`) : undefined)
      .orderBy(desc(pickupPoints.createdAt))

    if (!list || list.length === 0) {
      if (search) {
        return SEED_PICKUP_POINTS.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      }
      return SEED_PICKUP_POINTS
    }
    return list
  } catch (error) {
    console.warn("DB getAllPickupPoints fallback:", error)
    if (search) {
      return SEED_PICKUP_POINTS.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    return SEED_PICKUP_POINTS
  }
}

export async function createPickupPoint(data: {
  name: string
  address: string
  phone: string
  managerName?: string
  cashOnPickupStatus?: boolean
}): Promise<PickupPoint | null> {
  try {
    const [inserted] = await db
      .insert(pickupPoints)
      .values({
        name: data.name,
        address: data.address,
        phone: data.phone,
        managerName: data.managerName || null,
        pickupStatus: true,
        cashOnPickupStatus: data.cashOnPickupStatus ?? true,
      })
      .returning()
    return inserted || null
  } catch (error) {
    console.error("Failed to create pickup point:", error)
    return null
  }
}

export async function togglePickupPointStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db
      .update(pickupPoints)
      .set({ pickupStatus: status, updatedAt: new Date() })
      .where(eq(pickupPoints.id, id))
    return true
  } catch (error) {
    console.error("Failed to toggle pickup point status:", error)
    return false
  }
}

export async function deletePickupPoint(id: number): Promise<boolean> {
  try {
    await db.delete(pickupPoints).where(eq(pickupPoints.id, id))
    return true
  } catch (error) {
    console.error("Failed to delete pickup point:", error)
    return false
  }
}
