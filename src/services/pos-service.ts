import { db } from "../db"
import {
  posSales,
  type PosSale,
  type PosLineItem,
  businessSettings,
  products,
  categories,
  users,
  customerAddresses,
  orders,
  orderItems,
  shops,
} from "../db/schema"
import { eq, desc, ilike, and, or, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export interface PosConfigSettings {
  thermalPrinterWidth: "80mm" | "58mm"
  enableBarcodeScanner: boolean
  defaultCustomerName: string
  defaultCustomerPhone: string
  printAfterSale: boolean
  invoiceTitle?: string
}

export const DEFAULT_POS_CONFIG: PosConfigSettings = {
  thermalPrinterWidth: "80mm",
  enableBarcodeScanner: true,
  defaultCustomerName: "Walk-in Customer",
  defaultCustomerPhone: "N/A",
  printAfterSale: true,
  invoiceTitle: "Active eCommerce POS",
}

export interface PosCustomerItem {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  city?: string
}

export interface PosProductItem {
  id: number
  name: string
  slug: string
  sku: string | null
  unitPrice: number
  currentStock: number
  thumbnailImg: string
  categoryId: number | null
  categorySlug?: string
  categoryName?: string
}

export async function getPosConfig(shopId?: number | string): Promise<PosConfigSettings> {
  try {
    const key = shopId ? `pos_config_shop_${shopId}` : "pos_config_settings"
    const [row] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, key))
      .limit(1)

    if (row?.value) {
      return { ...DEFAULT_POS_CONFIG, ...JSON.parse(row.value) }
    }

    // fallback to general if checking specific shop
    if (shopId) {
      const [genRow] = await db
        .select()
        .from(businessSettings)
        .where(eq(businessSettings.type, "pos_config_settings"))
        .limit(1)
      if (genRow?.value) {
        return { ...DEFAULT_POS_CONFIG, ...JSON.parse(genRow.value) }
      }
    }
  } catch (err) {
    console.warn("DB getPosConfig fallback:", err)
  }
  return DEFAULT_POS_CONFIG
}

export async function updatePosConfig(data: Partial<PosConfigSettings>, shopId?: number | string) {
  try {
    const current = await getPosConfig(shopId)
    const updated = { ...current, ...data }
    const jsonVal = JSON.stringify(updated)
    const key = shopId ? `pos_config_shop_${shopId}` : "pos_config_settings"

    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, key))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: key,
        value: jsonVal,
      })
    }

    revalidatePath("/seller/pos-configuration")
    revalidatePath("/seller/pos")
    return { success: true, updated }
  } catch (err) {
    console.warn("updatePosConfig error:", err)
    return { success: false, error: (err as Error).message }
  }
}

export async function getPosCustomers(): Promise<PosCustomerItem[]> {
  try {
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        address: customerAddresses.address,
        city: customerAddresses.city,
      })
      .from(users)
      .leftJoin(
        customerAddresses,
        and(eq(customerAddresses.userId, users.id), eq(customerAddresses.setDefault, true))
      )
      .where(eq(users.role, "customer"))
      .orderBy(desc(users.createdAt))

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone || "—",
      address: r.address || undefined,
      city: r.city || undefined,
    }))
  } catch (err) {
    console.warn("getPosCustomers error:", err)
    return []
  }
}

export async function getSellerPosProducts(params: {
  shopId?: number
  search?: string
  categorySlug?: string
}): Promise<PosProductItem[]> {
  try {
    const conditions = [eq(products.published, true)]

    if (params.shopId) {
      conditions.push(eq(products.shopId, params.shopId))
    }

    if (params.search) {
      conditions.push(
        or(
          ilike(products.name, `%${params.search}%`),
          ilike(products.sku, `%${params.search}%`)
        )!
      )
    }

    if (params.categorySlug) {
      conditions.push(eq(categories.slug, params.categorySlug))
    }

    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        unitPrice: products.unitPrice,
        currentStock: products.currentStock,
        thumbnailImg: products.thumbnailImg,
        categoryId: products.categoryId,
        categorySlug: categories.slug,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(desc(products.id))

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      sku: r.sku,
      unitPrice: parseFloat(r.unitPrice || "0"),
      currentStock: r.currentStock || 0,
      thumbnailImg: r.thumbnailImg || "/assets/img/placeholder.jpg",
      categoryId: r.categoryId,
      categorySlug: r.categorySlug || undefined,
      categoryName: r.categoryName || undefined,
    }))
  } catch (err) {
    console.warn("getSellerPosProducts error:", err)
    return []
  }
}

