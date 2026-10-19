"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { sendMessage } from "@/services/conversation-service"

export async function sendConversationMessageAction(
  conversationId: number,
  messageText: string
): Promise<{ success: boolean; message?: string }> {
  try {
    if (!messageText.trim()) {
      return { success: false, message: "Message cannot be empty" }
    }

    let userId = "usr_customer_default_01"
    try {
      const h = await headers()
      const session = await auth.api.getSession({ headers: h })
      if (session?.user?.id) {
        userId = session.user.id
      }
    } catch {
      // fallback
    }

    const ok = await sendMessage({
      conversationId,
      senderId: userId,
      message: messageText.trim(),
    })

    try {
      revalidatePath("/dashboard/conversations")
      revalidatePath(`/dashboard/conversations/${conversationId}`)
      revalidatePath("/seller/conversations")
    } catch {}
    return { success: ok }
  } catch (err) {
    console.error("sendConversationMessageAction error:", err)
    return { success: false, message: "Failed to send message" }
  }
}

export async function fetchConversationMessagesAction(
  conversationId: number
): Promise<{ success: boolean; messages: any[] }> {
  try {
    let userId = "usr_customer_default_01"
    try {
      const h = await headers()
      const session = await auth.api.getSession({ headers: h })
      if (session?.user?.id) {
        userId = session.user.id
      }
    } catch {}

    const { getConversationDetails } = await import("@/services/conversation-service")
    const { messages } = await getConversationDetails(conversationId, userId)
    return { success: true, messages }
  } catch (err) {
    console.error("fetchConversationMessagesAction error:", err)
    return { success: false, messages: [] }
  }
}

export async function refreshUserConversationsAction(): Promise<{
  success: boolean
  conversations: any[]
}> {
  try {
    let userId = "usr_customer_default_01"
    try {
      const h = await headers()
      const session = await auth.api.getSession({ headers: h })
      if (session?.user?.id) {
        userId = session.user.id
      }
    } catch {}

    const { getUserConversations } = await import("@/services/conversation-service")
    const convs = await getUserConversations(userId)
    return { success: true, conversations: convs }
  } catch (err) {
    console.error("refreshUserConversationsAction error:", err)
    return { success: false, conversations: [] }
  }
}
