import React from "react"
import { Metadata } from "next"
import { getAllSellerPackagePayments } from "@/services/package-service"
import { SellerPackagePaymentsView } from "./_components/seller-package-payments-view"

export const metadata: Metadata = {
  title: "Package Payments History | Admin Dashboard",
  description: "View history of seller membership payments",
}

export default async function AdminSellerPackagePaymentsPage() {
  const payments = await getAllSellerPackagePayments()

  return (
    <div className="p-4 md:p-6">
      <SellerPackagePaymentsView initialPayments={payments} />
    </div>
  )
}
