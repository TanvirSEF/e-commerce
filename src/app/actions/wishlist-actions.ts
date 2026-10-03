"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "@/lib/auth/session-helper"
import {
  getUserWishlistProductIds,
  getUserWishlistProducts,
  toggleWishlistProduct,
  removeFromWishlist,
} from "@/services/customer-extra-service"

async function resolveUserId(): Promise<string | null> {
  const session = await getServerSession()
  return session?.user?.id || null
}

export async function getWishlistProductIdsAction(): Promise<string[]> {
  const userId = await resolveUserId()
  if (!userId) return []
  return await getUserWishlistProductIds(userId)
}

export async function toggleWishlistAction(productId: number) {
  const userId = await resolveUserId()
  if (!userId) {
    return { success: false, requireLogin: true }
  }
  const result = await toggleWishlistProduct(userId, productId)
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/wishlist")
  revalidatePath("/wishlist")
  revalidatePath("/wishlists")
  revalidatePath("/products")
  return { success: true, added: result.added }
}

export async function removeFromWishlistAction(wishlistId: number, productId?: number) {
  const userId = await resolveUserId()
  if (!userId) {
    return { success: false }
  }
  const targetId = wishlistId > 0 ? wishlistId : (productId || 0)
  const result = await removeFromWishlist(userId, targetId)
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/wishlist")
  revalidatePath("/wishlist")
  revalidatePath("/wishlists")
  return { success: result }
}
