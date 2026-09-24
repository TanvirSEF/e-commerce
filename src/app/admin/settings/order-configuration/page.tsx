import React from "react"
import { Metadata } from "next"
import { getOrderRules } from "@/services/order-rules-service"
import { OrderConfigView } from "./_components/order-config-view"

export const metadata: Metadata = {
  title: "Order Configuration | Admin Dashboard",
  description: "Configure minimum cart totals, cancellation rules, and invoice prefixes",
}

export default async function AdminOrderConfigPage() {
  const rules = await getOrderRules()

  return (
    <div className="p-4 md:p-6">
      <OrderConfigView initialRules={rules} />
    </div>
  )
}
