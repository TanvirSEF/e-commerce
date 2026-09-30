"use server"

import { revalidatePath } from "next/cache"
import {
  processRefundAdmin,
  deleteRefundAdmin,
  createRefundRequest,
} from "@/services/refund-service"

export async function approveRefundAction(data: {
  requestId: string | number
  adminNote?: string
}) {
  const result = await processRefundAdmin({
    requestId: data.requestId,
    status: "approved",
    adminNote: data.adminNote?.trim() || "Approved and refunded to customer wallet.",
  })

  revalidatePath("/admin/refund-requests")
  return result
}

export async function rejectRefundAction(data: {
  requestId: string | number
  rejectReason?: string
  adminNote?: string
}) {
  const noteParts = [data.rejectReason, data.adminNote].filter(Boolean)
  const fullNote = noteParts.join(" - ") || "Product does not meet return policy criteria."

  const result = await processRefundAdmin({
    requestId: data.requestId,
    status: "rejected",
    adminNote: fullNote,
  })

  revalidatePath("/admin/refund-requests")
  return result
}

export async function deleteRefundAction(requestId: string | number) {
  const result = await deleteRefundAdmin(requestId)
  revalidatePath("/admin/refund-requests")
  return result
}

export async function createRefundRequestAction(data: {
  orderId?: number
  orderCode: string
  userId?: string
  productName: string
  userName: string
  shopId?: number
  shopName?: string
  amount: number
  reason: string
  details?: string
  attachment?: string
}) {
  const result = await createRefundRequest(data)
  revalidatePath("/admin/refund-requests")
  return result
}
