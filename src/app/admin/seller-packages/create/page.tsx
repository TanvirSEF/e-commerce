import React from "react"
import { Metadata } from "next"
import { SellerPackageCreateView } from "./_components/seller-package-create-view"

export const metadata: Metadata = {
  title: "Create Seller Package | Admin Dashboard",
  description: "Set up a new seller subscription tier",
}

export default function AdminSellerPackageCreatePage() {
  return (
    <div className="p-4 md:p-6">
      <SellerPackageCreateView />
    </div>
  )
}
