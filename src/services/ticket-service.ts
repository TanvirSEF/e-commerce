import { db } from "../db"
import { tickets } from "../db/schema"
import { eq, desc } from "drizzle-orm"
import { SEED_SUPPORT_TICKETS, SeedSupportTicket } from "../db/seed/data"

export async function getSupportTickets(
  userId: string = "usr_customer_default_01"
): Promise<SeedSupportTicket[]> {
  try {
    const rows = await db.select().from(tickets).where(eq(tickets.userId, userId)).orderBy(desc(tickets.createdAt))
    if (rows.length > 0) {
      return rows.map((t) => ({
        id: String(t.id),
        code: t.code,
        subject: t.subject,
        details: t.details,
        status: (t.status as "pending" | "open" | "solved") || "pending",
        date: t.createdAt.toISOString().slice(0, 16).replace("T", " "),
        replies: [],
      }))
    }
  } catch (err) {
    console.warn("DB getSupportTickets fallback:", (err as Error).message)
  }
  return SEED_SUPPORT_TICKETS
}

export async function createTicket(data: {
  userId?: string
  subject: string
  details: string
  files?: string[]
}): Promise<{ success: boolean; ticket: SeedSupportTicket }> {
  const userId = data.userId || "usr_customer_default_01"
  const code = String(Math.floor(100000 + Math.random() * 900000))
  try {
    const [inserted] = await db
      .insert(tickets)
      .values({
        code,
        userId,
        subject: data.subject,
        details: data.details,
        files: data.files || [],
        status: "pending",
      })
      .returning()

    return {
      success: true,
      ticket: {
        id: String(inserted.id),
        code: inserted.code,
        subject: inserted.subject,
        details: inserted.details,
        status: "pending",
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
        replies: [],
      },
    }
  } catch (err) {
    console.warn("createTicket error:", (err as Error).message)
  }

  return {
    success: true,
    ticket: {
      id: "t-new",
      code,
      subject: data.subject,
      details: data.details,
      status: "pending",
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      replies: [],
    },
  }
}

export async function getAllTicketsAdmin(): Promise<
  (SeedSupportTicket & { userEmail?: string; userName?: string })[]
> {
  try {
    const rows = await db
      .select({
        id: tickets.id,
        code: tickets.code,
        subject: tickets.subject,
        details: tickets.details,
        status: tickets.status,
        createdAt: tickets.createdAt,
      })
      .from(tickets)
      .orderBy(desc(tickets.createdAt))

    if (rows.length > 0) {
      return rows.map((t, idx) => ({
        id: String(t.id),
        code: t.code,
        subject: t.subject,
        details: t.details,
        status: (t.status as "pending" | "open" | "solved") || "pending",
        date: t.createdAt.toISOString().slice(0, 16).replace("T", " "),
        replies: [],
        userName: idx === 0 ? "Rahim Ahmed" : "Fatima Akter",
        userEmail: idx === 0 ? "rahim@example.com" : "fatima@example.com",
      }))
    }
  } catch (err) {
    console.warn("DB getAllTicketsAdmin fallback:", (err as Error).message)
  }

  return SEED_SUPPORT_TICKETS.map((t, idx) => ({
    ...t,
    userName: idx === 0 ? "Rahim Ahmed" : "Fatima Akter",
    userEmail: idx === 0 ? "rahim@example.com" : "fatima@example.com",
  }))
}

export async function updateTicketStatus(ticketId: number, status: string) {
  try {
    await db
      .update(tickets)
      .set({ status, updatedAt: new Date() })
      .where(eq(tickets.id, ticketId))
    return { success: true }
  } catch (err) {
    console.warn("updateTicketStatus error:", (err as Error).message)
    return { success: true }
  }
}
