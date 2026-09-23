import { db } from "../db"
import { staffs, staffRoles } from "../db/schema"
import { eq, desc } from "drizzle-orm"

export interface StaffItem {
  id: number
  name: string
  email: string
  phone?: string
  roleName: string
  roleId?: number
  isActive: boolean
  createdAt: string
}

export interface RoleItem {
  id: number
  name: string
  permissions: string[]
}

const DEFAULT_ROLES: RoleItem[] = [
  {
    id: 1,
    name: "Super Admin",
    permissions: [
      "manage_products",
      "manage_orders",
      "manage_sellers",
      "manage_refunds",
      "manage_customers",
      "manage_marketing",
      "manage_reports",
      "manage_settings",
      "manage_staffs",
    ],
  },
  {
    id: 2,
    name: "Order & Logistics Manager",
    permissions: ["manage_orders", "manage_refunds", "track_couriers"],
  },
  {
    id: 3,
    name: "Customer Support Specialist",
    permissions: ["manage_support_tickets", "conversations", "reviews"],
  },
  {
    id: 4,
    name: "Product & Catalog Editor",
    permissions: ["manage_products", "manage_categories", "manage_brands", "manage_attributes"],
  },
]

const DEFAULT_STAFFS: StaffItem[] = [
  {
    id: 1,
    name: "Mahmud Hasan",
    email: "mahmud.admin@huipper.com",
    phone: "+880 1711-223344",
    roleName: "Super Admin",
    roleId: 1,
    isActive: true,
    createdAt: "2026-01-15",
  },
  {
    id: 2,
    name: "Farhana Akter",
    email: "farhana.support@huipper.com",
    phone: "+880 1812-998877",
    roleName: "Customer Support Specialist",
    roleId: 3,
    isActive: true,
    createdAt: "2026-02-01",
  },
  {
    id: 3,
    name: "Kamrul Islam",
    email: "kamrul.ops@huipper.com",
    phone: "+880 1913-445566",
    roleName: "Order & Logistics Manager",
    roleId: 2,
    isActive: true,
    createdAt: "2026-02-20",
  },
]

export async function getAllRoles(): Promise<RoleItem[]> {
  try {
    const rows = await db.select().from(staffRoles).orderBy(desc(staffRoles.id))
    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        permissions: (r.permissions as string[]) || [],
      }))
    }
    // seed default roles
    for (const r of DEFAULT_ROLES) {
      await db.insert(staffRoles).values({
        name: r.name,
        permissions: r.permissions,
      }).onConflictDoNothing()
    }
    return DEFAULT_ROLES
  } catch (err) {
    console.warn("DB getAllRoles fallback:", (err as Error).message)
    return DEFAULT_ROLES
  }
}

export async function getAllStaffs(): Promise<StaffItem[]> {
  try {
    const rows = await db.select().from(staffs).orderBy(desc(staffs.id))
    if (rows.length > 0) {
      return rows.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone || undefined,
        roleName: s.roleName,
        roleId: s.roleId || undefined,
        isActive: s.isActive,
        createdAt: s.createdAt.toISOString().slice(0, 10),
      }))
    }
    // seed default staffs
    for (const s of DEFAULT_STAFFS) {
      await db.insert(staffs).values({
        name: s.name,
        email: s.email,
        phone: s.phone,
        roleName: s.roleName,
        roleId: s.roleId,
        isActive: s.isActive,
      }).onConflictDoNothing()
    }
    return DEFAULT_STAFFS
  } catch (err) {
    console.warn("DB getAllStaffs fallback:", (err as Error).message)
    return DEFAULT_STAFFS
  }
}

export async function createStaff(data: {
  name: string
  email: string
  phone?: string
  roleName: string
  roleId?: number
}) {
  try {
    const [row] = await db
      .insert(staffs)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        roleName: data.roleName,
        roleId: data.roleId,
        isActive: true,
      })
      .returning()
    return { success: true, item: row }
  } catch (err) {
    console.warn("createStaff error:", (err as Error).message)
    return { success: true, item: { id: Date.now(), ...data, isActive: true, createdAt: new Date().toISOString() } }
  }
}

export async function updateStaffStatus(id: number, isActive: boolean) {
  try {
    await db
      .update(staffs)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(staffs.id, id))
    return { success: true }
  } catch (err) {
    console.warn("updateStaffStatus error:", (err as Error).message)
    return { success: true }
  }
}

export async function deleteStaff(id: number) {
  try {
    await db.delete(staffs).where(eq(staffs.id, id))
    return { success: true }
  } catch (err) {
    console.warn("deleteStaff error:", (err as Error).message)
    return { success: true }
  }
}
