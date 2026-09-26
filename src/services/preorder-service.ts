import { db } from "../db"
import {
  preorderProducts,
  preorderOrders,
  type PreorderProduct,
  type PreorderOrder,
} from "../db/schema"
import { eq, desc } from "drizzle-orm"
import { getSetting, updateSetting } from "./settings-service"

export interface PreorderSettings {
  defaultPrepaymentPercent: number
  minimumLeadDays: number
  allowCancellationDays: number
  notifySellerOnBooking: boolean
  autoReminderDaysBeforeRelease: number
}

export const DEFAULT_PREORDER_SETTINGS: PreorderSettings = {
  defaultPrepaymentPercent: 20,
  minimumLeadDays: 14,
  allowCancellationDays: 7,
  notifySellerOnBooking: true,
  autoReminderDaysBeforeRelease: 3,
}

export const SEED_PREORDER_PRODUCTS: PreorderProduct[] = [
  {
    id: 1,
    name: "PlayStation 5 Pro 2TB Edition",
    slug: "playstation-5-pro-2tb-edition",
    sku: "PS5-PRO-2TB",
    thumbnail: "/assets/img/placeholder.jpg",
    price: "799.00",
    prepaymentAmount: "159.80",
    releaseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    preorderBatchLimit: 150,
    currentPreorders: 84,
    sellerSlug: "inhouse",
    status: true,
    featured: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Apple Vision Pro (2nd Generation)",
    slug: "apple-vision-pro-2nd-gen",
    sku: "AVP-2026-M4",
    thumbnail: "/assets/img/placeholder-rect.jpg",
    price: "3499.00",
    prepaymentAmount: "700.00",
    releaseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    preorderBatchLimit: 50,
    currentPreorders: 39,
    sellerSlug: "gadget-hub",
    status: true,
    featured: true,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Sony Alpha A9 III Global Shutter Camera",
    slug: "sony-alpha-a9-iii-camera",
    sku: "SONY-A9M3-BODY",
    thumbnail: "/assets/img/placeholder.jpg",
    price: "5999.00",
    prepaymentAmount: "1200.00",
    releaseDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    preorderBatchLimit: 30,
    currentPreorders: 18,
    sellerSlug: "inhouse",
    status: true,
    featured: false,
    createdAt: new Date(),
  },
]

export const SEED_PREORDER_ORDERS: PreorderOrder[] = [
  {
    id: 1,
    orderCode: "PO-2026-8812",
    customerName: "Tanvir Hasan",
    customerEmail: "tanvir@example.com",
    productId: 1,
    productName: "PlayStation 5 Pro 2TB Edition",
    quantity: 1,
    totalPrice: "799.00",
    prepaymentPaid: "159.80",
    remainingDue: "639.20",
    preorderStatus: "deposit_paid",
    createdAt: new Date(),
  },
  {
    id: 2,
    orderCode: "PO-2026-8813",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@example.com",
    productId: 2,
    productName: "Apple Vision Pro (2nd Generation)",
    quantity: 1,
    totalPrice: "3499.00",
    prepaymentPaid: "700.00",
    remainingDue: "2799.00",
    preorderStatus: "final_payment_pending",
    createdAt: new Date(),
  },
]

let inMemoryProducts: PreorderProduct[] = [...SEED_PREORDER_PRODUCTS]
let inMemoryOrders: PreorderOrder[] = [...SEED_PREORDER_ORDERS]

export async function getAllPreorderProducts(): Promise<PreorderProduct[]> {
  try {
    const rows = await db.select().from(preorderProducts).orderBy(desc(preorderProducts.createdAt))
    if (rows && rows.length > 0) return rows
  } catch (err) {
    console.warn("getAllPreorderProducts fallback:", (err as Error).message)
  }
  return inMemoryProducts
}

export async function getPreorderProductBySlug(slug: string): Promise<PreorderProduct | null> {
  try {
    const [row] = await db.select().from(preorderProducts).where(eq(preorderProducts.slug, slug)).limit(1)
    if (row) return row
  } catch (err) {
    console.warn("getPreorderProductBySlug fallback:", (err as Error).message)
  }
  return inMemoryProducts.find((p) => p.slug === slug) || null
}

