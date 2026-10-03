import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerFullDashboardData } from "@/services/seller-service"
import { getSellerOrderById } from "@/services/order-service"
import { SellerOrderDetailsView } from "./_components/seller-order-details-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Order Details | Seller Portal",
}

interface SellerOrderPageProps {
  params: Promise<{ id: string }>
}

export default async function SellerOrderDetailsPage({ params }: SellerOrderPageProps) {
  const { id } = await params
  const session = await getServerSession()
  const sellerData = await getSellerFullDashboardData({
    userId: session?.user?.id,
  })

  const order = await getSellerOrderById(id, sellerData.shop.id)

  if (!order) {
    return (
      <div className="p-8 text-center bg-white rounded border border-gray-200 m-6">
        <h2 className="text-lg font-bold text-gray-800">Order Not Found</h2>
        <p className="text-xs text-gray-500 mt-1">The requested order #{id} does not exist or has been removed.</p>
        <Link
          href="/seller/orders"
          className="inline-block mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#d43533] rounded hover:bg-[#b82a28]"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <SellerOrderDetailsView order={order} />
    </div>
  )
}
