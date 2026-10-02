"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { unfollowShop, followShop } from "@/services/customer-extra-service"

export async function unfollowShopAction(
  shopId: number
): Promise<{ success: boolean; message?: string }> {
  try {
    let userId = "usr_customer_default_01"
    try {
      const h = await headers()
      const session = await auth.api.getSession({ headers: h })
      if (session?.user?.id) {
        userId = session.user.id
      }
    } catch {
      // fallback
    }

    const ok = await unfollowShop(userId, shopId)
    revalidatePath("/dashboard/followed-sellers")
    revalidatePath("/dashboard")
    return { success: ok }
  } catch (err) {
    console.error("unfollowShopAction error:", err)
    return { success: false, message: "Failed to unfollow shop" }
  }
}

export async function followShopAction(
  shopId: number
): Promise<{ success: boolean; message?: string }> {
  try {
    let userId = "usr_customer_default_01"
    try {
      const h = await headers()
      const session = await auth.api.getSession({ headers: h })
      if (session?.user?.id) {
        userId = session.user.id
      }
    } catch {
      // fallback
    }

    const ok = await followShop(userId, shopId)
    revalidatePath("/dashboard/followed-sellers")
    revalidatePath("/dashboard")
    return { success: ok }
  } catch (err) {
    console.error("followShopAction error:", err)
    return { success: false, message: "Failed to follow shop" }
  }
}
