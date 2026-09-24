import React from "react"
import type { Metadata } from "next"
import { getSaleAlertSettings } from "@/services/settings-service"
import { getProducts } from "@/services/product-service"
import { CustomSaleAlertsView } from "./_components/custom-sale-alerts-view"

export const metadata: Metadata = {
  title: "Custom Sale Alert Products | Admin | Active eCommerce",
  description: "Configure floating social proof sale alerts in Active eCommerce CMS",
}

export default async function CustomSaleAlertsPage() {
  const [settings, { data: products }] = await Promise.all([
    getSaleAlertSettings(),
    getProducts({ limit: 100 }),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CustomSaleAlertsView
        initialSettings={settings}
        products={products.map((p) => ({
          id: Number(p.id),
          name: p.name,
          thumbnailImg: p.thumbnail,
        }))}
      />
    </div>
  )
}
