import { db } from "../db"
import { staffs, staffRoles } from "../db/schema"
import { eq, desc, ilike, or, count } from "drizzle-orm"
import type { StaffItem, RoleItem, StaffInputData, AdminStaffsResponse } from "@/types/staff"
export type { StaffItem, RoleItem, StaffInputData, AdminStaffsResponse } from "@/types/staff"

export async function getAllStaffsAdmin(params: {
  search?: string
  page?: number
  limit?: number
} = {}): Promise<AdminStaffsResponse> {
  const { search = "", page = 1, limit = 15 } = params
  const offset = (page - 1) * limit

  try {
    const whereClause = search
      ? or(
          ilike(staffs.name, `%${search}%`),
          ilike(staffs.email, `%${search}%`),
          ilike(staffs.phone, `%${search}%`),
          ilike(staffs.roleName, `%${search}%`)
        )
      : undefined

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(staffs)
        .where(whereClause)
        .orderBy(desc(staffs.id))
        .limit(limit)
        .offset(offset),
      db.select({ c: count() }).from(staffs).where(whereClause),
    ])

    const items: StaffItem[] = rows.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone ?? null,
      roleName: s.roleName,
      roleId: s.roleId ?? null,
      isActive: s.isActive,
      createdAt: s.createdAt.toISOString().slice(0, 10),
    }))

    return {
      items,
      total: Number(countResult[0]?.c ?? 0),
    }
  } catch (err) {
    console.error("getAllStaffsAdmin error:", err)
    return { items: [], total: 0 }
  }
}

export async function getAllRolesAdmin(): Promise<RoleItem[]> {
  try {
    const rows = await db.select().from(staffRoles).orderBy(desc(staffRoles.id))
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      permissions: (r.permissions as string[]) || [],
    }))
  } catch (err) {
    console.error("getAllRolesAdmin error:", err)
    return []
  }
}

export async function getStaffByIdAdmin(id: number): Promise<StaffItem | null> {
  try {
    const [row] = await db.select().from(staffs).where(eq(staffs.id, id)).limit(1)
    if (!row) return null
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone ?? null,
      roleName: row.roleName,
      roleId: row.roleId ?? null,
      isActive: row.isActive,
      createdAt: row.createdAt.toISOString().slice(0, 10),
    }
  } catch (err) {
    console.error("getStaffByIdAdmin error:", err)
    return null
  }
}

