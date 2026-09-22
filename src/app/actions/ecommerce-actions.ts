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

export async function updateSellerVerificationAction(shopId: number, status: boolean) {
  const { updateSellerVerification } = await import("@/services/seller-service")
  return await updateSellerVerification(shopId, status)
}

export async function processWithdrawRequestAction(data: {
  requestId: number
  status: "pending" | "paid" | "rejected"
  paymentMethod?: string
  transactionId?: string
  adminNote?: string
}) {
  const { processWithdrawRequestAdmin } = await import("@/services/seller-service")
  return await processWithdrawRequestAdmin(data)
}

export async function createSellerWithdrawAction(data: {
  shopId: number
  userId: string
  amount: number
  message: string
  paymentMethod: string
}) {
  const { createSellerWithdrawRequest } = await import("@/services/seller-service")
  return await createSellerWithdrawRequest(data)
}

export async function updateTicketStatusAction(ticketId: number, status: string) {
  const { updateTicketStatus } = await import("@/services/ticket-service")
  return await updateTicketStatus(ticketId, status)
}

export async function createBlogAction(data: {
  title: string
  slug: string
  categoryId?: number
  shortDescription: string
  description: string
  banner?: string
  metaTitle?: string
  metaDescription?: string
}) {
  const { createBlog } = await import("@/services/blog-service")
  return await createBlog(data)
}

export async function toggleBlogStatusAction(id: number, status: boolean) {
  const { toggleBlogStatus } = await import("@/services/blog-service")
  return await toggleBlogStatus(id, status)
}

export async function deleteBlogAction(id: number) {
  const { deleteBlog } = await import("@/services/blog-service")
  return await deleteBlog(id)
}

export async function updateOrderStatusAction(data: {
  orderId: string
  deliveryStatus?: string
  paymentStatus?: string
  shippingMethod?: string
  courierTrackingCode?: string
}) {
  const { updateOrderStatusAdmin } = await import("@/services/order-service")
  return await updateOrderStatusAdmin(data)
}

export async function submitReviewAction(data: {
  productId: number
  userId?: string
  userName: string
  rating: number
  comment: string
  photos?: string[]
}) {
  const { submitReview } = await import("@/services/review-service")
  return await submitReview(data)
}

export async function toggleReviewStatusAction(id: number, status: boolean) {
  const { toggleReviewStatus } = await import("@/services/review-service")
  return await toggleReviewStatus(id, status)
}

export async function deleteReviewAction(id: number) {
  const { deleteReview } = await import("@/services/review-service")
  return await deleteReview(id)
}

export async function sendMessageAction(data: {
  conversationId: string
  senderId: string
  message: string
}) {
  const { sendMessage } = await import("@/services/conversation-service")
  return await sendMessage(data)
}

