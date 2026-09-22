import React from "react"
import { getUserConversations, getConversationMessages } from "@/services/conversation-service"
import { ConversationsView } from "./_components/conversations-view"

export const metadata = {
  title: "Conversations | Customer Portal",
}

export default async function CustomerConversationsPage() {
  const conversations = await getUserConversations()
  const initialMessages =
    conversations.length > 0 ? await getConversationMessages(conversations[0].id) : []

  return (
    <ConversationsView
      initialConversations={conversations}
      initialMessages={initialMessages}
    />
  )
}
