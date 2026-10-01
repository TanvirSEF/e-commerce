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
    await db.delete(staffs).where(eq(staffs.id, id))
  } catch (err) {
    console.error("deleteStaff error:", err)
    throw err
  }
}

// Backward-compatibility aliases
export const getAllStaffs = async () => (await getAllStaffsAdmin({ limit: 100 })).items
export const getAllRoles = getAllRolesAdmin
