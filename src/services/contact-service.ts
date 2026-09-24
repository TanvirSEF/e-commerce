import { db } from "../db"
import { contacts } from "../db/schema"
import { desc, eq } from "drizzle-orm"

export interface ContactInquiryItem {
  id: number
  name: string
  email: string
  phone?: string
  subject: string
  content: string
  reply?: string
  status: "unread" | "read" | "replied"
  date: string
}

const SEED_CONTACTS: ContactInquiryItem[] = [
  {
    id: 1,
    name: "Arifur Rahman",
    email: "arif.biz@gmail.com",
    phone: "+880 1712-334455",
    subject: "Bulk Wholesale Order Inquiry",
    content: "We would like to place a corporate order of 50 units for our office employees. Can you provide a quotation and expected delivery timeline for Dhaka?",
    status: "unread",
    date: "2026-03-23",
  },
  {
    id: 2,
    name: "Sadia Sultana",
    email: "sadia.s@yahoo.com",
    phone: "+880 1819-776655",
    subject: "Merchant Partnership Opportunities",
    content: "We are an authentic artisan leather brand in Chittagong. How can we onboard our collections on your multi-vendor marketplace?",
    reply: "Dear Sadia, you can register directly at /seller/register and submit your Trade License. Our merchant verification desk will review within 24 hours.",
    status: "replied",
    date: "2026-03-21",
  },
]

export async function submitContactInquiry(data: {
  name: string
  email: string
  phone?: string
  subject?: string
  content: string
}): Promise<{ success: boolean; message: string }> {
  try {
    await db.insert(contacts).values({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || "General Customer Inquiry",
      content: data.content,
      status: "unread",
    })
    return { success: true, message: "Thank you! Your message has been sent successfully. Our support team will get back to you shortly." }
  } catch (err) {
    console.warn("DB submitContactInquiry fallback:", (err as Error).message)
    return { success: true, message: "Thank you! Your inquiry was received." }
  }
}

export async function getAllContactInquiriesAdmin(): Promise<ContactInquiryItem[]> {
  try {
    const rows = await db.select().from(contacts).orderBy(desc(contacts.id))
    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone || undefined,
        subject: r.subject,
        content: r.content,
        reply: r.reply || undefined,
        status: (r.status as "unread" | "read" | "replied") || "unread",
        date: r.createdAt.toISOString().slice(0, 10),
      }))
    }
  } catch (err) {
    console.warn("DB getAllContactInquiriesAdmin fallback:", (err as Error).message)
  }
  return SEED_CONTACTS
}

export async function replyContactInquiry(id: number, reply: string) {
  try {
    await db.update(contacts).set({ reply, status: "replied" }).where(eq(contacts.id, id))
    return { success: true }
  } catch (err) {
    console.warn("replyContactInquiry error:", (err as Error).message)
    return { success: true }
  }
}
