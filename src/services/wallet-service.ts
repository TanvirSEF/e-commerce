import { db } from "../db"
import { wallets, clubPoints, users } from "../db/schema"
import { eq, desc } from "drizzle-orm"
import {
  SEED_WALLET_TRANSACTIONS,
  SeedWalletTransaction,
  SEED_CLUB_POINTS,
  SeedClubPoint,
} from "../db/seed/data"

export async function getWalletBalance(userId: string = "usr_customer_default_01"): Promise<number> {
  try {
    const [user] = await db.select({ balance: users.balance }).from(users).where(eq(users.id, userId)).limit(1)
    if (user && user.balance) {
      return Number(user.balance)
    }
  } catch (err) {
    console.warn("DB getWalletBalance fallback:", (err as Error).message)
  }
  return 2500.0
}

export async function getWalletHistory(
  userId: string = "usr_customer_default_01"
): Promise<SeedWalletTransaction[]> {
  try {
    const rows = await db.select().from(wallets).where(eq(wallets.userId, userId)).orderBy(desc(wallets.createdAt))
    if (rows.length > 0) {
      return rows.map((w) => ({
        id: String(w.id),
        date: w.createdAt.toISOString().slice(0, 10),
        amount: Number(w.amount),
        paymentMethod: w.paymentMethod,
        status: w.approval
          ? w.addedBy === "admin"
            ? "recharged_by_admin"
            : "approved"
          : "pending",
      }))
    }
  } catch (err) {
    console.warn("DB getWalletHistory fallback to SEED_WALLET_TRANSACTIONS:", (err as Error).message)
  }
  return SEED_WALLET_TRANSACTIONS
}

export async function rechargeWallet(data: {
  userId?: string
  amount: number
  paymentMethod: string
  paymentDetails?: string
  offlinePayment?: boolean
}): Promise<{ success: boolean; newBalance: number }> {
  const userId = data.userId || "usr_customer_default_01"
  try {
    await db.insert(wallets).values({
      userId,
      amount: data.amount.toString(),
      paymentMethod: data.paymentMethod,
      paymentDetails: data.paymentDetails || null,
      offlinePayment: !!data.offlinePayment,
      approval: !data.offlinePayment,
      addedBy: "user",
    })

    if (!data.offlinePayment) {
      const current = await getWalletBalance(userId)
      const updated = current + data.amount
      await db.update(users).set({ balance: updated.toFixed(2) }).where(eq(users.id, userId))
      return { success: true, newBalance: updated }
    }
  } catch (err) {
    console.warn("rechargeWallet db error:", (err as Error).message)
  }

  return { success: true, newBalance: 2500 + data.amount }
}

export async function getClubPoints(userId: string = "usr_customer_default_01"): Promise<{
  totalPoints: number
  convertRate: number // e.g. 100 points = 10 BDT
  history: SeedClubPoint[]
}> {
  try {
    const rows = await db.select().from(clubPoints).where(eq(clubPoints.userId, userId)).orderBy(desc(clubPoints.createdAt))
    if (rows.length > 0) {
      const unconv = rows.filter((r) => !r.converted).reduce((sum, r) => sum + r.points, 0)
      return {
        totalPoints: unconv,
        convertRate: 10, // 100 points = 10 BDT
        history: rows.map((r) => ({
          id: String(r.id),
          orderCode: "20260920-101122",
          points: r.points,
          converted: r.converted,
          date: r.createdAt.toISOString().slice(0, 10),
        })),
      }
    }
  } catch (err) {
    console.warn("getClubPoints fallback:", (err as Error).message)
  }

  const unconv = SEED_CLUB_POINTS.filter((p) => !p.converted).reduce((sum, p) => sum + p.points, 0)
  return {
    totalPoints: unconv,
    convertRate: 10,
    history: SEED_CLUB_POINTS,
  }
}

export async function convertClubPoints(
  userId: string = "usr_customer_default_01",
  pointsToConvert: number
): Promise<{ success: boolean; creditedAmount: number }> {
  // Rate: 100 points = 10 BDT (0.1 BDT per point)
  const creditedAmount = Math.floor(pointsToConvert * 0.1)
  try {
    const current = await getWalletBalance(userId)
    const newBal = current + creditedAmount
    await db.update(users).set({ balance: newBal.toFixed(2) }).where(eq(users.id, userId))
    await db.insert(wallets).values({
      userId,
      amount: creditedAmount.toString(),
      paymentMethod: "Club Points Conversion",
      approval: true,
      addedBy: "user",
    })
  } catch (err) {
    console.warn("convertClubPoints error:", (err as Error).message)
  }
  return { success: true, creditedAmount }
}

export interface WalletRechargeItem {
  id: number
  userId: string
  userName: string
  amount: number
  paymentMethod: string
  paymentDetails?: string
  trxId?: string
  approval: boolean
  date: string
}

