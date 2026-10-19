"use server"

import { revalidatePath } from "next/cache"
import {
  getAdminOrdersList,
  updateOrderQuickManagement,
  approveOfflinePayment,
  deleteAdminOrder,
  bulkDeleteAdminOrders,
  type GetAdminOrdersParams,
  type AdminOrdersResponse,
} from "@/services/admin-orders-service"

export async function fetchAdminOrdersAction(
  params: GetAdminOrdersParams
): Promise<AdminOrdersResponse> {
  return await getAdminOrdersList(params)
}

export async function updateOrderQuickManagementAction(
  orderId: number,
  data: { deliveryStatus: string; paymentStatus: string }
): Promise<boolean> {
  const success = await updateOrderQuickManagement(orderId, data)
  if (success) {
    if (data.deliveryStatus === "delivered") {
      try {
        const { awardOrderClubPoints } = await import("@/services/wallet-service")
        await awardOrderClubPoints(orderId)
      } catch (err) {
        console.error("Failed to auto-award club points on delivery:", err)
      }
    }

    try {
      revalidatePath("/dashboard/club-points")
      revalidatePath("/dashboard/wallet")
      revalidatePath("/wallet")
      revalidatePath("/admin/orders")
      revalidatePath("/admin/orders/offline-payments")
      revalidatePath("/admin/offline-payment-orders")
      revalidatePath("/seller/orders")
      revalidatePath("/dashboard")
      revalidatePath("/purchase-history")
      revalidatePath("/purchase_history")
      revalidatePath("/track-order")
      revalidatePath("/track-your-order")
    } catch {}
  }
  return success
}

export async function approveOfflinePaymentAction(orderId: number): Promise<boolean> {
  const success = await approveOfflinePayment(orderId)
  if (success) {
    try {
      revalidatePath("/admin/orders")
      revalidatePath("/admin/orders/offline-payments")
      revalidatePath("/admin/offline-payment-orders")
      revalidatePath("/seller/orders")
      revalidatePath("/dashboard")
      revalidatePath("/purchase-history")
      revalidatePath("/purchase_history")
      revalidatePath("/track-order")
      revalidatePath("/track-your-order")
    } catch {}
  }
  return success
}

export async function deleteAdminOrderAction(orderId: number): Promise<boolean> {
  const success = await deleteAdminOrder(orderId)
  if (success) {
    try {
      revalidatePath("/admin/orders")
      revalidatePath("/admin/orders/offline-payments")
      revalidatePath("/admin/offline-payment-orders")
      revalidatePath("/seller/orders")
      revalidatePath("/dashboard")
      revalidatePath("/purchase-history")
      revalidatePath("/purchase_history")
    } catch {}
  }
  return success
}

export async function bulkDeleteAdminOrdersAction(orderIds: number[]): Promise<boolean> {
  const success = await bulkDeleteAdminOrders(orderIds)
  if (success) {
    try {
      revalidatePath("/admin/orders")
      revalidatePath("/admin/orders/offline-payments")
      revalidatePath("/admin/offline-payment-orders")
      revalidatePath("/seller/orders")
      revalidatePath("/dashboard")
      revalidatePath("/purchase-history")
      revalidatePath("/purchase_history")
    } catch {}
  }
  return success
}
