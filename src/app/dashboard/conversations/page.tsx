import React from "react"
import { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { getUserConversations } from "@/services/conversation-service"
import { ConversationsView } from "./_components/conversations-view"

export const metadata: Metadata = {
  title: "Conversations | Active eCommerce",
  description: "View and manage your merchant inquiries and message history.",
}

export const dynamic = "force-dynamic"

export default async function CustomerConversationsPage() {
  let currentUserId = "usr_customer_default_01"
  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    if (session?.user?.id) {
      currentUserId = session.user.id
    }
  } catch {
    // fallback
  }

  const conversations = await getUserConversations(currentUserId)

  return <ConversationsView initialConversations={conversations} />
}
