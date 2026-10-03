import React from "react"
import {
  getCurrentSeller,
  getSellerPayoutRequests,
  getSellerWalletSummary,
} from "@/services/seller-panel-service"
import { SellerPayoutsView } from "./_components/seller-payouts-view"

export const dynamic = "force-dynamic"
export const metadata = { title: "Payout Requests | Seller Dashboard" }

export default async function SellerPayoutsPage() {
  const seller = await getCurrentSeller()
  const [requests, wallet] = seller
    ? await Promise.all([getSellerPayoutRequests(seller.shopId), getSellerWalletSummary(seller)])
    : [[], { balance: 0, minimumWithdrawal: 0 }]

  return (
    <div className="p-4 md:p-6">
      <SellerPayoutsView
        initialRequests={requests}
        currentBalance={wallet.balance}
        minimumWithdrawal={wallet.minimumWithdrawal}
      />
    </div>
  )
}
