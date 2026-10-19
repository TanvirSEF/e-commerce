"use server"

import { revalidatePath } from "next/cache"
import { processWalletRechargeAdmin } from "@/services/wallet-service"

export async function approveWalletRechargeAction(id: number) {
  const result = await processWalletRechargeAdmin(id, true)
  revalidatePath("/admin/wallet-recharges")
  revalidatePath("/dashboard/wallet")
  revalidatePath("/dashboard")
  revalidatePath("/wallet")
  return result
}

export async function rejectWalletRechargeAction(id: number) {
  const result = await processWalletRechargeAdmin(id, false)
  revalidatePath("/admin/wallet-recharges")
  revalidatePath("/dashboard/wallet")
  revalidatePath("/dashboard")
  revalidatePath("/wallet")
  return result
}
