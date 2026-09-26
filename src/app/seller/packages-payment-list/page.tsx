import React from "react"
import { Metadata } from "next"
import { getAllSellerPackagePayments } from "@/services/package-service"
import { SellerPaymentListView } from "./_components/seller-payment-list-view"

export const metadata: Metadata = {
  title: "Package Payment Invoices | Seller Central",
  description: "View history of vendor membership payments",
}

export default async function SellerPackagePaymentListPage() {
  const payments = await getAllSellerPackagePayments()

  return (
    <div className="p-4 md:p-6">
      <SellerPaymentListView initialPayments={payments} />
    </div>
  )
}
