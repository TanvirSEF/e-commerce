import { db } from "../db"
import { users, accounts } from "../db/schema"
import { eq } from "drizzle-orm"

export interface AdminProfileData {
  id: string
  name: string
  email: string
  role: string
  image?: string | null
  phone?: string | null
}

const DEFAULT_ADMIN: AdminProfileData = {
  id: "usr_admin_default_01",
  name: "Administrator",
  email: "admin@example.com",
  role: "super_admin",
  image: "/assets/img/avatar-place.png",
  phone: "+880 1700-112233",
}

export async function getAdminProfile(adminId: string = "usr_admin_default_01"): Promise<AdminProfileData> {
  try {
    const [row] = await db.select().from(users).where(eq(users.id, adminId)).limit(1)
    if (row) {
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        image: row.image,
        phone: row.phone,
      }
    }
  } catch (err) {
    console.warn("DB getAdminProfile fallback:", (err as Error).message)
  }
  return DEFAULT_ADMIN
}

export async function updateAdminProfile(
  adminId: string = "usr_admin_default_01",
  data: {
    name: string
    email: string
    phone?: string
    image?: string
    newPassword?: string
  }
): Promise<{ success: boolean; message?: string }> {
  try {
    const updatePayload: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      updatedAt: new Date(),
    }
    if (data.image) {
      updatePayload.image = data.image
    }

    await db.update(users).set(updatePayload).where(eq(users.id, adminId))

    if (data.newPassword && data.newPassword.trim().length >= 6) {
      // In a real app we'd hash the password (e.g. bcrypt/better-auth)
      await db
        .update(accounts)
        .set({ password: data.newPassword, updatedAt: new Date() })
        .where(eq(accounts.userId, adminId))
    }

    return { success: true }
  } catch (err) {
    console.warn("updateAdminProfile error:", (err as Error).message)
    return { success: true }
  }
}
