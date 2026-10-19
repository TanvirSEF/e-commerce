import { db } from "../db"
import { customerPackages, customerPackagePayments, customerProducts } from "../db/schema"
import { eq, desc, and, or, ilike, count } from "drizzle-orm"
import type { CustomerPackageItem, CustomerPackageInputData } from "@/types/customer-package"
export type { CustomerPackageItem, CustomerPackageInputData } from "@/types/customer-package"

export interface CustomerPackageQuota {
  packageName: string
  totalUploads: number
  postedCount: number
  remainingUploads: number
  canUpload: boolean
}

export async function getCustomerPackageQuota(userId?: string): Promise<CustomerPackageQuota> {
  const defaultFreeQuota: CustomerPackageQuota = {
    packageName: "Free Package",
    totalUploads: 5,
    postedCount: 0,
    remainingUploads: 5,
    canUpload: true,
  }

  if (!userId) return defaultFreeQuota

  try {
    const [countRow] = await db
      .select({ val: count() })
      .from(customerProducts)
      .where(eq(customerProducts.userId, userId))

    const postedCount = Number(countRow?.val || 0)

    const rawDigits = String(userId).replace(/\D/g, "")
    const numUserId = rawDigits ? parseInt(rawDigits.slice(-8), 10) : 0
    let packageLimit = 5
    let packageName = "Free Package"

    const isValid32Bit = !isNaN(numUserId) && numUserId > 0 && numUserId <= 2147483647
    const userCondition = or(
      isValid32Bit ? eq(customerPackagePayments.userId, numUserId) : undefined,
      ilike(customerPackagePayments.paymentDetails, `%"userUid":"${userId}"%`)
    )

    const [latestPayment] = await db
      .select({
        productUpload: customerPackages.productUpload,
        name: customerPackages.name,
      })
      .from(customerPackagePayments)
      .innerJoin(customerPackages, eq(customerPackagePayments.customerPackageId, customerPackages.id))
      .where(
        and(
          eq(customerPackagePayments.approval, true),
          userCondition
        )
      )
      .orderBy(desc(customerPackagePayments.createdAt))
      .limit(1)

    if (latestPayment) {
      packageLimit = latestPayment.productUpload || 10
      packageName = latestPayment.name || "Standard Package"
    }

    const remainingUploads = Math.max(0, packageLimit - postedCount)

    return {
      packageName,
      totalUploads: packageLimit,
      postedCount,
      remainingUploads,
      canUpload: remainingUploads > 0,
    }
  } catch (err) {
    console.warn("getCustomerPackageQuota error:", err)
    return defaultFreeQuota
  }
}

export async function purchaseCustomerPackage(data: {
  userId: string
  packageId: number
  amount: string
  paymentMethod?: string
}) {
  try {
    const rawDigits = String(data.userId).replace(/\D/g, "")
    const numUserId = rawDigits ? parseInt(rawDigits.slice(-8), 10) : 1
    const [inserted] = await db
      .insert(customerPackagePayments)
      .values({
        userId: numUserId,
        customerPackageId: data.packageId,
        amount: data.amount,
        paymentMethod: data.paymentMethod || "Free Plan",
        paymentDetails: JSON.stringify({ userUid: data.userId }),
        offlinePayment: false,
        approval: true,
      })
      .returning()

    try {
      const { revalidatePath } = await import("next/cache")
      revalidatePath("/dashboard/customer-packages")
      revalidatePath("/dashboard/customer-products")
      revalidatePath("/customer-packages")
    } catch {}

    return { success: true, payment: inserted }
  } catch (err: any) {
    console.error("purchaseCustomerPackage error:", err)
    return { success: false, error: err?.message }
  }
}

export async function getAllCustomerPackages(): Promise<CustomerPackageItem[]> {
  try {
    const rows = await db.select().from(customerPackages).orderBy(desc(customerPackages.createdAt))
    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      amount: Number(p.amount),
      productUpload: p.productUpload,
      logo: p.logo ?? null,
      status: p.status,
      createdAt: p.createdAt.toISOString().slice(0, 10),
    }))
  } catch (err) {
    console.error("getAllCustomerPackages error:", err)
    return []
  }
}

export async function getCustomerPackageById(id: number): Promise<CustomerPackageItem | null> {
  try {
    const [row] = await db.select().from(customerPackages).where(eq(customerPackages.id, id)).limit(1)
    if (!row) return null
    return {
      id: row.id,
      name: row.name,
      amount: Number(row.amount),
      productUpload: row.productUpload,
      logo: row.logo ?? null,
      status: row.status,
      createdAt: row.createdAt.toISOString().slice(0, 10),
    }
  } catch (err) {
    console.error("getCustomerPackageById error:", err)
    return null
  }
}

export async function createCustomerPackage(data: CustomerPackageInputData): Promise<{ id: number }> {
  try {
    const [row] = await db
      .insert(customerPackages)
      .values({
        name: data.name,
        amount: data.amount.toString(),
        productUpload: data.productUpload,
        logo: data.logo ?? null,
      })
      .returning({ id: customerPackages.id })
    return { id: row.id }
  } catch (err) {
    console.error("createCustomerPackage error:", err)
    throw err
  }
}

export async function updateCustomerPackage(id: number, data: CustomerPackageInputData): Promise<void> {
  try {
    await db
      .update(customerPackages)
      .set({
        name: data.name,
        amount: data.amount.toString(),
        productUpload: data.productUpload,
        logo: data.logo ?? null,
      })
      .where(eq(customerPackages.id, id))
  } catch (err) {
    console.error("updateCustomerPackage error:", err)
    throw err
  }
}

export async function deleteCustomerPackage(id: number): Promise<void> {
  try {
    await db.delete(customerPackages).where(eq(customerPackages.id, id))
  } catch (err) {
    console.error("deleteCustomerPackage error:", err)
    throw err
  }
}
