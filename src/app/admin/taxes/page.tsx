import React from "react"
import type { Metadata } from "next"
import { getAllTaxes } from "@/services/tax-service"
import { TaxesView } from "./_components/taxes-view"

export const metadata: Metadata = {
  title: "All Taxes | Admin | Active eCommerce",
  description: "Configure sales tax and VAT configurations in Active eCommerce CMS",
}

export default async function TaxesPage() {
  const taxes = await getAllTaxes()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <TaxesView taxes={taxes} />
    </div>
  )
}
