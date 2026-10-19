"use server"

import { revalidatePath } from "next/cache"
import { banToggleCustomer, suspiciousToggleCustomer, deleteCustomer } from "@/services/customer-service"

export async function banToggleCustomerAction(userId: string) {
  const result = await banToggleCustomer(userId)
  try {
    revalidatePath("/admin/customers")
  } catch {}
  return result
}

export async function suspiciousToggleCustomerAction(userId: string) {
  const result = await suspiciousToggleCustomer(userId)
  try {
    revalidatePath("/admin/customers")
  } catch {}
  return result
}

export async function deleteCustomerAction(userId: string) {
  await deleteCustomer(userId)
  try {
    revalidatePath("/admin/customers")
  } catch {}
  return { success: true }
}

export async function adminRechargeWalletAction(data: {
  userId: string
  amount: number
  trxId: string
  paymentMethod: string
}) {
  const { rechargeWallet } = await import("@/services/wallet-service")
  const result = await rechargeWallet({
    userId: data.userId,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    paymentDetails: `TrxID: ${data.trxId}`,
    offlinePayment: false,
    addedBy: "admin",
  })
  try {
    revalidatePath("/admin/customers")
    revalidatePath("/admin/wallet-recharges")
  } catch {}
  return result
}

export async function bulkDeleteCustomersAction(userIds: string[]) {
  const { bulkDeleteCustomers } = await import("@/services/customer-service")
  const success = await bulkDeleteCustomers(userIds)
  try {
    revalidatePath("/admin/customers")
  } catch {}
  return { success }
}

export async function bulkBanCustomersAction(userIds: string[], banned: boolean) {
  const { bulkBanCustomers } = await import("@/services/customer-service")
  const success = await bulkBanCustomers(userIds, banned)
  try {
    revalidatePath("/admin/customers")
  } catch {}
  return { success }
}

export async function createCustomerAdminAction(data: {
  name: string
  email: string
  phone?: string
  password?: string
}) {
  const { createCustomerAdmin } = await import("@/services/customer-service")
  const result = await createCustomerAdmin(data)
  try {
    revalidatePath("/admin/customers")
  } catch {}
  return result
}
