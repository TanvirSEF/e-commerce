"use server"

import { revalidatePath } from "next/cache"
import { banToggleCustomer, suspiciousToggleCustomer, deleteCustomer } from "@/services/customer-service"

export async function banToggleCustomerAction(userId: string) {
  const result = await banToggleCustomer(userId)
  revalidatePath("/admin/customers")
  return result
}

export async function suspiciousToggleCustomerAction(userId: string) {
  const result = await suspiciousToggleCustomer(userId)
  revalidatePath("/admin/customers")
  return result
}

export async function deleteCustomerAction(userId: string) {
  await deleteCustomer(userId)
  revalidatePath("/admin/customers")
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
  })
  revalidatePath("/admin/customers")
  revalidatePath("/admin/wallet-recharges")
  return result
}
