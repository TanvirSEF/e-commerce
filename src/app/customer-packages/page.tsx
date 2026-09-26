import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getAllCustomerPackages } from "@/services/package-service"
import { CustomerPackagesClientView } from "../dashboard/customer-packages/_components/customer-packages-client-view"

export const metadata: Metadata = {
  title: "Premium Packages for Customers | Active eCommerce",
  description: "Upgrade your account with customer packages for posting classified ads and products.",
}

export default async function PublicCustomerPackagesPage() {
  const packages = await getAllCustomerPackages()
  const activePackages = packages.filter((p) => p.status)

  return (
    <div className="bg-[#f2f3f8] min-h-screen pb-12">
      {/* Top Banner (Active eCommerce 1:1) */}
      <section className="py-8 bg-[#d43533] text-white">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Premium Packages for Customers
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-red-100">
            Choose the best plan to list your items and maximize buyer reach across our marketplace
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 max-w-5xl py-4">
        <nav className="flex items-center space-x-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#d43533] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-gray-800">&quot;Customer Packages&quot;</span>
        </nav>
      </div>

      {/* Main Packages Grid */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white border border-gray-200 shadow-sm p-6 sm:p-10 rounded-lg">
          <CustomerPackagesClientView packages={activePackages} />
        </div>
      </div>
    </div>
  )
}
