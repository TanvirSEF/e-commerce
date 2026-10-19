import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/session-helper"
import { getCustomerPreorderOrders } from "@/services/preorder-service"
import { CustomerPreordersView } from "./_components/customer-preorders-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "My Pre-Orders | Active eCommerce Customer Portal",
  description: "View and track your upcoming product pre-orders, deposit status, and remaining balance.",
}

export default async function CustomerPreorderPage() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    redirect("/login")
  }

  const orders = await getCustomerPreorderOrders(session.user.email)

  return <CustomerPreordersView orders={orders} />
}
