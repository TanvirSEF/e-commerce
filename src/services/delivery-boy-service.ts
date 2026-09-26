import { db } from "@/db"
import {
  deliveryBoys,
  deliveryCollections,
  deliveryPayouts,
  deliveryCancelRequests,
  type DeliveryBoy,
  type DeliveryCollection,
  type DeliveryPayout,
  type DeliveryCancelRequest,
} from "@/db/schema/delivery-boy"
import { desc, eq } from "drizzle-orm"

export const SEED_DELIVERY_BOYS: DeliveryBoy[] = [
  {
    id: 1,
    name: "Tariqul Islam",
    email: "tariq.courier@example.com",
    phone: "+880 1711-892341",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    zoneId: 1,
    zoneName: "Dhaka Metro North",
    status: true,
    totalEarnings: "640.00",
    totalCollection: "3480.00",
    currentPendingDeliveries: 4,
    createdAt: new Date("2026-08-01T10:00:00Z"),
  },
  {
    id: 2,
    name: "Mohammad Fahim",
    email: "fahim.speed@example.com",
    phone: "+880 1822-771239",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    zoneId: 2,
    zoneName: "Dhaka Metro South",
    status: true,
    totalEarnings: "890.50",
    totalCollection: "5120.00",
    currentPendingDeliveries: 7,
    createdAt: new Date("2026-08-15T09:30:00Z"),
  },
  {
    id: 3,
    name: "Tanvir Rahman",
    email: "tanvir.delivery@example.com",
    phone: "+880 1933-445566",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    zoneId: 3,
    zoneName: "Chittagong Central",
    status: false,
    totalEarnings: "120.00",
    totalCollection: "680.00",
    currentPendingDeliveries: 0,
    createdAt: new Date("2026-09-01T14:15:00Z"),
  },
]

export const SEED_DELIVERY_COLLECTIONS: DeliveryCollection[] = [
  {
    id: 1,
    deliveryBoyId: 1,
    deliveryBoyName: "Tariqul Islam",
    orderCode: "ORD-202609-1002",
    amount: "145.00",
    collectionDate: new Date("2026-09-24T15:30:00Z"),
  },
  {
    id: 2,
    deliveryBoyId: 2,
    deliveryBoyName: "Mohammad Fahim",
    orderCode: "ORD-202609-1005",
    amount: "320.00",
    collectionDate: new Date("2026-09-25T11:20:00Z"),
  },
  {
    id: 3,
    deliveryBoyId: 1,
    deliveryBoyName: "Tariqul Islam",
    orderCode: "ORD-202609-1008",
    amount: "89.00",
    collectionDate: new Date("2026-09-25T16:45:00Z"),
  },
]

export const SEED_DELIVERY_PAYOUTS: DeliveryPayout[] = [
  {
    id: 1,
    deliveryBoyId: 1,
    deliveryBoyName: "Tariqul Islam",
    amount: "400.00",
    paymentMethod: "bKash Agent",
    paymentDate: new Date("2026-09-20T12:00:00Z"),
  },
  {
    id: 2,
    deliveryBoyId: 2,
    deliveryBoyName: "Mohammad Fahim",
    amount: "600.00",
    paymentMethod: "Bank Transfer",
    paymentDate: new Date("2026-09-21T14:30:00Z"),
  },
]

export const SEED_DELIVERY_CANCELS: DeliveryCancelRequest[] = [
  {
    id: 1,
    deliveryBoyId: 1,
    deliveryBoyName: "Tariqul Islam",
    orderCode: "ORD-202609-0994",
    reason: "Recipient phone switched off for 3 consecutive delivery attempts at specified address.",
    status: "pending",
    createdAt: new Date("2026-09-23T18:00:00Z"),
  },
  {
    id: 2,
    deliveryBoyId: 2,
    deliveryBoyName: "Mohammad Fahim",
    orderCode: "ORD-202609-0988",
    reason: "Customer moved to another city before delivery window.",
    status: "approved",
    createdAt: new Date("2026-09-22T10:30:00Z"),
  },
]

