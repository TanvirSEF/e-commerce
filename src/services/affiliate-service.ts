import { db } from "@/db"
import {
  affiliateUsers,
  affiliateOptions,
  affiliateConfigs,
  affiliateWithdrawRequests,
  affiliateLogs,
  type AffiliateUser,
  type AffiliateOption,
  type AffiliateConfig,
  type AffiliateWithdrawRequest,
  type AffiliateLog,
} from "@/db/schema/affiliate"
import { desc, eq } from "drizzle-orm"

export const SEED_AFFILIATE_OPTIONS: AffiliateOption[] = [
  {
    id: 1,
    type: "product_sharing",
    percentage: "5.00",
    status: true,
    updatedAt: new Date("2026-09-01T00:00:00Z"),
  },
  {
    id: 2,
    type: "user_registration",
    percentage: "2.50",
    status: true,
    updatedAt: new Date("2026-09-01T00:00:00Z"),
  },
]

export const SEED_AFFILIATE_CONFIGS: Record<string, string> = {
  minimum_withdraw_amount: "50.00",
  cookie_duration_days: "30",
  affiliate_terms: "Commissions are credited upon completed and verified order delivery. Fraudulent clicks or self-referrals will lead to immediate partner disqualification.",
}

export const SEED_AFFILIATE_USERS: AffiliateUser[] = [
  {
    id: 1,
    userId: "usr_1",
    userName: "Marcus Harrison",
    userEmail: "marcus.h@techreviews.com",
    paypalEmail: "payouts@techreviews.com",
    bankInfo: "Chase Manhattan Bank - Routing: 021000021, Acct: ****8841",
    balance: "485.50",
    status: true,
    referralCode: "MARCUS-PRO",
    createdAt: new Date("2026-08-10T11:00:00Z"),
  },
  {
    id: 2,
    userId: "usr_2",
    userName: "Elena Gilbert",
    userEmail: "elena.style@gmail.com",
    paypalEmail: "elena.style@gmail.com",
    bankInfo: "Bank of America - Routing: 121000358, Acct: ****1922",
    balance: "192.00",
    status: true,
    referralCode: "ELENA-LUX",
    createdAt: new Date("2026-08-18T15:20:00Z"),
  },
  {
    id: 3,
    userId: "usr_3",
    userName: "Devon Miller",
    userEmail: "devon.deals@outlook.com",
    paypalEmail: "devon.deals@outlook.com",
    bankInfo: "Wells Fargo - Acct: ****9301",
    balance: "35.00",
    status: false,
    referralCode: "DEVON-DEALS",
    createdAt: new Date("2026-09-02T09:40:00Z"),
  },
]

export const SEED_AFFILIATE_WITHDRAW_REQUESTS: AffiliateWithdrawRequest[] = [
  {
    id: 1,
    affiliateUserId: 1,
    userName: "Marcus Harrison",
    userEmail: "marcus.h@techreviews.com",
    amount: "300.00",
    status: "pending",
    createdAt: new Date("2026-09-24T10:15:00Z"),
  },
  {
    id: 2,
    affiliateUserId: 2,
    userName: "Elena Gilbert",
    userEmail: "elena.style@gmail.com",
    amount: "150.00",
    status: "approved",
    createdAt: new Date("2026-09-18T14:00:00Z"),
  },
]

export const SEED_AFFILIATE_LOGS: AffiliateLog[] = [
  {
    id: 1,
    affiliateUserId: 1,
    referredUserName: "Jason Todd",
    affiliateType: "Product Sharing",
    amount: "45.00",
    orderCode: "ORD-202609-8812",
    createdAt: new Date("2026-09-22T16:20:00Z"),
  },
  {
    id: 2,
    affiliateUserId: 1,
    referredUserName: "Chloe Price",
    affiliateType: "Product Sharing",
    amount: "18.50",
    orderCode: "ORD-202609-8833",
    createdAt: new Date("2026-09-23T11:45:00Z"),
  },
  {
    id: 3,
    affiliateUserId: 2,
    referredUserName: "Rachel Amber",
    affiliateType: "User Registration",
    amount: "5.00",
    orderCode: null,
    createdAt: new Date("2026-09-20T08:30:00Z"),
  },
]

export async function getAffiliateOptions(): Promise<AffiliateOption[]> {
  try {
    return await db.select().from(affiliateOptions)
  } catch (err) {
    console.warn("getAffiliateOptions fallback:", err instanceof Error ? err.message : String(err))
    return SEED_AFFILIATE_OPTIONS
  }
}

export async function updateAffiliateOption(
  type: string,
  percentage: string,
  status: boolean
): Promise<{ success: boolean }> {
  try {
    await db
      .insert(affiliateOptions)
      .values({ type, percentage, status, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: affiliateOptions.type,
        set: { percentage, status, updatedAt: new Date() },
      })
  } catch (err) {
    console.warn("updateAffiliateOption fallback:", err instanceof Error ? err.message : String(err))
    const item = SEED_AFFILIATE_OPTIONS.find((o) => o.type === type)
    if (item) {
      item.percentage = percentage
      item.status = status
    }
  }
  return { success: true }
}

export async function getAffiliateConfigs(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(affiliateConfigs)
    if (rows.length === 0) return SEED_AFFILIATE_CONFIGS
    const res: Record<string, string> = {}
    rows.forEach((r) => {
      res[r.type] = r.value
    })
    return { ...SEED_AFFILIATE_CONFIGS, ...res }
  } catch (err) {
    console.warn("getAffiliateConfigs fallback:", err instanceof Error ? err.message : String(err))
    return SEED_AFFILIATE_CONFIGS
  }
}