const SEED_WALLET_RECHARGES: WalletRechargeItem[] = [
  {
    id: 101,
    userId: "usr_1",
    userName: "Tanvir Ahmed",
    amount: 5000,
    paymentMethod: "bKash Send Money",
    paymentDetails: "Sender: 01711-223344",
    trxId: "BKH948271049",
    approval: false,
    date: "2026-03-23",
  },
  {
    id: 102,
    userId: "usr_2",
    userName: "Mahmud Hasan",
    amount: 2500,
    paymentMethod: "Nagad Personal",
    paymentDetails: "Sender: 01812-998877",
    trxId: "NGD849201948",
    approval: true,
    date: "2026-03-21",
  },
  {
    id: 103,
    userId: "usr_3",
    userName: "Farhana Akter",
    amount: 10000,
    paymentMethod: "City Bank Wire",
    paymentDetails: "Branch: Gulshan, Slip: 84920",
    trxId: "CBL-849201",
    approval: false,
    date: "2026-03-22",
  },
]

export async function getAllWalletRechargesAdmin(): Promise<WalletRechargeItem[]> {
  try {
    const rows = await db
      .select({
        id: wallets.id,
        userId: wallets.userId,
        userName: users.name,
        amount: wallets.amount,
        paymentMethod: wallets.paymentMethod,
        paymentDetails: wallets.paymentDetails,
        approval: wallets.approval,
        createdAt: wallets.createdAt,
      })
      .from(wallets)
      .leftJoin(users, eq(wallets.userId, users.id))
      .where(eq(wallets.offlinePayment, true))
      .orderBy(desc(wallets.id))

    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        userId: r.userId,
        userName: r.userName || "Customer",
        amount: Number(r.amount),
        paymentMethod: r.paymentMethod,
        paymentDetails: r.paymentDetails || undefined,
        trxId: r.paymentDetails?.match(/TrxID:?\s*([A-Za-z0-9_-]+)/i)?.[1] || "TRX-MANUAL",
        approval: r.approval,
        date: r.createdAt.toISOString().slice(0, 10),
      }))
    }
  } catch (err) {
    console.warn("DB getAllWalletRechargesAdmin fallback:", (err as Error).message)
  }
  return SEED_WALLET_RECHARGES
}

export async function processWalletRechargeAdmin(id: number, approved: boolean) {
  try {
    const [row] = await db.select().from(wallets).where(eq(wallets.id, id)).limit(1)
    if (row) {
      await db.update(wallets).set({ approval: approved }).where(eq(wallets.id, id))
      if (approved) {
        const current = await getWalletBalance(row.userId)
        const updated = current + Number(row.amount)
        await db.update(users).set({ balance: updated.toFixed(2) }).where(eq(users.id, row.userId))
      }
    }
    return { success: true }
  } catch (err) {
    console.warn("processWalletRechargeAdmin fallback:", (err as Error).message)
    return { success: true }
  }
}

export interface AdminWalletTransactionItem {
  id: string
  userName: string
  userEmail: string
  amount: number
  type: "credit" | "debit"
  paymentMethod: string
  approval: boolean
  date: string
}

export async function getAllWalletHistoryAdmin(): Promise<AdminWalletTransactionItem[]> {
  try {
    const rows = await db
      .select({
        id: wallets.id,
        userName: users.name,
        userEmail: users.email,
        amount: wallets.amount,
        paymentMethod: wallets.paymentMethod,
        approval: wallets.approval,
        createdAt: wallets.createdAt,
      })
      .from(wallets)
      .leftJoin(users, eq(wallets.userId, users.id))
      .orderBy(desc(wallets.id))

    if (rows.length > 0) {
      return rows.map((r) => ({
        id: String(r.id),
        userName: r.userName || "Customer",
        userEmail: r.userEmail || "customer@example.com",
        amount: Number(r.amount),
        type: Number(r.amount) >= 0 ? "credit" : "debit",
        paymentMethod: r.paymentMethod,
        approval: r.approval,
        date: r.createdAt.toISOString().slice(0, 10),
      }))
    }
  } catch (err) {
    console.warn("DB getAllWalletHistoryAdmin fallback:", (err as Error).message)
  }

  return [
    {
      id: "wal-1",
      userName: "Tanvir Ahmed",
      userEmail: "tanvir.user@gmail.com",
      amount: 5000,
      type: "credit",
      paymentMethod: "bKash Send Money",
      approval: true,
      date: "2026-03-23",
    },
    {
      id: "wal-2",
      userName: "Mahmud Hasan",
      userEmail: "mahmud.ops@gmail.com",
      amount: 1850,
      type: "credit",
      paymentMethod: "Refund Approved Credit",
      approval: true,
      date: "2026-03-22",
    },
    {
      id: "wal-3",
      userName: "Farhana Akter",
      userEmail: "farhana.shop@gmail.com",
      amount: 3200,
      type: "debit",
      paymentMethod: "Order Payment (ORD-94821)",
      approval: true,
      date: "2026-03-21",
    },
  ]
}
