import React from "react"
import { getPendingVerificationsAdmin } from "@/services/seller-service"
import { SellerVerificationAdminView } from "./_components/seller-verification-admin-view"

export const metadata = {
  title: "Seller Verification Desk | Active eCommerce Admin",
}

export default async function AdminSellerVerificationPage() {
  const verifications = await getPendingVerificationsAdmin()

  return <SellerVerificationAdminView initialVerifications={verifications} />
}
