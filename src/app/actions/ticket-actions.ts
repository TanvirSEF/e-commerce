"use server"

import { revalidatePath } from "next/cache"
import { createTicketReplyAdmin, updateTicketStatus } from "@/services/ticket-service"

export async function submitTicketReplyAction(data: {
  ticketId: number
  reply: string
  status: string
  files?: string[]
}) {
  try {
    if (!data.ticketId || !data.reply.trim()) {
      return { success: false, message: "Reply message cannot be empty." }
    }

    const res = await createTicketReplyAdmin({
      ticketId: data.ticketId,
      reply: data.reply.trim(),
      status: data.status || "open",
      files: data.files || [],
    })

    revalidatePath("/admin/support-tickets")
    revalidatePath(`/admin/support-tickets/${data.ticketId}`)
    revalidatePath("/dashboard/support-tickets")
    revalidatePath(`/dashboard/support-tickets/${data.ticketId}`)
    revalidatePath("/seller/support")

    return { success: true, message: "Reply has been sent successfully." }
  } catch (err) {
    console.error("submitTicketReplyAction error:", err)
    return { success: false, message: (err as Error).message || "Failed to submit reply." }
  }
}

export async function updateTicketStatusAction(ticketId: number, status: string) {
  try {
    const res = await updateTicketStatus(ticketId, status)
    revalidatePath("/admin/support-tickets")
    revalidatePath(`/admin/support-tickets/${ticketId}`)
    revalidatePath("/dashboard/support-tickets")
    revalidatePath(`/dashboard/support-tickets/${ticketId}`)
    revalidatePath("/seller/support")
    return res
  } catch (err) {
    console.error("updateTicketStatusAction error:", err)
    return { success: false }
  }
}
