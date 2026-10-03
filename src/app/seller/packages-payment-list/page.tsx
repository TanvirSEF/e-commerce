import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentSeller, getSellerPackagePayments } from "@/services/seller-panel-service"
import { SellerPaymentListView } from "./_components/seller-payment-list-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Payment History | Seller Panel",
  description: "View history of vendor membership package payments",
}

export default async function SellerPackagePaymentListPage() {
  const seller = await getCurrentSeller()
  if (!seller) {
    redirect("/seller/login")
  }

  const payments = await getSellerPackagePayments(seller.shopId)

  return (
    <div className="aiz-user-panel p-4 md:p-6 space-y-4">
      <SellerPaymentListView initialPayments={payments} />
    </div>
  )
}