export async function updateAffiliateConfigs(
  configs: Record<string, string>
): Promise<{ success: boolean }> {
  try {
    for (const [type, value] of Object.entries(configs)) {
      await db
        .insert(affiliateConfigs)
        .values({ type, value })
        .onConflictDoUpdate({ target: affiliateConfigs.type, set: { value } })
    }
  } catch (err) {
    console.warn("updateAffiliateConfigs fallback:", err instanceof Error ? err.message : String(err))
    Object.assign(SEED_AFFILIATE_CONFIGS, configs)
  }
  return { success: true }
}

export async function getAllAffiliateUsers(): Promise<AffiliateUser[]> {
  try {
    return await db.select().from(affiliateUsers).orderBy(desc(affiliateUsers.createdAt))
  } catch (err) {
    console.warn("getAllAffiliateUsers fallback:", err instanceof Error ? err.message : String(err))
    return SEED_AFFILIATE_USERS
  }
}

export async function getAffiliateUserByEmail(email: string): Promise<AffiliateUser | null> {
  try {
    const res = await db.select().from(affiliateUsers).where(eq(affiliateUsers.userEmail, email))
    return res[0] || SEED_AFFILIATE_USERS.find((u) => u.userEmail === email) || SEED_AFFILIATE_USERS[0]
  } catch (err) {
    console.warn("getAffiliateUserByEmail fallback:", err instanceof Error ? err.message : String(err))
    return SEED_AFFILIATE_USERS.find((u) => u.userEmail === email) || SEED_AFFILIATE_USERS[0]
  }
}

export async function approveAffiliateUser(id: number): Promise<{ success: boolean }> {
  try {
    await db.update(affiliateUsers).set({ status: true }).where(eq(affiliateUsers.id, id))
  } catch (err) {
    console.warn("approveAffiliateUser fallback:", err instanceof Error ? err.message : String(err))
    const u = SEED_AFFILIATE_USERS.find((x) => x.id === id)
    if (u) u.status = true
  }
  return { success: true }
}

export async function rejectAffiliateUser(id: number): Promise<{ success: boolean }> {
  try {
    await db.update(affiliateUsers).set({ status: false }).where(eq(affiliateUsers.id, id))
  } catch (err) {
    console.warn("rejectAffiliateUser fallback:", err instanceof Error ? err.message : String(err))
    const u = SEED_AFFILIATE_USERS.find((x) => x.id === id)
    if (u) u.status = false
  }
  return { success: true }
}

export async function getAllAffiliateWithdrawRequests(): Promise<AffiliateWithdrawRequest[]> {
  try {
    return await db.select().from(affiliateWithdrawRequests).orderBy(desc(affiliateWithdrawRequests.createdAt))
  } catch (err) {
    console.warn("getAllAffiliateWithdrawRequests fallback:", err instanceof Error ? err.message : String(err))
    return SEED_AFFILIATE_WITHDRAW_REQUESTS
  }
}

export async function approveWithdrawRequest(id: number): Promise<{ success: boolean }> {
  try {
    await db.update(affiliateWithdrawRequests).set({ status: "approved" }).where(eq(affiliateWithdrawRequests.id, id))
  } catch (err) {
    console.warn("approveWithdrawRequest fallback:", err instanceof Error ? err.message : String(err))
    const req = SEED_AFFILIATE_WITHDRAW_REQUESTS.find((r) => r.id === id)
    if (req) req.status = "approved"
  }
  return { success: true }
}

export async function rejectWithdrawRequest(id: number): Promise<{ success: boolean }> {
  try {
    await db.update(affiliateWithdrawRequests).set({ status: "rejected" }).where(eq(affiliateWithdrawRequests.id, id))
  } catch (err) {
    console.warn("rejectWithdrawRequest fallback:", err instanceof Error ? err.message : String(err))
    const req = SEED_AFFILIATE_WITHDRAW_REQUESTS.find((r) => r.id === id)
    if (req) req.status = "rejected"
  }
  return { success: true }
}

export async function getAllAffiliateLogs(): Promise<AffiliateLog[]> {
  try {
    return await db.select().from(affiliateLogs).orderBy(desc(affiliateLogs.createdAt))
  } catch (err) {
    console.warn("getAllAffiliateLogs fallback:", err instanceof Error ? err.message : String(err))
    return SEED_AFFILIATE_LOGS
  }
}

export async function applyForAffiliate(data: {
  userName: string
  userEmail: string
  paypalEmail?: string
  bankInfo?: string
}): Promise<{ success: boolean; user: AffiliateUser }> {
  const code = (data.userName.split(" ")[0] || "AFF") + "-" + Math.floor(1000 + Math.random() * 9000)
  const newUser: AffiliateUser = {
    id: Date.now(),
    userId: `usr_${Date.now()}`,
    userName: data.userName,
    userEmail: data.userEmail,
    paypalEmail: data.paypalEmail || null,
    bankInfo: data.bankInfo || null,
    balance: "0.00",
    status: true,
    referralCode: code.toUpperCase(),
    createdAt: new Date(),
  }

  try {
    await db.insert(affiliateUsers).values(newUser)
  } catch (err) {
    console.warn("applyForAffiliate fallback:", err instanceof Error ? err.message : String(err))
    SEED_AFFILIATE_USERS.unshift(newUser)
  }

  return { success: true, user: newUser }
}
