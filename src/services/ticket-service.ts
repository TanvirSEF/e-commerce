import { db } from "../db"
import { tickets, ticketReplies, users } from "../db/schema"
import { eq, desc, asc, ilike, or, and, sql, count } from "drizzle-orm"
import type { AdminTicketItem, AdminTicketDetail, AdminTicketsResponse } from "@/types/ticket"

export * from "@/types/ticket"

/**
 * 1:1 Active eCommerce Admin Ticket List Query
 */
export async function getAllTicketsAdmin(params?: {
  search?: string
  status?: string
}): Promise<AdminTicketsResponse> {
  try {
    const search = params?.search?.trim()
    const statusFilter = params?.status && params.status !== "all" ? params.status : null

    const whereConditions = []
    if (search) {
      whereConditions.push(
        or(ilike(tickets.code, `%${search}%`), ilike(tickets.subject, `%${search}%`), ilike(users.name, `%${search}%`))
      )
    }
    if (statusFilter) whereConditions.push(eq(tickets.status, statusFilter))

    const rows = await db
      .select({
        id: tickets.id, code: tickets.code, subject: tickets.subject, details: tickets.details,
        files: tickets.files, status: tickets.status, viewed: tickets.viewed, clientViewed: tickets.clientViewed,
        createdAt: tickets.createdAt, updatedAt: tickets.updatedAt,
        userName: users.name, userEmail: users.email, userImage: users.image,
      })
      .from(tickets)
      .leftJoin(users, eq(tickets.userId, users.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(tickets.createdAt))

    const ticketIds = rows.map((r) => r.id)
    const repliesMap = new Map<number, { lastReplyAt: string; count: number }>()

    if (ticketIds.length > 0) {
      const allReplies = await db
        .select({ ticketId: ticketReplies.ticketId, createdAt: ticketReplies.createdAt })
        .from(ticketReplies)
        .where(sql`${ticketReplies.ticketId} IN ${ticketIds}`)
        .orderBy(desc(ticketReplies.createdAt))

      for (const rep of allReplies) {
        const existing = repliesMap.get(rep.ticketId)
        if (!existing) {
          repliesMap.set(rep.ticketId, {
            lastReplyAt: rep.createdAt.toISOString().slice(0, 19).replace("T", " "),
            count: 1,
          })
        } else {
          existing.count += 1
        }
      }
    }

    const statusCountsRaw = await db
      .select({ status: tickets.status, count: count() })
      .from(tickets)
      .groupBy(tickets.status)

    let pendingCount = 0, openCount = 0, solvedCount = 0
    for (const sc of statusCountsRaw) {
      const cnt = Number(sc.count)
      if (sc.status === "pending") pendingCount = cnt
      else if (sc.status === "open") openCount = cnt
      else if (sc.status === "solved") solvedCount = cnt
    }

    const items: AdminTicketItem[] = rows.map((row) => {
      const repInfo = repliesMap.get(row.id)
      const createdAtFormatted = row.createdAt.toISOString().slice(0, 19).replace("T", " ")
      return {
        id: row.id,
        code: row.code,
        subject: row.subject,
        details: row.details,
        files: (row.files as string[]) || [],
        status: (row.status as "pending" | "open" | "solved") || "pending",
        viewed: Boolean(row.viewed),
        clientViewed: Boolean(row.clientViewed),
        createdAt: createdAtFormatted,
        updatedAt: row.updatedAt.toISOString().slice(0, 19).replace("T", " "),
        userName: row.userName || "Customer",
        userEmail: row.userEmail || "",
        userImage: row.userImage || null,
        lastReplyAt: repInfo?.lastReplyAt || createdAtFormatted,
        replyCount: repInfo?.count || 0,
      }
    })

    return {
      tickets: items,
      total: pendingCount + openCount + solvedCount,
      pendingCount,
      openCount,
      solvedCount,
    }
  } catch (err) {
    console.error("Error in getAllTicketsAdmin:", err)
    return { tickets: [], total: 0, pendingCount: 0, openCount: 0, solvedCount: 0 }
  }
}

/**
 * 1:1 Active eCommerce Admin Ticket Show Query
 */
export async function getTicketByIdAdmin(ticketId: number): Promise<AdminTicketDetail | null> {
  try {
    const [row] = await db
      .select({
        id: tickets.id, code: tickets.code, subject: tickets.subject, details: tickets.details,
        files: tickets.files, status: tickets.status, viewed: tickets.viewed, clientViewed: tickets.clientViewed,
        createdAt: tickets.createdAt, updatedAt: tickets.updatedAt,
        userName: users.name, userEmail: users.email, userImage: users.image,
      })
      .from(tickets)
      .leftJoin(users, eq(tickets.userId, users.id))
      .where(eq(tickets.id, ticketId))

    if (!row) return null

    if (!row.viewed) {
      await db.update(tickets).set({ viewed: true, updatedAt: new Date() }).where(eq(tickets.id, ticketId))
    }

    const replyRows = await db
      .select({
        id: ticketReplies.id, ticketId: ticketReplies.ticketId, userId: ticketReplies.userId,
        reply: ticketReplies.reply, files: ticketReplies.files, createdAt: ticketReplies.createdAt,
        authorName: users.name, authorRole: users.role, authorImage: users.image,
      })
      .from(ticketReplies)
      .leftJoin(users, eq(ticketReplies.userId, users.id))
      .where(eq(ticketReplies.ticketId, ticketId))
      .orderBy(asc(ticketReplies.createdAt))

    const createdAtFormatted = row.createdAt.toISOString().slice(0, 19).replace("T", " ")
    const replies = replyRows.map((r) => ({
      id: r.id,
      ticketId: r.ticketId,
      userId: r.userId,
      reply: r.reply,
      files: (r.files as string[]) || [],
      createdAt: r.createdAt.toISOString().slice(0, 19).replace("T", " "),
      authorName: r.authorName || "Staff Support Agent",
      authorRole: r.authorRole || "support",
      authorImage: r.authorImage || null,
    }))

    return {
      id: row.id,
      code: row.code,
      subject: row.subject,
      details: row.details,
      files: (row.files as string[]) || [],
      status: (row.status as "pending" | "open" | "solved") || "pending",
      viewed: true,
      clientViewed: Boolean(row.clientViewed),
      createdAt: createdAtFormatted,
      updatedAt: row.updatedAt.toISOString().slice(0, 19).replace("T", " "),
      userName: row.userName || "Customer",
      userEmail: row.userEmail || "",
      userImage: row.userImage || null,
      lastReplyAt: replies.length > 0 ? replies[replies.length - 1].createdAt : createdAtFormatted,
      replyCount: replies.length,
      replies,
    }
  } catch (err) {
    console.error("Error in getTicketByIdAdmin:", err)
    return null
  }
}

/**
 * 1:1 Active eCommerce Admin Store Reply
 */
export async function createTicketReplyAdmin(data: {
  ticketId: number
  adminUserId?: string
  reply: string
  files?: string[]
  status: string
}) {
  const [inserted] = await db
    .insert(ticketReplies)
    .values({
      ticketId: data.ticketId,
      userId: data.adminUserId || "usr_admin_default_01",
      reply: data.reply,
      files: data.files || [],
    })
    .returning()

  await db
    .update(tickets)
    .set({
      status: data.status,
      clientViewed: false,
      updatedAt: new Date(),
    })
    .where(eq(tickets.id, data.ticketId))

  return { success: true, replyId: inserted.id }
}

/**
 * Update ticket status directly
 */
export async function updateTicketStatus(ticketId: number, status: string) {
  try {
    await db.update(tickets).set({ status, updatedAt: new Date() }).where(eq(tickets.id, ticketId))
    return { success: true }
  } catch (err) {
    console.error("updateTicketStatus error:", err)
    return { success: false }
  }
}

/**
 * Customer / Frontend support tickets query
 */
export async function getSupportTickets(userId?: string) {
  try {
    const whereClause = userId ? eq(tickets.userId, userId) : undefined
    const rows = await db.select().from(tickets).where(whereClause).orderBy(desc(tickets.createdAt))

    return rows.map((t) => ({
      id: String(t.id),
      code: t.code,
      subject: t.subject,
      details: t.details,
      status: (t.status as "pending" | "open" | "solved") || "pending",
      date: t.createdAt.toISOString().slice(0, 16).replace("T", " "),
      replies: [],
    }))
  } catch (err) {
    console.error("getSupportTickets error:", err)
    return []
  }
}

/**
 * Customer ticket creation
 */
export async function createTicket(data: {
  userId?: string
  subject: string
  details: string
  files?: string[]
}) {
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const [inserted] = await db
    .insert(tickets)
    .values({
      code,
      userId: data.userId || "usr_customer_default_01",
      subject: data.subject,
      details: data.details,
      files: data.files || [],
      status: "pending",
      viewed: false,
      clientViewed: true,
    })
    .returning()

  return {
    success: true,
    ticket: {
      id: String(inserted.id),
      code: inserted.code,
      subject: inserted.subject,
      details: inserted.details,
      status: "pending" as const,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      replies: [],
    },
  }
}
