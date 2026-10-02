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

    revalidatePath("/dashboard/conversations")
    revalidatePath(`/dashboard/conversations/${conversationId}`)
    return { success: ok }
  } catch (err) {
    console.error("sendConversationMessageAction error:", err)
    return { success: false, message: "Failed to send message" }
  }
}
