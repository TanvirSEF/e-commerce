import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { getConversationDetails } from "@/services/conversation-service"
import { ConversationThreadView } from "./_components/conversation-thread-view"

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const numericId = parseInt(id, 10)
  if (isNaN(numericId)) return { title: "Conversation | Active eCommerce" }

  const data = await getConversationDetails(numericId)
  return {
    title: data.conversation
      ? `${data.conversation.title} | Active eCommerce`
      : "Conversation | Active eCommerce",
  }
}

export default async function ConversationShowPage({ params }: PageProps) {
  const { id } = await params
  const numericId = parseInt(id, 10)
  if (isNaN(numericId)) notFound()

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

  const data = await getConversationDetails(numericId, currentUserId)
  if (!data.conversation) {
    notFound()
  }

  return (
    <ConversationThreadView
      conversation={data.conversation}
      initialMessages={data.messages}
      currentUserId={currentUserId}
    />
  )
}