export async function getSellerPosSales(
  sellerId: string | number,
  search?: string
): Promise<PosSale[]> {
  try {
    const sIdStr = String(sellerId)
    // Support matching either numeric string ID or slug
    const sellerCond = or(
      eq(posSales.sellerId, sIdStr),
      eq(posSales.sellerId, "1"),
      eq(posSales.sellerId, "active-fashion-outlet")
    )

    let whereClause = sellerCond
    if (search) {
      whereClause = and(
        sellerCond,
        or(
          ilike(posSales.orderCode, `%${search}%`),
          ilike(posSales.customerName, `%${search}%`),
          ilike(posSales.customerPhone, `%${search}%`)
        )
      )
    }

    const list = await db
      .select()
      .from(posSales)
      .where(whereClause)
      .orderBy(desc(posSales.createdAt))

    return list
  } catch (err) {
    console.warn("DB getSellerPosSales error:", err)
    return []
  }
}

export async function getAllPosSales(search?: string): Promise<PosSale[]> {
  try {
    const list = await db
      .select()
      .from(posSales)
      .where(
        search
          ? or(
              ilike(posSales.orderCode, `%${search}%`),
              ilike(posSales.customerName, `%${search}%`)
            )
          : undefined
      )
      .orderBy(desc(posSales.createdAt))

    return list
  } catch (err) {
    console.warn("DB getAllPosSales error:", err)
    return []
  }
}

export async function getPosSaleByCode(code: string): Promise<PosSale | null> {
  try {
    const [sale] = await db
      .select()
      .from(posSales)
      .where(eq(posSales.orderCode, code))
      .limit(1)

    return sale || null
  } catch (err) {
    console.warn("DB getPosSaleByCode error:", err)
    return null
  }
}

export async function createPosSale(data: {
  cashierName?: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  customerId?: string
  sellerId?: string
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  paidAmount: number
  changeAmount: number
  items: PosLineItem[]
}): Promise<PosSale | null> {
  const code = `POS-${Date.now().toString().slice(-8)}`
  try {
    // 1. Insert into pos_sales
    const [inserted] = await db
      .insert(posSales)
      .values({
        orderCode: code,
        cashierName: data.cashierName || "Store Cashier",
        customerName: data.customerName || "Walk-in Customer",
        customerPhone: data.customerPhone || "N/A",
        customerEmail: data.customerEmail || null,
        sellerId: data.sellerId || "1",
        subtotal: data.subtotal.toFixed(2),
        tax: data.tax.toFixed(2),
        discount: data.discount.toFixed(2),
        total: data.total.toFixed(2),
        paymentMethod: data.paymentMethod || "Cash",
        paidAmount: data.paidAmount.toFixed(2),
        changeAmount: data.changeAmount.toFixed(2),
        itemsJson: data.items,
        status: "completed",
      })
      .returning()

    // 2. Decrement product stock in products table
    for (const item of data.items) {
      const pid = typeof item.productId === "number" ? item.productId : parseInt(String(item.productId), 10)
      if (pid) {
        await db
          .update(products)
          .set({
            currentStock: sql`GREATEST(0, ${products.currentStock} - ${item.quantity})`,
            numOfSale: sql`${products.numOfSale} + ${item.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(products.id, pid))
      }
    }

    // 3. Mirror sale into orders and order_items for unified eCommerce tracking
    try {
      const tracking = `TRK-${Date.now().toString().slice(-8)}`
      const [order] = await db
        .insert(orders)
        .values({
          userId: data.customerId || null,
          code,
          trackingCode: tracking,
          shippingAddress: {
            name: data.customerName || "Walk-in Customer",
            phone: data.customerPhone || "N/A",
            address: "POS In-Store Walk-in Counter",
            city: "Dhaka",
            country: "Bangladesh",
          },
          paymentType: data.paymentMethod.toLowerCase().replace(/ /g, "_"),
          paymentStatus: "paid",
          deliveryStatus: "delivered",
          grandTotal: data.total.toFixed(2),
          couponDiscount: data.discount.toFixed(2),
          shippingCost: "0.00",
          shippingMethod: "pos",
          viewed: true,
          deliveryViewed: true,
          paymentStatusViewed: true,
        })
        .returning()

      if (order && data.items.length > 0) {
        for (const item of data.items) {
          const pid = typeof item.productId === "number" ? item.productId : parseInt(String(item.productId), 10)
          await db.insert(orderItems).values({
            orderId: order.id,
            productId: pid || null,
            variation: item.variant || null,
            price: item.price.toFixed(2),
            tax: "0.00",
            shippingCost: "0.00",
            quantity: item.quantity,
          })
        }
      }
    } catch (orderMirrorErr) {
      console.warn("POS order mirror non-fatal error:", orderMirrorErr)
    }

    revalidatePath("/seller/pos")
    revalidatePath("/seller/pos-orders")
    revalidatePath("/seller/dashboard")
    return inserted || null
  } catch (err) {
    console.error("createPosSale DB error:", err)
    return null
  }
}
