"use server"

import { revalidatePath } from "next/cache"
import {
  getCurrentSeller,
  createSellerCoupon,
  deleteSellerCoupon,
  toggleSellerCoupon,
  createSellerPayout,
  purchaseSellerPackageFor,
} from "@/services/seller-panel-service"

const NOT_SELLER = { success: false, error: "Seller account not found." }

export async function sellerCreateCouponAction(data: {
  code: string
  type: "cart_base" | "product_base"
  discount: number
  discountType: "percent" | "amount"
  minBuy: number
  maxDiscount: number
  startDate: number
  endDate: number
}) {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return NOT_SELLER
  const res = await createSellerCoupon(seller.userId, data)
  revalidatePath("/seller/coupons")
  return res
}

export async function sellerDeleteCouponAction(id: number) {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return NOT_SELLER
  const ok = await deleteSellerCoupon(seller.userId, id)
  revalidatePath("/seller/coupons")
  return { success: ok }
}

export async function sellerToggleCouponAction(id: number, status: boolean) {
  const seller = await getCurrentSeller()
  if (!seller?.userId) return NOT_SELLER
  const ok = await toggleSellerCoupon(seller.userId, id, status)
  revalidatePath("/seller/coupons")
  return { success: ok }
}

export async function sellerRequestPayoutAction(data: { amount: number; message: string; paymentMethod: string }) {
  const seller = await getCurrentSeller()
  if (!seller) return NOT_SELLER
  const res = await createSellerPayout(seller, data)
  revalidatePath("/seller/payouts")
  revalidatePath("/admin/sellers/payout-requests")
  return res
}

export async function sellerPurchasePackageAction(packageId: number, paymentMethod: string) {
  const seller = await getCurrentSeller()
  if (!seller) return NOT_SELLER
  const res = await purchaseSellerPackageFor(seller, packageId, paymentMethod)
  revalidatePath("/seller/packages")
  revalidatePath("/admin/seller-packages/payments")
  return res
}
