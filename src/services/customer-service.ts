import { db } from "../db"
import { users } from "../db/schema/auth"
import { eq, desc, ilike, or, and, count, sql } from "drizzle-orm"
import type { AdminCustomerItem, AdminCustomersResponse } from "@/types/customer-admin"
export type { AdminCustomerItem, AdminCustomersResponse } from "@/types/customer-admin"

export async function getAllCustomersAdmin(params: {
  search?: string
  status?: string
  page?: number
  limit?: number
} = {}): Promise<AdminCustomersResponse> {
  const { search = "", status = "all", page = 1, limit = 15 } = params
  const offset = (page - 1) * limit

  try {
    // Base where: only customers (not admin/seller)
    type WhereClause = ReturnType<typeof eq> | ReturnType<typeof ilike> | ReturnType<typeof or> | ReturnType<typeof and>

    const buildStatusWhere = (s: string): WhereClause | undefined => {
      if (s === "banned")     return eq(users.banned, true)
      if (s === "suspicious") return eq(users.isSuspicious, true)
      if (s === "verified")   return eq(users.emailVerified, true)
      if (s === "unverified") return eq(users.emailVerified, false)
      return undefined
    }

    const searchWhere = search
      ? or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`))
      : undefined

    const statusWhere = buildStatusWhere(status)

    const conditions = [eq(users.role, "customer"), searchWhere, statusWhere].filter(Boolean)

    const baseQuery = conditions.length > 0 ? and(...(conditions as [ReturnType<typeof eq>])) : undefined

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(users)
        .where(baseQuery)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ c: count() }).from(users).where(baseQuery),
    ])

    // Tab counts (strictly scoped to customers)
    const [allCount, bannedCount, suspiciousCount, verifiedCount, unverifiedCount] = await Promise.all([
      db.select({ c: count() }).from(users).where(eq(users.role, "customer")),
      db.select({ c: count() }).from(users).where(and(eq(users.role, "customer"), eq(users.banned, true))),
      db.select({ c: count() }).from(users).where(and(eq(users.role, "customer"), eq(users.isSuspicious, true))),
      db.select({ c: count() }).from(users).where(and(eq(users.role, "customer"), eq(users.emailVerified, true))),
      db.select({ c: count() }).from(users).where(and(eq(users.role, "customer"), eq(users.emailVerified, false))),
    ])

    const items: AdminCustomerItem[] = rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone ?? null,
      image: u.image ?? null,
      balance: Number(u.balance ?? 0),
      role: u.role,
      emailVerified: u.emailVerified,
      banned: u.banned,
      isSuspicious: u.isSuspicious,
      createdAt: u.createdAt.toISOString().slice(0, 10),
    }))

    return {
      items,
      total: Number(countResult[0]?.c ?? 0),
      counts: {
        all:        Number(allCount[0]?.c ?? 0),
        banned:     Number(bannedCount[0]?.c ?? 0),
        suspicious: Number(suspiciousCount[0]?.c ?? 0),
        verified:   Number(verifiedCount[0]?.c ?? 0),
        unverified: Number(unverifiedCount[0]?.c ?? 0),
      },
    }
  } catch (err) {
    console.error("getAllCustomersAdmin error:", err)
    return { items: [], total: 0, counts: { all: 0, banned: 0, suspicious: 0, verified: 0, unverified: 0 } }
  }
}

export async function banToggleCustomer(userId: string): Promise<{ banned: boolean }> {
  try {
    const [user] = await db.select({ banned: users.banned }).from(users).where(eq(users.id, userId)).limit(1)
    if (!user) throw new Error("User not found")
    const newBanned = !user.banned
    await db.update(users).set({ banned: newBanned }).where(eq(users.id, userId))
    return { banned: newBanned }
  } catch (err) {
    console.error("banToggleCustomer error:", err)
    throw err
  }
}

export async function suspiciousToggleCustomer(userId: string): Promise<{ isSuspicious: boolean }> {
  try {
    const [user] = await db.select({ isSuspicious: users.isSuspicious }).from(users).where(eq(users.id, userId)).limit(1)
    if (!user) throw new Error("User not found")
    const newVal = !user.isSuspicious
    await db.update(users).set({ isSuspicious: newVal }).where(eq(users.id, userId))
    return { isSuspicious: newVal }
  } catch (err) {
    console.error("suspiciousToggleCustomer error:", err)
    throw err
  }
}

export async function deleteCustomer(userId: string): Promise<void> {
  try {
    await db.delete(users).where(eq(users.id, userId))
  } catch (err) {
    console.error("deleteCustomer error:", err)
    throw err
  }
}

export async function createCustomerAdmin(data: {
  name: string
  email: string
  phone?: string
  password?: string
}): Promise<{ success: boolean; error?: string; user?: any }> {
  try {
    const existing = await db.select().from(users).where(eq(users.email, data.email.trim().toLowerCase())).limit(1)
    if (existing.length > 0) {
      return { success: false, error: "A user with this email address already exists." }
    }

    const { hashPassword } = await import("better-auth/crypto")
    const hashedPassword = data.password ? await hashPassword(data.password) : await hashPassword("12345678")
    const userId = `usr_cust_${Date.now()}`

    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        role: "customer",
        emailVerified: true,
        banned: false,
        isSuspicious: false,
        balance: "0.00",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    const { accounts } = await import("@/db/schema/auth")
    await db.insert(accounts).values({
      id: `acc_${userId}`,
      userId: userId,
      accountId: userId,
      providerId: "credential",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return { success: true, user: newUser }
  } catch (err: any) {
    console.error("createCustomerAdmin error:", err)
    return { success: false, error: err?.message || "Failed to create customer" }
  }
}

export async function bulkDeleteCustomers(userIds: string[]): Promise<boolean> {
  if (!userIds || userIds.length === 0) return true
  try {
    const { inArray } = await import("drizzle-orm")
    await db.delete(users).where(inArray(users.id, userIds))
    return true
  } catch (err) {
    console.error("bulkDeleteCustomers error:", err)
    return false
  }
}

export async function bulkBanCustomers(userIds: string[], banned: boolean): Promise<boolean> {
  if (!userIds || userIds.length === 0) return true
  try {
    const { inArray } = await import("drizzle-orm")
    await db.update(users).set({ banned }).where(inArray(users.id, userIds))
    return true
  } catch (err) {
    console.error("bulkBanCustomers error:", err)
    return false
  }
}

