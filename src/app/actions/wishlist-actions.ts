"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import {
  getUserWishlistProductIds,
  getUserWishlistProducts,
  toggleWishlistProduct,
  removeFromWishlist,
} from "@/services/customer-extra-service"

async function resolveUserId(): Promise<string> {
  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    if (session?.user?.id) {
      return session.user.id
    }
  } catch {
    // fallback
  }
  return "usr_customer_default_01"
}

export async function getWishlistProductIdsAction(): Promise<string[]> {
  const userId = await resolveUserId()
  return await getUserWishlistProductIds(userId)
}

export async function toggleWishlistAction(productId: number) {
  const userId = await resolveUserId()
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
  const targetId = wishlistId > 0 ? wishlistId : (productId || 0)
  const result = await removeFromWishlist(userId, targetId)
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/wishlist")
  revalidatePath("/wishlist")
  revalidatePath("/wishlists")
  return { success: result }
}
