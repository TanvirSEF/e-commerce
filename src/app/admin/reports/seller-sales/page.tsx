import React from "react"
import { Metadata } from "next"
import { getSellerSalesReport } from "@/services/report-service"
import { SellerSalesView } from "./_components/seller-sales-view"

export const metadata: Metadata = {
  title: "Seller Based Selling Report | Active eCommerce Admin",
}

interface PageProps {
  searchParams: Promise<{ verification_status?: string }>
}

export default async function AdminSellerSalesReportPage({ searchParams }: PageProps) {
  const { verification_status } = await searchParams
  const report = await getSellerSalesReport(verification_status)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <SellerSalesView initialReport={report} currentFilter={verification_status} />
    </div>
  )
}
