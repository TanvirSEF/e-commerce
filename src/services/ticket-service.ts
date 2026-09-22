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
