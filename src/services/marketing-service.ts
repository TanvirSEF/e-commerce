import { db } from "../db"
import { subscribers, newsletterBroadcasts } from "../db/schema"
import { eq, desc } from "drizzle-orm"

export interface SubscriberItem {
  id: number
  email: string
  date: string
}

export interface NewsletterLogItem {
  id: number
  subject: string
  content: string
  recipientCount: number
  date: string
}

export async function getSubscribers(): Promise<SubscriberItem[]> {
  try {
    const rows = await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.id))

    return rows.map((s) => ({
      id: s.id,
      email: s.email,
      date: s.createdAt ? s.createdAt.toISOString().slice(0, 10) : "",
    }))
  } catch (err) {
    console.warn("DB getSubscribers error:", (err as Error).message)
    return []
  }
}

export async function addSubscriber(email: string) {
  try {
    const [row] = await db
      .insert(subscribers)
      .values({ email })
      .onConflictDoNothing()
      .returning()
    return { success: true, item: row }
  } catch (err) {
    console.warn("addSubscriber error:", (err as Error).message)
    return { success: false }
  }
}

export async function deleteSubscriber(id: number) {
  try {
    await db.delete(subscribers).where(eq(subscribers.id, id))
    return { success: true }
  } catch (err) {
    console.warn("deleteSubscriber error:", (err as Error).message)
    return { success: false }
  }
}

export async function sendNewsletterBroadcast(data: {
  subject: string
  content: string
  audience?: string
  recipientCount?: number
}) {
  try {
    const [row] = await db
      .insert(newsletterBroadcasts)
      .values({
        subject: data.subject,
        content: data.content,
        recipientCount: data.recipientCount || 0,
      })
      .returning()
    return { success: true, item: row, recipientCount: data.recipientCount || 0 }
  } catch (err) {
    console.warn("sendNewsletterBroadcast error:", (err as Error).message)
    return { success: false, recipientCount: 0 }
  }
}

export async function recordNewsletterBroadcast(data: {
  subject: string
  content: string
  audience: string
  recipientCount: number
}) {
  try {
    const [row] = await db
      .insert(newsletterBroadcasts)
      .values({
        subject: data.subject,
        content: data.content,
        recipientCount: data.recipientCount,
      })
      .returning()
    return { success: true, item: row }
  } catch (err) {
    console.warn("recordNewsletterBroadcast error:", (err as Error).message)
    return { success: false }
  }
}

export async function getNewsletterLogs(): Promise<NewsletterLogItem[]> {
  try {
    const rows = await db
      .select()
      .from(newsletterBroadcasts)
      .orderBy(desc(newsletterBroadcasts.id))

    return rows.map((r) => ({
      id: r.id,
      subject: r.subject,
      content: r.content,
      recipientCount: r.recipientCount,
      date: r.createdAt ? r.createdAt.toISOString().slice(0, 10) : "",
    }))
  } catch (err) {
    console.warn("getNewsletterLogs error:", (err as Error).message)
    return []
  }
}
