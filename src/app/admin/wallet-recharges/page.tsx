import React from "react"
import { getAllWalletRechargesAdmin } from "@/services/wallet-service"
import { WalletRechargesAdminView } from "./_components/wallet-recharges-admin-view"

export const metadata = {
  title: "Offline Wallet Recharges Desk | Admin Panel",
}

export default async function AdminWalletRechargesPage() {
  const recharges = await getAllWalletRechargesAdmin()

  return <WalletRechargesAdminView initialRecharges={recharges} />
}
