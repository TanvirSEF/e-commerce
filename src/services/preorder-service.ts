import { db } from "../db"
import {
  preorderProducts,
  preorderOrders,
  type PreorderProduct,
  type PreorderOrder,
} from "../db/schema"
import { eq, desc, asc, ilike, or, and, sql, count, inArray } from "drizzle-orm"
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
    releaseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    preorderBatchLimit: 150,
    currentPreorders: 84,
    sellerSlug: "inhouse",
    status: true,
    featured: true,
    categoryName: "Gaming Consoles",
    unit: "Pc",
    minQty: 1,
    isRefundable: true,
    discount: "0.00",
    discountType: "percent",
    isAvailable: false,
    availableDate: "25-10-2026",
    finalOrders: 12,
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
    releaseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    preorderBatchLimit: 50,
    currentPreorders: 39,
    sellerSlug: "gadget-hub",
    status: true,
    featured: true,
    categoryName: "Virtual Reality & AI",
    unit: "Pc",
    minQty: 1,
    isRefundable: true,
    discount: "5.00",
    discountType: "percent",
    isAvailable: false,
    availableDate: "09-11-2026",
    finalOrders: 5,
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
    releaseDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    preorderBatchLimit: 30,
    currentPreorders: 18,
    sellerSlug: "inhouse",
    status: true,
    featured: false,
    categoryName: "Cameras & Optics",
    unit: "Pc",
    minQty: 1,
    isRefundable: true,
    discount: "200.00",
    discountType: "flat",
    isAvailable: true,
    availableDate: "15-10-2026",
    finalOrders: 8,
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
]

export interface PreorderProductListResult {
  products: PreorderProduct[]
  total: number
  page: number
  limit: number
  totalPages: number
  counts: {
    all: number
    inHouse: number
    seller: number
    published: number
    unpublished: number
    discounted: number
  }
}

export async function getAllPreorderProducts(): Promise<PreorderProduct[]> {
  try {
    return await db.select().from(preorderProducts).orderBy(desc(preorderProducts.createdAt))
  } catch (err) {
    console.error("getAllPreorderProducts error:", err)
    return []
  }
}

export async function getPreorderProductsAdmin(params?: {
  userType?: string
  statusFilter?: string
  sort?: string
  search?: string
  page?: number
  limit?: number
}): Promise<PreorderProductListResult> {
  const page = Math.max(1, params?.page || 1)
  const limit = Math.max(1, Math.min(100, params?.limit || 15))
  const offset = (page - 1) * limit
  const userType = params?.userType || "all"
  const statusFilter = params?.statusFilter || "all"
  const sort = params?.sort || ""
  const search = params?.search?.trim() || ""

  try {
    const conditions = []

    // 1. User type filter
    if (userType === "in_house") {
      conditions.push(eq(preorderProducts.sellerSlug, "inhouse"))
    } else if (userType === "seller") {
      conditions.push(sql`${preorderProducts.sellerSlug} != 'inhouse'`)
    }

    // 2. Status filter
    if (statusFilter === "published") {
      conditions.push(eq(preorderProducts.status, true))
    } else if (statusFilter === "unpublished") {
      conditions.push(eq(preorderProducts.status, false))
    } else if (statusFilter === "discounted") {
      conditions.push(sql`${preorderProducts.discount}::numeric > 0`)
    }

    // 3. Search query
    if (search) {
      conditions.push(
        or(
          ilike(preorderProducts.name, `%${search}%`),
          ilike(preorderProducts.sku, `%${search}%`),
          ilike(preorderProducts.categoryName, `%${search}%`)
        )
      )
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Sorting order
    let orderByClause = desc(preorderProducts.createdAt)
    if (sort === "unit_price,desc") {
      orderByClause = desc(sql`${preorderProducts.price}::numeric`)
    } else if (sort === "unit_price,asc") {
      orderByClause = asc(sql`${preorderProducts.price}::numeric`)
    }

    // Fetch items
    const rows = await db
      .select()
      .from(preorderProducts)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset)

    // Total filtered count
    const [countRow] = await db
      .select({ count: count() })
      .from(preorderProducts)
      .where(whereClause)

    const total = Number(countRow?.count || 0)
    const totalPages = Math.ceil(total / limit) || 1

    // Global counts for filter badges (Active eCommerce 1:1)
    const [countsRow] = await db
      .select({
        all: count(),
        inHouse: sql<number>`count(case when ${preorderProducts.sellerSlug} = 'inhouse' then 1 end)`,
        seller: sql<number>`count(case when ${preorderProducts.sellerSlug} != 'inhouse' then 1 end)`,
        published: sql<number>`count(case when ${preorderProducts.status} = true then 1 end)`,
        unpublished: sql<number>`count(case when ${preorderProducts.status} = false then 1 end)`,
        discounted: sql<number>`count(case when ${preorderProducts.discount}::numeric > 0 then 1 end)`,
      })
      .from(preorderProducts)

    return {
      products: rows,
      total,
      page,
      limit,
      totalPages,
      counts: {
        all: Number(countsRow?.all || 0),
        inHouse: Number(countsRow?.inHouse || 0),
        seller: Number(countsRow?.seller || 0),
        published: Number(countsRow?.published || 0),
        unpublished: Number(countsRow?.unpublished || 0),
        discounted: Number(countsRow?.discounted || 0),
      },
    }
  } catch (err) {
    console.error("getPreorderProductsAdmin error:", err)
    return {
      products: [],
      total: 0,
      page: 1,
      limit,
      totalPages: 1,
      counts: { all: 0, inHouse: 0, seller: 0, published: 0, unpublished: 0, discounted: 0 },
    }
  }
}

