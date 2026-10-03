"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "@/lib/auth/session-helper"
import {
  getCurrentSeller,
  updateSellerShop,
  getSellerAddresses,
  createSellerAddress,
  updateSellerAddress,
  deleteSellerAddress,
  setDefaultSellerAddress,
  getSellerProductReviewDetails,
  replySellerProductQuery,
  createSellerTicket,
  replySellerTicket,
  getSellerTicketDetails,
  getSellerConversationThread,
  sendSellerConversationMessage,
} from "@/services/seller-panel-service"
import { submitSellerVerification } from "@/services/seller-service"

export async function updateSellerShopAction(
  shopId: number,
  data: {
    name?: string
    phone?: string
    address?: string
    logo?: string
    topBanner?: string
    facebook?: string
    instagram?: string
    twitter?: string
    google?: string
    youtube?: string
    metaTitle?: string
    metaDescription?: string
  }
) {
  try {
    const res = await updateSellerShop(shopId, data)
    revalidatePath("/seller/shop")
    revalidatePath(`/shop`)
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function submitSellerVerificationAction(
  shopId: number,
  data: {
    nidNumber?: string
    tradeLicense?: string
    documentType?: string
    documentUrl?: string
    bankName?: string
    bankAccount?: string
  }
) {
  try {
    const res = await submitSellerVerification(shopId, data)
    revalidatePath("/seller/verify")
    return res
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function getSellerAddressesAction() {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return []
  return await getSellerAddresses(seller.userId)
}

export async function createSellerAddressAction(data: {
  address: string
  country?: string
  city?: string
  state?: string
  postalCode?: string
  phone?: string
  setDefault?: boolean
}) {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return { success: false, error: "Unauthorized" }
  try {
    const created = await createSellerAddress(seller.userId, data)
    revalidatePath("/seller/profile")
    return { success: true, data: created }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function updateSellerAddressAction(
  id: number,
  data: {
    address: string
    country?: string
    city?: string
    state?: string
    postalCode?: string
    phone?: string
    setDefault?: boolean
  }
) {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return { success: false, error: "Unauthorized" }
  try {
    const updated = await updateSellerAddress(seller.userId, id, data)
    revalidatePath("/seller/profile")
    return { success: true, data: updated }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function deleteSellerAddressAction(id: number) {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return { success: false, error: "Unauthorized" }
  try {
    await deleteSellerAddress(seller.userId, id)
    revalidatePath("/seller/profile")
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function setDefaultSellerAddressAction(id: number) {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return { success: false, error: "Unauthorized" }
  try {
    await setDefaultSellerAddress(seller.userId, id)
    revalidatePath("/seller/profile")
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function fetchSellerProductReviewDetailsAction(productId: number) {
  try {
    const data = await getSellerProductReviewDetails(productId)
    revalidatePath("/seller/product-reviews")
    return { success: true, data }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

/* -------------------------- Product Queries Actions --------------------- */

export async function replySellerProductQueryAction(id: number, replyText: string) {
  const seller = await getCurrentSeller()
  if (!seller) return { success: false, error: "Unauthorized" }
  try {
    await replySellerProductQuery(id, replyText, seller.shopName || "Merchant Seller")
    revalidatePath("/seller/product-queries")
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

/* -------------------------- Support Ticket Actions ---------------------- */

export async function createSellerTicketAction(data: {
  subject: string
  details: string
  files?: string[]
}) {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return { success: false, error: "Unauthorized" }
  try {
    const created = await createSellerTicket(seller.userId, data)
    revalidatePath("/seller/support")
    return { success: true, data: created }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function replySellerTicketAction(
  ticketId: number,
  replyText: string,
  files?: string[]
) {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return { success: false, error: "Unauthorized" }
  try {
    const rep = await replySellerTicket(ticketId, seller.userId, replyText, files)
    revalidatePath("/seller/support")
    return { success: true, data: rep }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function fetchSellerTicketDetailsAction(ticketId: number) {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return { success: false, error: "Unauthorized", data: null }
  try {
    const data = await getSellerTicketDetails(ticketId, seller.userId)
    revalidatePath("/seller/support")
    return { success: true, data }
  } catch (err) {
    return { success: false, error: (err as Error).message, data: null }
  }
}

/* -------------------------- Conversations Actions ----------------------- */

export async function fetchSellerConversationThreadAction(conversationId: number) {
  const seller = await getCurrentSeller()
  if (!seller) return { success: false, error: "Unauthorized", data: null }
  try {
    const data = await getSellerConversationThread(conversationId, seller)
    revalidatePath("/seller/conversations")
    return { success: true, data }
  } catch (err) {
    return { success: false, error: (err as Error).message, data: null }
  }
}

export async function sendSellerConversationMessageAction(
  conversationId: number,
  messageText: string
) {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return { success: false, error: "Unauthorized" }
  try {
    const msg = await sendSellerConversationMessage(conversationId, seller.userId, messageText)
    revalidatePath("/seller/conversations")
    return { success: true, data: msg }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

/* -------------------------- Notification Actions ----------------------- */

export async function bulkDeleteSellerNotificationsAction(ids: string[]) {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return { success: false, error: "Unauthorized" }
  try {
    const { deleteUserNotifications } = await import("@/services/notification-service")
    await deleteUserNotifications(ids, seller.userId)
    revalidatePath("/seller/notifications")
    revalidatePath("/seller/all-notification")
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function markAllSellerNotificationsReadAction() {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return { success: false, error: "Unauthorized" }
  try {
    const { getSellerNotifications, markNotificationsAsRead } = await import(
      "@/services/notification-service"
    )
    const all = await getSellerNotifications(seller.userId)
    const unreadIds = all.filter((n) => !n.isRead).map((n) => n.id)
    if (unreadIds.length > 0) {
      await markNotificationsAsRead(unreadIds, seller.userId)
    }
    revalidatePath("/seller/notifications")
    revalidatePath("/seller/all-notification")
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

