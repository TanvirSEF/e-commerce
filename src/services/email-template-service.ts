import { db } from "../db"
import { emailTemplates, type EmailTemplate } from "../db/schema"
import { eq, desc } from "drizzle-orm"

export const SEED_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 1,
    identifier: "order_placement",
    emailType: "Order Placement Notification",
    receiver: "customer",
    subject: "Your order [[order_code]] has been placed successfully!",
    defaultText: "Dear [[customer_name]],\n\nThank you for placing order with [[site_name]]. Your order [[order_code]] with total amount [[order_amount]] has been successfully placed. We will notify you once your order is dispatched.\n\nBest Regards,\n[[site_name]] Team",
    status: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    identifier: "order_confirmed",
    emailType: "Order Confirmation Notice",
    receiver: "customer",
    subject: "Order [[order_code]] Confirmed by Seller",
    defaultText: "Hi [[customer_name]],\n\nGreat news! The seller has confirmed your order [[order_code]]. It is being prepared for packaging and shipping.\n\nTrack your order here: [[order_tracking_link]]\n\nCheers,\n[[site_name]]",
    status: true,
    createdAt: new Date(),
  },
  {
    id: 3,
    identifier: "order_delivered",
    emailType: "Order Delivery Notification",
    receiver: "customer",
    subject: "Your package for [[order_code]] has been delivered!",
    defaultText: "Hello [[customer_name]],\n\nYour order [[order_code]] has been marked as delivered by the courier. Please take a moment to leave a review for the products.\n\nThank you,\n[[site_name]]",
    status: true,
    createdAt: new Date(),
  },
  {
    id: 4,
    identifier: "admin_new_order",
    emailType: "New Order Notification for Admin",
    receiver: "admin",
    subject: "New Order Placed: [[order_code]] by [[customer_name]]",
    defaultText: "Hello Admin,\n\nA new order [[order_code]] has just been placed with total amount [[order_amount]]. Payment method: [[payment_method]].\n\nPlease review the sales order ledger in your admin panel.\n\nAdmin Desk,\n[[site_name]]",
    status: true,
    createdAt: new Date(),
  },
  {
    id: 5,
    identifier: "seller_new_order",
    emailType: "New Order Assigned to Seller",
    receiver: "seller",
    subject: "New Customer Order: [[order_code]]",
    defaultText: "Dear Seller [[seller_name]],\n\nYou have received a new customer order [[order_code]]. Please check the order details and fulfill it promptly.\n\nSeller Portal,\n[[site_name]]",
    status: true,
    createdAt: new Date(),
  },
  {
    id: 6,
    identifier: "seller_verification_approved",
    emailType: "Seller Verification Approved",
    receiver: "seller",
    subject: "Congratulations! Your Seller Verification is Approved",
    defaultText: "Dear [[seller_name]],\n\nYour shop verification documents have been reviewed and approved by the admin team. Your store now carries the verified check badge!\n\nBest Regards,\n[[site_name]]",
    status: true,
    createdAt: new Date(),
  },
  {
    id: 7,
    identifier: "seller_payout_processed",
    emailType: "Seller Payout Request Processed",
    receiver: "seller",
    subject: "Payout Request [[payout_id]] Approved",
    defaultText: "Dear [[seller_name]],\n\nYour withdrawal request for [[amount]] has been approved and sent to your bank account / mobile wallet.\n\nTransaction ID: [[txn_id]]\n\nFinance Team,\n[[site_name]]",
    status: true,
    createdAt: new Date(),
  },
  {
    id: 8,
    identifier: "password_reset",
    emailType: "Password Reset Request",
    receiver: "all",
    subject: "Password Reset Request for [[site_name]]",
    defaultText: "Hello [[user_name]],\n\nWe received a request to reset your password. Click the link below to set a new password:\n\n[[reset_password_link]]\n\nIf you did not request this, please ignore this email.\n\nSecurity Team,\n[[site_name]]",
    status: true,
    createdAt: new Date(),
  },
]

let inMemoryEmailTemplates: EmailTemplate[] = [...SEED_EMAIL_TEMPLATES]

export async function getAllEmailTemplates(tab?: string, search?: string): Promise<EmailTemplate[]> {
  try {
    const rows = await db.select().from(emailTemplates).orderBy(desc(emailTemplates.createdAt))
    if (rows && rows.length > 0) {
      let list = rows
      if (tab && tab !== "all") {
        list = list.filter((t) => t.receiver === tab || (tab === "common" && t.receiver === "all"))
      }
      if (search) {
        const q = search.toLowerCase()
        list = list.filter((t) => t.emailType.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q))
      }
      return list
    }
  } catch (err) {
    console.warn("getAllEmailTemplates DB fallback:", (err as Error).message)
  }

  let list = inMemoryEmailTemplates
  if (tab && tab !== "all") {
    list = list.filter((t) => t.receiver === tab || (tab === "common" && t.receiver === "all"))
  }
  if (search) {
    const q = search.toLowerCase()
    list = list.filter((t) => t.emailType.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q))
  }
  return list
}

export async function getEmailTemplateById(id: number): Promise<EmailTemplate | null> {
  try {
    const [row] = await db.select().from(emailTemplates).where(eq(emailTemplates.id, id)).limit(1)
    if (row) return row
  } catch (err) {
    console.warn("getEmailTemplateById DB fallback:", (err as Error).message)
  }
  return inMemoryEmailTemplates.find((t) => t.id === id) || null
}

export async function updateEmailTemplate(
  id: number,
  data: { subject: string; defaultText: string }
): Promise<boolean> {
  try {
    await db.update(emailTemplates).set(data).where(eq(emailTemplates.id, id))
    return true
  } catch (err) {
    console.warn("updateEmailTemplate DB fallback:", (err as Error).message)
  }
  inMemoryEmailTemplates = inMemoryEmailTemplates.map((t) => (t.id === id ? { ...t, ...data } : t))
  return true
}

export async function toggleEmailTemplateStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db.update(emailTemplates).set({ status }).where(eq(emailTemplates.id, id))
    return true
  } catch (err) {
    console.warn("toggleEmailTemplateStatus DB fallback:", (err as Error).message)
  }
  inMemoryEmailTemplates = inMemoryEmailTemplates.map((t) => (t.id === id ? { ...t, status } : t))
  return true
}