export async function getPreorderProductBySlug(slug: string): Promise<PreorderProduct | null> {
  try {
    const [row] = await db.select().from(preorderProducts).where(eq(preorderProducts.slug, slug)).limit(1)
    return row || null
  } catch (err) {
    console.error("getPreorderProductBySlug error:", err)
    return null
  }
}

export async function getPreorderProductById(id: number): Promise<PreorderProduct | null> {
  try {
    const [row] = await db.select().from(preorderProducts).where(eq(preorderProducts.id, id)).limit(1)
    return row || null
  } catch (err) {
    console.error("getPreorderProductById error:", err)
    return null
  }
}

export async function createPreorderProduct(data: {
  name: string
  price: string
  prepaymentAmount: string
  releaseDate: Date
  preorderBatchLimit: number
  sku?: string
  sellerSlug?: string
  categoryName?: string
  unit?: string
  minQty?: number
  isRefundable?: boolean
  discount?: string
  discountType?: string
  isAvailable?: boolean
  availableDate?: string
}): Promise<PreorderProduct | null> {
  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    const [inserted] = await db
      .insert(preorderProducts)
      .values({
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
        categoryName: data.categoryName || "Consumer Electronics",
        unit: data.unit || "Pc",
        minQty: data.minQty || 1,
        isRefundable: data.isRefundable ?? true,
        discount: data.discount || "0.00",
        discountType: data.discountType || "percent",
        isAvailable: data.isAvailable ?? false,
        availableDate: data.availableDate || null,
        finalOrders: 0,
      })
      .returning()
    return inserted || null
  } catch (err) {
    console.error("createPreorderProduct error:", err)
    return null
  }
}

export async function togglePreorderPublished(id: number, status: boolean): Promise<boolean> {
  try {
    await db.update(preorderProducts).set({ status }).where(eq(preorderProducts.id, id))
    return true
  } catch (err) {
    console.error("togglePreorderPublished error:", err)
    return false
  }
}

export async function togglePreorderFeatured(id: number, featured: boolean): Promise<boolean> {
  try {
    await db.update(preorderProducts).set({ featured }).where(eq(preorderProducts.id, id))
    return true
  } catch (err) {
    console.error("togglePreorderFeatured error:", err)
    return false
  }
}

export async function deletePreorderProduct(id: number): Promise<boolean> {
  try {
    await db.delete(preorderProducts).where(eq(preorderProducts.id, id))
    return true
  } catch (err) {
    console.error("deletePreorderProduct error:", err)
    return false
  }
}

export async function bulkDeletePreorderProducts(ids: number[]): Promise<boolean> {
  if (!ids || ids.length === 0) return true
  try {
    await db.delete(preorderProducts).where(inArray(preorderProducts.id, ids))
    return true
  } catch (err) {
    console.error("bulkDeletePreorderProducts error:", err)
    return false
  }
}

export async function getAllPreorderOrders(tab?: string): Promise<PreorderOrder[]> {
  try {
    const rows = await db.select().from(preorderOrders).orderBy(desc(preorderOrders.createdAt))
    if (tab && tab !== "all") {
      return rows.filter((o) => o.preorderStatus === tab)
    }
    return rows
  } catch (err) {
    console.error("getAllPreorderOrders error:", err)
    return []
  }
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
  try {
    const code = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    const [inserted] = await db
      .insert(preorderOrders)
      .values({
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
      })
      .returning()

    if (inserted) {
      await db
        .update(preorderProducts)
        .set({
          currentPreorders: sql`${preorderProducts.currentPreorders} + ${data.quantity}`,
        })
        .where(eq(preorderProducts.id, data.productId))
    }

    return { success: true, orderCode: code }
  } catch (err) {
    console.error("createPreorderOrder error:", err)
    return { success: false, error: (err as Error).message }
  }
}

export async function updatePreorderOrderStatus(id: number, status: string): Promise<boolean> {
  try {
    await db.update(preorderOrders).set({ preorderStatus: status }).where(eq(preorderOrders.id, id))
    return true
  } catch (err) {
    console.error("updatePreorderOrderStatus error:", err)
    return false
  }
}

export async function getPreorderSettings(): Promise<PreorderSettings> {
  try {
    const raw = await getSetting("preorder_settings")
    if (raw) return { ...DEFAULT_PREORDER_SETTINGS, ...JSON.parse(raw) }
  } catch (err) {
    console.error("getPreorderSettings error:", err)
  }
  return DEFAULT_PREORDER_SETTINGS
}

export async function updatePreorderSettings(data: Partial<PreorderSettings>) {
  try {
    const current = await getPreorderSettings()
    const updated = { ...current, ...data }
    await updateSetting("preorder_settings", JSON.stringify(updated))
    return { success: true, updated }
  } catch (err) {
    console.error("updatePreorderSettings error:", err)
    return { success: false, error: (err as Error).message }
  }
}
