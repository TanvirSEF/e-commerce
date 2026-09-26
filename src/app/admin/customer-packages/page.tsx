import React from "react"
import { Metadata } from "next"
import { getAllCustomerPackages } from "@/services/package-service"
import { CustomerPackagesView } from "./_components/customer-packages-view"

export const metadata: Metadata = {
  title: "Customer Packages | Admin Dashboard",
  description: "Configure classified ad packages for customers",
}

export default async function AdminCustomerPackagesPage() {
  const packages = await getAllCustomerPackages()

  return (
    <div className="p-4 md:p-6">
      <CustomerPackagesView initialPackages={packages} />
    </div>
  )
}
