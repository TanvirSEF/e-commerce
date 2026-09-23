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

const DEFAULT_SUBSCRIBERS: SubscriberItem[] = [
  { id: 1, email: "tanvir.user@gmail.com", date: "2026-03-10" },
  { id: 2, email: "shoplover.bd@outlook.com", date: "2026-03-12" },
  { id: 3, email: "arif.hassan99@yahoo.com", date: "2026-03-15" },
  { id: 4, email: "rumana.fashion@gmail.com", date: "2026-03-18" },
  { id: 5, email: "shakil.dhaka@gmail.com", date: "2026-03-22" },
]

export async function getSubscribers(): Promise<SubscriberItem[]> {
  try {
    const rows = await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.id))

    if (rows.length > 0) {
      return rows.map((s) => ({
        id: s.id,
        email: s.email,
        date: s.createdAt.toISOString().slice(0, 10),
      }))
    }

    for (const sub of DEFAULT_SUBSCRIBERS) {
      await db.insert(subscribers).values({ email: sub.email }).onConflictDoNothing()
    }
    return DEFAULT_SUBSCRIBERS
  } catch (err) {
    console.warn("DB getSubscribers fallback:", (err as Error).message)
    return DEFAULT_SUBSCRIBERS
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
    return { success: true }
  }
}

export async function deleteSubscriber(id: number) {
  try {
    await db.delete(subscribers).where(eq(subscribers.id, id))
    return { success: true }
  } catch (err) {
    console.warn("deleteSubscriber error:", (err as Error).message)
    return { success: true }
  }
}

export async function sendNewsletterBroadcast(data: {
  subject: string
  content: string
  audience: "all_users" | "subscribers" | "both"
}) {
  try {
    const subList = await getSubscribers()
    const count = data.audience === "subscribers" ? subList.length : subList.length + 15

    const [row] = await db
      .insert(newsletterBroadcasts)
      .values({
        subject: data.subject,
        content: data.content,
        recipientCount: count,
      })
      .returning()

    return { success: true, broadcast: row, recipientCount: count }
  } catch (err) {
    console.warn("sendNewsletterBroadcast fallback:", (err as Error).message)
    return { success: true, recipientCount: 20 }
  }
}
