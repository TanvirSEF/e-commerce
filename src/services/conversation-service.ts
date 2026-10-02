import { db } from "../db"
import { conversations, messages, shops, users } from "../db/schema"
import { eq, desc, or, and, sql } from "drizzle-orm"

export interface MessageItem {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  message: string
  isSender: boolean
  date: string
  rawDate?: string
}

export interface ConversationItem {
  id: string
  title: string
  customerName: string
  customerEmail?: string
  shopId?: number
  shopName: string
  shopSlug: string
  shopLogo: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

export async function getUserConversations(userId?: string): Promise<ConversationItem[]> {
  try {
    if (!userId) return []

    const convRows = await db
      .select({
        id: conversations.id,
        title: conversations.title,
        senderId: conversations.senderId,
        receiverId: conversations.receiverId,
        shopId: conversations.shopId,
        shopName: shops.name,
        shopSlug: shops.slug,
        shopLogo: shops.logo,
        lastMessageAt: conversations.lastMessageAt,
      })
      .from(conversations)
      .leftJoin(shops, eq(conversations.shopId, shops.id))
      .where(or(eq(conversations.senderId, userId), eq(conversations.receiverId, userId)))
      .orderBy(desc(conversations.lastMessageAt))

    if (!convRows || convRows.length === 0) {
      return []
    }

    const result: ConversationItem[] = []

    for (const c of convRows) {
      // Fetch latest message
      const latestMsgRows = await db
        .select({
          message: messages.message,
          viewed: messages.viewed,
          senderId: messages.senderId,
          createdAt: messages.createdAt,
        })
        .from(messages)
        .where(eq(messages.conversationId, c.id))
        .orderBy(desc(messages.createdAt))
        .limit(1)

      const latest = latestMsgRows[0]
      const isUnread = latest && !latest.viewed && latest.senderId !== userId

      result.push({
        id: String(c.id),
        title: c.title,
        customerName: "You",
        shopId: c.shopId || undefined,
        shopName: c.shopName || "Merchant Store",
        shopSlug: c.shopSlug || "store",
        shopLogo: c.shopLogo || "/assets/img/placeholder.jpg",
        lastMessage: latest ? latest.message : "Start conversation",
        lastMessageAt: latest
          ? new Date(latest.createdAt).toLocaleDateString("en-GB") +
            " " +
            new Date(latest.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : new Date(c.lastMessageAt).toLocaleDateString("en-GB"),
        unreadCount: isUnread ? 1 : 0,
      })
    }

    return result
  } catch (err) {
    console.error("getUserConversations error:", err)
    return []
  }
}

export async function getConversationDetails(
  conversationId: number,
  userId?: string
): Promise<{
  conversation: ConversationItem | null
  messages: MessageItem[]
}> {
  try {
    const [c] = await db
      .select({
        id: conversations.id,
        title: conversations.title,
        senderId: conversations.senderId,
        receiverId: conversations.receiverId,
        shopId: conversations.shopId,
        shopName: shops.name,
        shopSlug: shops.slug,
        shopLogo: shops.logo,
        lastMessageAt: conversations.lastMessageAt,
      })
      .from(conversations)
      .leftJoin(shops, eq(conversations.shopId, shops.id))
      .where(eq(conversations.id, conversationId))
      .limit(1)

    if (!c) {
      return { conversation: null, messages: [] }
    }

    const msgRows = await db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderId: messages.senderId,
        message: messages.message,
        viewed: messages.viewed,
        createdAt: messages.createdAt,
        userName: users.name,
        userImage: users.image,
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt)

    const mappedMessages: MessageItem[] = msgRows.map((m) => {
      const isSender = userId ? m.senderId === userId : m.senderId === c.senderId
      return {
        id: String(m.id),
        conversationId: String(m.conversationId),
        senderId: m.senderId,
        senderName: isSender ? "You" : m.userName || c.shopName || "Merchant",
        senderAvatar: isSender ? m.userImage || "/assets/img/avatar-place.png" : c.shopLogo || "/assets/img/placeholder.jpg",
        message: m.message,
        isSender,
        date:
          new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
          " " +
          new Date(m.createdAt).toLocaleDateString("en-GB"),
        rawDate: m.createdAt.toISOString(),
      }
    })

    return {
      conversation: {
        id: String(c.id),
        title: c.title,
        customerName: "You",
        shopId: c.shopId || undefined,
        shopName: c.shopName || "Merchant Store",
        shopSlug: c.shopSlug || "store",
        shopLogo: c.shopLogo || "/assets/img/placeholder.jpg",
        lastMessage: mappedMessages[mappedMessages.length - 1]?.message || "",
        lastMessageAt: new Date(c.lastMessageAt).toISOString().slice(0, 10),
        unreadCount: 0,
      },
      messages: mappedMessages,
    }
  } catch (err) {
    console.error("getConversationDetails error:", err)
    return { conversation: null, messages: [] }
  }
}

export async function getSellerConversations(shopSlug?: string): Promise<ConversationItem[]> {
  return getUserConversations("usr_seller_default_01")
}

export async function getConversationMessages(conversationId: string | number): Promise<MessageItem[]> {
  const numericId = typeof conversationId === "number" ? conversationId : parseInt(String(conversationId).replace(/\D/g, "")) || 1
  const detail = await getConversationDetails(numericId)
  return detail.messages
}

export async function sendMessage(data: {
  conversationId: number | string
  senderId: string
  message: string
}): Promise<boolean> {
  try {
    const numericId = typeof data.conversationId === "number" ? data.conversationId : parseInt(String(data.conversationId).replace(/\D/g, "")) || 1
    await db.insert(messages).values({
      conversationId: numericId,
      senderId: data.senderId,
      message: data.message,
      viewed: false,
    })

    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, numericId))

    return true
  } catch (err) {
    console.error("sendMessage error:", err)
    return false
  }
}
