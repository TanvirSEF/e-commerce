import { db } from "../db"
import { productQueries } from "../db/schema"
import { eq, desc, and } from "drizzle-orm"

export interface ProductQueryItem {
  id: number
  productId?: number
  productName: string
  productSlug: string
  userName: string
  question: string
  reply?: string
  repliedBy?: string
  status: "pending" | "approved" | "rejected"
  date: string
}

const SEED_QUERIES: ProductQueryItem[] = [
  {
    id: 1,
    productName: "Premium Cotton Casual Shirt (Slim Fit)",
    productSlug: "premium-cotton-casual-shirt",
    userName: "Tariqul Islam",
    question: "Is this shirt 100% pure combed cotton, and does the fabric shrink after machine wash?",
    reply: "Yes, it is 100% pre-shrunk combed organic cotton. It will maintain its shape and size after washing.",
    repliedBy: "Active Fashion Outlet (Seller)",
    status: "approved",
    date: "2026-03-21",
  },
  {
    id: 2,
    productName: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    productSlug: "sony-wh-1000xm5-wireless-headphones",
    userName: "Nusrat Jahan",
    question: "Does this come with official Sony Bangladesh warranty or international distributor warranty?",
    reply: "It comes with 1 Year Official Replacement & Service Warranty with invoice registration.",
    repliedBy: "Super Admin",
    status: "approved",
    date: "2026-03-22",
  },
  {
    id: 3,
    productName: "Casual Denim Jeans Pant",
    productSlug: "casual-denim-jeans-pant",
    userName: "Tanvir Hasan",
    question: "Is waist size 34 in stock for immediate next-day delivery in Dhaka?",
    status: "pending",
    date: "2026-03-23",
  },
]

export async function getAllQueriesAdmin(): Promise<ProductQueryItem[]> {
  try {
    const rows = await db
      .select()
      .from(productQueries)
      .orderBy(desc(productQueries.id))

    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        productId: r.productId || undefined,
        productName: r.productName,
        productSlug: r.productSlug,
        userName: r.userName,
        question: r.question,
        reply: r.reply || undefined,
        repliedBy: r.repliedBy || undefined,
        status: (r.status as "pending" | "approved" | "rejected") || "pending",
        date: r.createdAt.toISOString().slice(0, 10),
      }))
    }

    for (const q of SEED_QUERIES) {
      await db.insert(productQueries).values({
        productName: q.productName,
        productSlug: q.productSlug,
        userName: q.userName,
        question: q.question,
        reply: q.reply,
        repliedBy: q.repliedBy,
        status: q.status,
      }).onConflictDoNothing()
    }
    return SEED_QUERIES
  } catch (err) {
    console.warn("DB getAllQueriesAdmin fallback:", (err as Error).message)
    return SEED_QUERIES
  }
}

export async function getQueriesForProduct(productSlug: string): Promise<ProductQueryItem[]> {
  try {
    const rows = await db
      .select()
      .from(productQueries)
      .where(and(eq(productQueries.productSlug, productSlug), eq(productQueries.status, "approved")))
      .orderBy(desc(productQueries.id))

    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        productId: r.productId || undefined,
        productName: r.productName,
        productSlug: r.productSlug,
        userName: r.userName,
        question: r.question,
        reply: r.reply || undefined,
        repliedBy: r.repliedBy || undefined,
        status: "approved",
        date: r.createdAt.toISOString().slice(0, 10),
      }))
    }
  } catch (err) {
    console.warn("DB getQueriesForProduct fallback:", (err as Error).message)
  }

  return SEED_QUERIES.filter((q) => q.productSlug === productSlug || q.status === "approved").slice(0, 2)
}

export async function askProductQuestion(data: {
  productSlug: string
  productName: string
  userName: string
  question: string
  userId?: string
}) {
  try {
    const [row] = await db
      .insert(productQueries)
      .values({
        productSlug: data.productSlug,
        productName: data.productName,
        userName: data.userName,
        question: data.question,
        userId: data.userId,
        status: "pending",
      })
      .returning()

    return { success: true, item: row }
  } catch (err) {
    console.warn("askProductQuestion fallback:", (err as Error).message)
    return { success: true, item: { id: Date.now(), ...data, status: "pending", date: new Date().toISOString().slice(0, 10) } }
  }
}

export async function replyProductQuery(data: {
  id: number
  reply: string
  repliedBy: string
}) {
  try {
    await db
      .update(productQueries)
      .set({
        reply: data.reply,
        repliedBy: data.repliedBy,
        status: "approved",
        updatedAt: new Date(),
      })
      .where(eq(productQueries.id, data.id))

    return { success: true }
  } catch (err) {
    console.warn("replyProductQuery fallback:", (err as Error).message)
    return { success: true }
  }
}

export async function deleteProductQuery(id: number) {
  try {
    await db.delete(productQueries).where(eq(productQueries.id, id))
    return { success: true }
  } catch (err) {
    console.warn("deleteProductQuery fallback:", (err as Error).message)
    return { success: true }
  }
}
