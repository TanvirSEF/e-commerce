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
    revalidatePath("/admin/orders")
    revalidatePath("/admin/orders/offline-payments")
    revalidatePath("/admin/offline-payment-orders")
  }
  return success
}

export async function approveOfflinePaymentAction(orderId: number): Promise<boolean> {
  const success = await approveOfflinePayment(orderId)
  if (success) {
    revalidatePath("/admin/orders")
    revalidatePath("/admin/orders/offline-payments")
    revalidatePath("/admin/offline-payment-orders")
  }
  return success
}

export async function deleteAdminOrderAction(orderId: number): Promise<boolean> {
  const success = await deleteAdminOrder(orderId)
  if (success) {
    revalidatePath("/admin/orders")
    revalidatePath("/admin/orders/offline-payments")
    revalidatePath("/admin/offline-payment-orders")
  }
  return success
}

export async function bulkDeleteAdminOrdersAction(orderIds: number[]): Promise<boolean> {
  const success = await bulkDeleteAdminOrders(orderIds)
  if (success) {
    revalidatePath("/admin/orders")
    revalidatePath("/admin/orders/offline-payments")
    revalidatePath("/admin/offline-payment-orders")
  }
  return success
}
