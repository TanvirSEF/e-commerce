import { db } from "../db"
import { customNotifications, type CustomNotification } from "../db/schema"
import { desc } from "drizzle-orm"

const SEED_NOTIFICATIONS: CustomNotification[] = [
  {
    id: 1,
    title: "Weekend Flash Mega Sale Announcement",
    content: "Up to 50% discount on all electronics and fashion items this weekend only!",
    link: "https://active-ecommerce.test/flash-deals",
    notificationType: "Promotional",
    recipientCount: 1540,
    createdAt: new Date("2026-03-15 10:00:00"),
  },
  {
    id: 2,
    title: "System Maintenance Completed",
    content: "Our servers have been upgraded for faster checkout speeds. Enjoy smooth shopping!",
    link: null,
    notificationType: "System Notice",
    recipientCount: 3200,
    createdAt: new Date("2026-03-01 14:30:00"),
  },
]

export async function getAllCustomNotifications(): Promise<CustomNotification[]> {
  try {
    const list = await db
      .select()
      .from(customNotifications)
      .orderBy(desc(customNotifications.createdAt))

    if (!list || list.length === 0) {
      return SEED_NOTIFICATIONS
    }
    return list
  } catch (error) {
    console.warn("DB getAllCustomNotifications fallback:", error)
    return SEED_NOTIFICATIONS
  }
}

export async function sendCustomNotification(data: {
  title: string
  content: string
  link?: string
  notificationType?: string
  recipientCount?: number
}): Promise<CustomNotification | null> {
  try {
    const [inserted] = await db
      .insert(customNotifications)
      .values({
        title: data.title,
        content: data.content,
        link: data.link || null,
        notificationType: data.notificationType || "General",
        recipientCount: data.recipientCount || 0,
      })
      .returning()
    return inserted || null
  } catch (error) {
    console.error("Failed to send custom notification:", error)
    return null
  }
}
