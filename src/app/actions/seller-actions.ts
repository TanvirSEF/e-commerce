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