export async function createStaff(data: StaffInputData): Promise<{ id: number }> {
  try {
    // Look up role name from roleId
    let roleName = data.roleName || "Staff"
    if (data.roleId) {
      const [role] = await db.select().from(staffRoles).where(eq(staffRoles.id, data.roleId)).limit(1)
      if (role) {
        roleName = role.name
      }
    }

    const [row] = await db
      .insert(staffs)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        roleId: data.roleId,
        roleName,
        isActive: true,
      })
      .returning({ id: staffs.id })

    // Also sync to users & accounts for Better Auth login
    try {
      const { users, accounts } = await import("../db/schema")
      const { hashPassword } = await import("better-auth/crypto")
      const existingUser = await db.select().from(users).where(eq(users.email, data.email.trim().toLowerCase())).limit(1)
      if (existingUser.length === 0) {
        const userId = `usr_staff_${row.id}_${Date.now()}`
        await db.insert(users).values({
          id: userId,
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone?.trim() || null,
          role: "staff",
          emailVerified: true,
          balance: "0.00",
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        if (data.password) {
          const hashedPassword = await hashPassword(data.password)
          await db.insert(accounts).values({
            id: `acc_${userId}`,
            userId,
            accountId: userId,
            providerId: "credential",
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
      } else {
        await db.update(users).set({ role: "staff", updatedAt: new Date() }).where(eq(users.id, existingUser[0].id))
        if (data.password) {
          const hashedPassword = await hashPassword(data.password)
          await db.update(accounts).set({ password: hashedPassword, updatedAt: new Date() }).where(eq(accounts.userId, existingUser[0].id))
        }
      }
    } catch (authErr) {
      console.warn("Failed to sync staff to Better Auth users/accounts:", authErr)
    }

    return { id: row.id }
  } catch (err) {
    console.error("createStaff error:", err)
    throw err
  }
}

export async function updateStaff(id: number, data: StaffInputData): Promise<void> {
  try {
    let roleName: string | undefined
    if (data.roleId) {
      const [role] = await db.select().from(staffRoles).where(eq(staffRoles.id, data.roleId)).limit(1)
      if (role) {
        roleName = role.name
      }
    }

    await db
      .update(staffs)
      .set({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        roleId: data.roleId,
        ...(roleName ? { roleName } : {}),
        updatedAt: new Date(),
      })
      .where(eq(staffs.id, id))

    if (data.password) {
      try {
        const { users, accounts } = await import("../db/schema")
        const { hashPassword } = await import("better-auth/crypto")
        const existingUser = await db.select().from(users).where(eq(users.email, data.email.trim().toLowerCase())).limit(1)
        if (existingUser.length > 0) {
          const hashedPassword = await hashPassword(data.password)
          await db.update(accounts).set({ password: hashedPassword, updatedAt: new Date() }).where(eq(accounts.userId, existingUser[0].id))
        }
      } catch (authErr) {
        console.warn("Failed to update staff password in auth:", authErr)
      }
    }
  } catch (err) {
    console.error("updateStaff error:", err)
    throw err
  }
}

export async function updateStaffStatus(id: number, isActive: boolean): Promise<void> {
  try {
    await db
      .update(staffs)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(staffs.id, id))
  } catch (err) {
    console.error("updateStaffStatus error:", err)
    throw err
  }
}

export async function deleteStaff(id: number): Promise<void> {
  try {
    const [staff] = await db.select().from(staffs).where(eq(staffs.id, id)).limit(1)
    await db.delete(staffs).where(eq(staffs.id, id))
    if (staff) {
      try {
        const { users } = await import("../db/schema")
        await db.delete(users).where(eq(users.email, staff.email))
      } catch (authErr) {
        console.warn("Failed to clean up staff auth user:", authErr)
      }
    }
  } catch (err) {
    console.error("deleteStaff error:", err)
    throw err
  }
}

export async function getRoleByIdAdmin(id: number): Promise<RoleItem | null> {
  try {
    const [row] = await db.select().from(staffRoles).where(eq(staffRoles.id, id)).limit(1)
    if (!row) return null
    return {
      id: row.id,
      name: row.name,
      permissions: (row.permissions as string[]) || [],
    }
  } catch (err) {
    console.error("getRoleByIdAdmin error:", err)
    return null
  }
}

export async function createRoleAdmin(data: { name: string; permissions: string[] }): Promise<{ id: number }> {
  try {
    const [row] = await db
      .insert(staffRoles)
      .values({
        name: data.name.trim(),
        permissions: data.permissions,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: staffRoles.id })
    return { id: row.id }
  } catch (err) {
    console.error("createRoleAdmin error:", err)
    throw err
  }
}

export async function updateRoleAdmin(id: number, data: { name: string; permissions: string[] }): Promise<void> {
  try {
    await db
      .update(staffRoles)
      .set({
        name: data.name.trim(),
        permissions: data.permissions,
        updatedAt: new Date(),
      })
      .where(eq(staffRoles.id, id))

    await db
      .update(staffs)
      .set({ roleName: data.name.trim(), updatedAt: new Date() })
      .where(eq(staffs.roleId, id))
  } catch (err) {
    console.error("updateRoleAdmin error:", err)
    throw err
  }
}

export async function deleteRoleAdmin(id: number): Promise<void> {
  try {
    await db.delete(staffRoles).where(eq(staffRoles.id, id))
  } catch (err) {
    console.error("deleteRoleAdmin error:", err)
    throw err
  }
}

// Backward-compatibility aliases
export const getAllStaffs = async () => (await getAllStaffsAdmin({ limit: 100 })).items
export const getAllRoles = getAllRolesAdmin
