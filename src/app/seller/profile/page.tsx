import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentSeller, getSellerShop, getSellerAddresses } from "@/services/seller-panel-service"
import { getServerSession } from "@/lib/auth/session-helper"
import { SellerProfileView } from "./_components/seller-profile-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Manage Profile | Seller Dashboard",
  description: "Configure seller identity, payout bank settings, addresses, and login credentials",
}

export default async function SellerProfilePage() {
  const [seller, session] = await Promise.all([getCurrentSeller(), getServerSession()])

  if (!seller) {
    redirect("/seller/login")
  }

  const [shop, addresses] = await Promise.all([
    getSellerShop(seller.shopId),
    seller.userId ? getSellerAddresses(seller.userId) : [],
  ])

  return (
    <div className="aiz-user-panel p-4 md:p-6 space-y-6">
      <SellerProfileView
        shop={shop}
        initialAddresses={addresses}
        sessionUser={session?.user || null}
      />
    </div>
  )
}
