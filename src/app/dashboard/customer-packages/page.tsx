import React from "react"
import { Metadata } from "next"
import { getAllCustomerPackages } from "@/services/package-service"
import { CustomerPackagesClientView } from "./_components/customer-packages-client-view"

export const metadata: Metadata = {
  title: "Classified Packages | Customer Portal",
  description: "Upgrade your customer account with classified listing packages",
}

export default async function CustomerPackagesPage() {
  const packages = await getAllCustomerPackages()

  return (
    <div className="p-4 md:p-6">
      <CustomerPackagesClientView packages={packages.filter((p) => p.status)} />
    </div>
  )
}
