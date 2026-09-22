"use server"

import { createCoupon } from "@/services/coupon-service"
import { createFlashDeal } from "@/services/settings-service"
import { rechargeWallet, convertClubPoints } from "@/services/wallet-service"
import { createTicket } from "@/services/ticket-service"

export async function createCouponAction(data: {
  code: string
  type: "cart_base" | "product_base"
  discount: number
  discountType: "percent" | "amount"
  minBuy: number
  maxDiscount: number
  startDate: number
  endDate: number
}) {
  return await createCoupon(data)
}

export async function createFlashDealAction(data: {
  title: string
  banner?: string
  startDate: number
  endDate: number
}) {
  return await createFlashDeal(data)
}

export async function rechargeWalletAction(data: {
  userId?: string
  amount: number
  paymentMethod: string
  paymentDetails?: string
  offlinePayment?: boolean
}) {
  return await rechargeWallet(data)
}

export async function convertClubPointsAction(
  userId: string = "usr_customer_default_01",
  pointsToConvert: number
) {
  return await convertClubPoints(userId, pointsToConvert)
}

export async function createTicketAction(data: {
  userId?: string
  subject: string
  details: string
  files?: string[]
}) {
  return await createTicket(data)
}
