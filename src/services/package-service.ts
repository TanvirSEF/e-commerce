import { db } from "../db"
import {
  sellerPackages,
  sellerPackagePayments,
  customerPackages,
  customerPackagePayments,
  shops,
  type SellerPackage,
  type SellerPackagePayment,
  type CustomerPackage,
  type CustomerPackagePayment,
} from "../db/schema"
import { eq, desc } from "drizzle-orm"
// ---------------- Seller Packages ----------------
export async function getAllSellerPackages(): Promise<SellerPackage[]> {
  try {
    const rows = await db.select().from(sellerPackages).orderBy(sellerPackages.id)
    return rows || []
  } catch (err) {
    console.warn("getAllSellerPackages error:", (err as Error).message)
    return []
  }
}

export async function getSellerPackageById(id: number): Promise<SellerPackage | null> {
  try {
    const [row] = await db.select().from(sellerPackages).where(eq(sellerPackages.id, id)).limit(1)
    return row || null
  } catch (err) {
    console.warn("getSellerPackageById error:", (err as Error).message)
    return null
  }
}

export async function createSellerPackage(data: {
  name: string
  amount: string
  productUploadLimit: number
  duration: number
  logo?: string
}): Promise<SellerPackage> {
  try {
    const [inserted] = await db
      .insert(sellerPackages)
      .values({
        name: data.name,
        amount: data.amount,
        productUploadLimit: data.productUploadLimit,
        duration: data.duration,
        logo: data.logo || null,
        status: true,
      })
      .returning()
    return inserted
  } catch (err) {
    console.warn("createSellerPackage error:", (err as Error).message)
    throw err
  }
}

export async function updateSellerPackage(
  id: number,
  data: Partial<Pick<SellerPackage, "name" | "amount" | "productUploadLimit" | "duration" | "logo">>
): Promise<boolean> {
  try {
    await db.update(sellerPackages).set(data).where(eq(sellerPackages.id, id))
    return true
  } catch (err) {
    console.warn("updateSellerPackage error:", (err as Error).message)
    return false
  }
}

export async function toggleSellerPackageStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db.update(sellerPackages).set({ status }).where(eq(sellerPackages.id, id))
    return true
  } catch (err) {
    console.warn("toggleSellerPackageStatus error:", (err as Error).message)
    return false
  }
}

export async function deleteSellerPackage(id: number): Promise<boolean> {
  try {
    await db.delete(sellerPackages).where(eq(sellerPackages.id, id))
    return true
  } catch (err) {
    console.warn("deleteSellerPackage error:", (err as Error).message)
    return false
  }
}

export async function getAllSellerPackagePayments(): Promise<
  (SellerPackagePayment & { sellerName?: string; packageName?: string })[]
> {
  try {
    const rows = await db
      .select({
        id: sellerPackagePayments.id,
        sellerId: sellerPackagePayments.sellerId,
        sellerPackageId: sellerPackagePayments.sellerPackageId,
        amount: sellerPackagePayments.amount,
        paymentMethod: sellerPackagePayments.paymentMethod,
        paymentDetails: sellerPackagePayments.paymentDetails,
        offlinePayment: sellerPackagePayments.offlinePayment,
        approval: sellerPackagePayments.approval,
        receipt: sellerPackagePayments.receipt,
        createdAt: sellerPackagePayments.createdAt,
        sellerName: shops.name,
        packageName: sellerPackages.name,
      })
      .from(sellerPackagePayments)
      .leftJoin(shops, eq(sellerPackagePayments.sellerId, shops.id))
      .leftJoin(sellerPackages, eq(sellerPackagePayments.sellerPackageId, sellerPackages.id))
      .orderBy(desc(sellerPackagePayments.createdAt))

    return (rows || []).map((r) => ({
      ...r,
      sellerName: r.sellerName || "Registered Seller",
      packageName: r.packageName || "Subscription Plan",
    }))
  } catch (err) {
    console.warn("getAllSellerPackagePayments error:", (err as Error).message)
    return []
  }
}

export async function purchaseSellerPackage(data: {
  sellerId: number
  sellerPackageId: number
  amount: string
  paymentMethod: string
  paymentDetails?: string
  offlinePayment?: boolean
  sellerName?: string
  packageName?: string
}) {
  try {
    const [inserted] = await db
      .insert(sellerPackagePayments)
      .values({
        sellerId: data.sellerId,
        sellerPackageId: data.sellerPackageId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentDetails: data.paymentDetails || null,
        offlinePayment: !!data.offlinePayment,
        approval: true,
      })
      .returning()
    return { success: true, payment: inserted }
  } catch (err) {
    console.warn("purchaseSellerPackage error:", (err as Error).message)
    return { success: false, error: (err as Error).message }
  }
}

// ---------------- Customer Packages ----------------
export async function getAllCustomerPackages(): Promise<CustomerPackage[]> {
  try {
    const rows = await db.select().from(customerPackages).orderBy(customerPackages.id)
    return rows || []
  } catch (err) {
    console.warn("getAllCustomerPackages error:", (err as Error).message)
    return []
  }
}

export async function createCustomerPackage(data: {
  name: string
  amount: string
  productUpload: number
}): Promise<CustomerPackage> {
  try {
    const [inserted] = await db
      .insert(customerPackages)
      .values({
        name: data.name,
        amount: data.amount,
        productUpload: data.productUpload,
        logo: null,
        status: true,
      })
      .returning()
    return inserted
  } catch (err) {
    console.warn("createCustomerPackage error:", (err as Error).message)
    throw err
  }
}

export async function toggleCustomerPackageStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db.update(customerPackages).set({ status }).where(eq(customerPackages.id, id))
    return true
  } catch (err) {
    console.warn("toggleCustomerPackageStatus error:", (err as Error).message)
    return false
  }
}