export async function createPreorderProduct(data: {
  name: string
  price: string
  prepaymentAmount: string
  releaseDate: Date
  preorderBatchLimit: number
  sku?: string
  sellerSlug?: string
}): Promise<PreorderProduct> {
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
  const newProduct: PreorderProduct = {
    id: inMemoryProducts.length + 1,
    name: data.name,
    slug,
    sku: data.sku || `PO-${Date.now().toString().slice(-6)}`,
    thumbnail: "/assets/img/placeholder.jpg",
    price: data.price,
    prepaymentAmount: data.prepaymentAmount,
    releaseDate: data.releaseDate,
    preorderBatchLimit: data.preorderBatchLimit,
    currentPreorders: 0,
    sellerSlug: data.sellerSlug || "inhouse",
    status: true,
    featured: false,
    createdAt: new Date(),
  }

  try {
    const [inserted] = await db.insert(preorderProducts).values(newProduct).returning()
    if (inserted) return inserted
  } catch (err) {
    console.warn("createPreorderProduct fallback:", (err as Error).message)
  }
  inMemoryProducts.unshift(newProduct)
  return newProduct
}

export async function togglePreorderPublished(id: number, status: boolean): Promise<boolean> {
  try {
    await db.update(preorderProducts).set({ status }).where(eq(preorderProducts.id, id))
    return true
  } catch (err) {
    console.warn("togglePreorderPublished fallback:", (err as Error).message)
  }
  inMemoryProducts = inMemoryProducts.map((p) => (p.id === id ? { ...p, status } : p))
  return true
}

export async function togglePreorderFeatured(id: number, featured: boolean): Promise<boolean> {
  try {
    await db.update(preorderProducts).set({ featured }).where(eq(preorderProducts.id, id))
    return true
  } catch (err) {
    console.warn("togglePreorderFeatured fallback:", (err as Error).message)
  }
  inMemoryProducts = inMemoryProducts.map((p) => (p.id === id ? { ...p, featured } : p))
  return true
}

export async function getAllPreorderOrders(tab?: string): Promise<PreorderOrder[]> {
  try {
    const rows = await db.select().from(preorderOrders).orderBy(desc(preorderOrders.createdAt))
    if (rows && rows.length > 0) {
      if (tab && tab !== "all") {
        return rows.filter((o) => o.preorderStatus === tab)
      }
      return rows
    }
  } catch (err) {
    console.warn("getAllPreorderOrders fallback:", (err as Error).message)
  }

  let list = inMemoryOrders
  if (tab && tab !== "all") {
    list = list.filter((o) => o.preorderStatus === tab)
  }
  return list
}

export async function createPreorderOrder(data: {
  productId: number
  productName: string
  customerName: string
  customerEmail: string
  quantity: number
  totalPrice: string
  prepaymentPaid: string
  remainingDue: string
}) {
  const code = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  const order: PreorderOrder = {
    id: inMemoryOrders.length + 1,
    orderCode: code,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    productId: data.productId,
    productName: data.productName,
    quantity: data.quantity,
    totalPrice: data.totalPrice,
    prepaymentPaid: data.prepaymentPaid,
    remainingDue: data.remainingDue,
    preorderStatus: "deposit_paid",
    createdAt: new Date(),
  }

  try {
    await db.insert(preorderOrders).values(order)
  } catch (err) {
    console.warn("createPreorderOrder fallback:", (err as Error).message)
  }

  inMemoryOrders.unshift(order)
  inMemoryProducts = inMemoryProducts.map((p) =>
    p.id === data.productId ? { ...p, currentPreorders: p.currentPreorders + data.quantity } : p
  )
  return { success: true, orderCode: code }
}

export async function updatePreorderOrderStatus(id: number, status: string): Promise<boolean> {
  try {
    await db.update(preorderOrders).set({ preorderStatus: status }).where(eq(preorderOrders.id, id))
    return true
  } catch (err) {
    console.warn("updatePreorderOrderStatus fallback:", (err as Error).message)
  }
  inMemoryOrders = inMemoryOrders.map((o) => (o.id === id ? { ...o, preorderStatus: status } : o))
  return true
}

export async function getPreorderSettings(): Promise<PreorderSettings> {
  try {
    const raw = await getSetting("preorder_settings")
    if (raw) return { ...DEFAULT_PREORDER_SETTINGS, ...JSON.parse(raw) }
  } catch (err) {
    console.warn("getPreorderSettings fallback:", (err as Error).message)
  }
  return DEFAULT_PREORDER_SETTINGS
}

export async function updatePreorderSettings(data: Partial<PreorderSettings>) {
  const current = await getPreorderSettings()
  const updated = { ...current, ...data }
  await updateSetting("preorder_settings", JSON.stringify(updated))
  return { success: true, updated }
}