export const SEED_DELIVERY_CONFIG = {
  commission_type: "fixed", // "fixed" or "percentage"
  commission_value: "3.50",
  cash_collection_limit: "5000.00",
  cancel_request_verification: true,
}

export async function getAllDeliveryBoys(): Promise<DeliveryBoy[]> {
  try {
    return await db.select().from(deliveryBoys).orderBy(desc(deliveryBoys.createdAt))
  } catch (err) {
    console.warn("getAllDeliveryBoys fallback:", err instanceof Error ? err.message : String(err))
    return SEED_DELIVERY_BOYS
  }
}

export async function getDeliveryBoyById(id: number): Promise<DeliveryBoy | null> {
  try {
    const res = await db.select().from(deliveryBoys).where(eq(deliveryBoys.id, id))
    return res[0] || SEED_DELIVERY_BOYS.find((b) => b.id === id) || null
  } catch (err) {
    console.warn("getDeliveryBoyById fallback:", err instanceof Error ? err.message : String(err))
    return SEED_DELIVERY_BOYS.find((b) => b.id === id) || null
  }
}

export async function createDeliveryBoy(data: {
  name: string
  email: string
  phone: string
  zoneId?: number
  zoneName?: string
}): Promise<DeliveryBoy> {
  const newBoy: DeliveryBoy = {
    id: Date.now(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    zoneId: data.zoneId || 1,
    zoneName: data.zoneName || "Dhaka Metro North",
    status: true,
    totalEarnings: "0.00",
    totalCollection: "0.00",
    currentPendingDeliveries: 0,
    createdAt: new Date(),
  }

  try {
    await db.insert(deliveryBoys).values(newBoy)
  } catch (err) {
    console.warn("createDeliveryBoy fallback:", err instanceof Error ? err.message : String(err))
    SEED_DELIVERY_BOYS.unshift(newBoy)
  }
  return newBoy
}

export async function toggleDeliveryBoyBan(id: number): Promise<{ success: boolean }> {
  try {
    const boy = await getDeliveryBoyById(id)
    if (boy) {
      await db.update(deliveryBoys).set({ status: !boy.status }).where(eq(deliveryBoys.id, id))
    }
  } catch (err) {
    console.warn("toggleDeliveryBoyBan fallback:", err instanceof Error ? err.message : String(err))
    const item = SEED_DELIVERY_BOYS.find((b) => b.id === id)
    if (item) item.status = !item.status
  }
  return { success: true }
}

export async function getAllDeliveryCollections(): Promise<DeliveryCollection[]> {
  try {
    return await db.select().from(deliveryCollections).orderBy(desc(deliveryCollections.collectionDate))
  } catch (err) {
    console.warn("getAllDeliveryCollections fallback:", err instanceof Error ? err.message : String(err))
    return SEED_DELIVERY_COLLECTIONS
  }
}

export async function getAllDeliveryPayouts(): Promise<DeliveryPayout[]> {
  try {
    return await db.select().from(deliveryPayouts).orderBy(desc(deliveryPayouts.paymentDate))
  } catch (err) {
    console.warn("getAllDeliveryPayouts fallback:", err instanceof Error ? err.message : String(err))
    return SEED_DELIVERY_PAYOUTS
  }
}

export async function getAllDeliveryCancelRequests(): Promise<DeliveryCancelRequest[]> {
  try {
    return await db.select().from(deliveryCancelRequests).orderBy(desc(deliveryCancelRequests.createdAt))
  } catch (err) {
    console.warn("getAllDeliveryCancelRequests fallback:", err instanceof Error ? err.message : String(err))
    return SEED_DELIVERY_CANCELS
  }
}

export async function getDeliveryBoyConfig() {
  return SEED_DELIVERY_CONFIG
}

export async function updateDeliveryBoyConfig(data: Partial<typeof SEED_DELIVERY_CONFIG>) {
  Object.assign(SEED_DELIVERY_CONFIG, data)
  return { success: true }
}
