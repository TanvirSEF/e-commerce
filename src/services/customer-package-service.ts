import { db } from "../db"
import { customerPackages } from "../db/schema"
import { eq, desc } from "drizzle-orm"
import type { CustomerPackageItem, CustomerPackageInputData } from "@/types/customer-package"
export type { CustomerPackageItem, CustomerPackageInputData } from "@/types/customer-package"

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
