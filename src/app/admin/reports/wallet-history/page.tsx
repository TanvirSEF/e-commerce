import React from "react"
import { getAllWalletHistoryAdmin } from "@/services/wallet-service"
import { WalletHistoryReportView } from "./_components/wallet-history-report-view"

export const metadata = {
  title: "Customer Wallet Transaction History Report | Admin Panel",
}

export const dynamic = "force-dynamic"

export default async function AdminWalletHistoryReportPage() {
  const transactions = await getAllWalletHistoryAdmin()

  return <WalletHistoryReportView initialTransactions={transactions} />
}
