import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentSeller, getSellerConversationsList } from "@/services/seller-panel-service"
import { SellerConversationsView } from "./_components/seller-conversations-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Conversations | Seller Dashboard",
  description: "Chat with prospective buyers and storefront customers",
}

export default async function SellerConversationsPage() {
  const seller = await getCurrentSeller()
  if (!seller) {
    redirect("/seller/login")
  }

  const conversations = await getSellerConversationsList(seller)

  return (
    <div className="aiz-user-panel p-4 md:p-6 space-y-4">
      <SellerConversationsView initialConversations={conversations} />
    </div>
  )
}
