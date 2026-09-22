import React from "react"
import { getSellerConversations, getConversationMessages } from "@/services/conversation-service"
import { SellerConversationsView } from "./_components/seller-conversations-view"

export const metadata = {
  title: "Conversations | Seller Dashboard",
}

export default async function SellerConversationsPage() {
  const conversations = await getSellerConversations("active-fashion-outlet")
  const initialMessages =
    conversations.length > 0 ? await getConversationMessages(conversations[0].id) : []

  return (
    <SellerConversationsView
      initialConversations={conversations}
      initialMessages={initialMessages}
    />
  )
}
