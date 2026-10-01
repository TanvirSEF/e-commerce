import { db } from "@/db"
import {
  affiliateUsers,
  affiliateOptions,
  affiliateConfigs,
  affiliatePayments,
  affiliateReferrals,
  affiliateWithdrawRequests,
  affiliateLogs,
  type AffiliateUser,
  type AffiliateOption,
  type AffiliateConfig,
  type AffiliatePayment,
  type AffiliateReferral,
  type AffiliateWithdrawRequest,
  type AffiliateLog,
} from "@/db/schema/affiliate"
import { categories } from "@/db/schema/products"
import { desc, eq } from "drizzle-orm"

export const SEED_AFFILIATE_OPTIONS = [
  { type: "product_sharing", percentage: "5.00", status: true },
  { type: "user_registration", percentage: "2.50", status: true },
]

export const SEED_AFFILIATE_CONFIGS: Record<string, string> = {
  minimum_withdraw_amount: "50.00",
  cookie_duration_days: "30",
  affiliate_terms: "Commissions are credited upon completed and verified order delivery.",
}

export const SEED_AFFILIATE_USERS = [
  {
    userName: "Marcus Harrison",
    userEmail: "marcus.h@techreviews.com",
    balance: "485.50",
    status: true,
    referralCode: "MARCUS-PRO",
  },
]

// Get all affiliate configuration options
export async function getAffiliateOptions(): Promise<AffiliateOption[]> {
  return await db.select().from(affiliateOptions)
}

// Update single affiliate option with mutual exclusivity rule
export async function updateAffiliateOption(
  type: string,
  percentage: string,
  status: boolean,
  details?: string
): Promise<{ success: boolean }> {
  // Mutual exclusivity: Product Sharing vs Category Wise Affiliate
  if (type === "product_sharing" && status) {
    await db
      .update(affiliateOptions)
      .set({ status: false, updatedAt: new Date() })
      .where(eq(affiliateOptions.type, "category_wise_affiliate"))
  } else if (type === "category_wise_affiliate" && status) {
    await db
      .update(affiliateOptions)
      .set({ status: false, updatedAt: new Date() })
      .where(eq(affiliateOptions.type, "product_sharing"))
  }

  await db
    .insert(affiliateOptions)
    .values({
      type,
      percentage,
      details: details || null,
      status,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: affiliateOptions.type,
      set: {
        percentage,
        ...(details !== undefined ? { details } : {}),
        status,
        updatedAt: new Date(),
      },
    })

  return { success: true }
}

// Update category wise rates
export async function updateCategoryAffiliateRates(
  rates: Record<string, string>,
  status: boolean
): Promise<{ success: boolean }> {
  if (status) {
    await db
      .update(affiliateOptions)
      .set({ status: false, updatedAt: new Date() })
      .where(eq(affiliateOptions.type, "product_sharing"))
  }

  await db
    .insert(affiliateOptions)
    .values({
      type: "category_wise_affiliate",
      percentage: "0.00",
      details: JSON.stringify(rates),
      status,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: affiliateOptions.type,
      set: {
        details: JSON.stringify(rates),
        status,
        updatedAt: new Date(),
      },
    })

  return { success: true }
}

// Get all categories for category-wise affiliate configuration
export async function getCategoriesForAffiliate() {
  return await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      icon: categories.icon,
    })
    .from(categories)
    .orderBy(categories.name)
}

// Get all affiliate key-value configs
export async function getAffiliateConfigs(): Promise<Record<string, string>> {
  const rows = await db.select().from(affiliateConfigs)
  const res: Record<string, string> = {}
  rows.forEach((r) => {
    res[r.type] = r.value
  })
  return res
}

// Update affiliate key-value configs
export async function updateAffiliateConfigs(
  configs: Record<string, string>
): Promise<{ success: boolean }> {
  for (const [type, value] of Object.entries(configs)) {
    await db
      .insert(affiliateConfigs)
      .values({ type, value })
      .onConflictDoUpdate({ target: affiliateConfigs.type, set: { value } })
  }
  return { success: true }
}

// Get all affiliate users
export async function getAllAffiliateUsers(): Promise<AffiliateUser[]> {
  return await db.select().from(affiliateUsers).orderBy(desc(affiliateUsers.createdAt))
}

// Get affiliate user by ID
export async function getAffiliateUserById(id: number): Promise<AffiliateUser | null> {
  const rows = await db.select().from(affiliateUsers).where(eq(affiliateUsers.id, id))
  return rows[0] || null
}

// Get affiliate user by email
export async function getAffiliateUserByEmail(email: string): Promise<AffiliateUser | null> {
  const rows = await db.select().from(affiliateUsers).where(eq(affiliateUsers.userEmail, email))
  return rows[0] || null
}

// Toggle affiliate user approval
export async function updateAffiliateUserApproval(
  id: number,
  approved: boolean
): Promise<{ success: boolean }> {
  await db.update(affiliateUsers).set({ approved }).where(eq(affiliateUsers.id, id))
  return { success: true }
}

// Toggle affiliate user active status
export async function toggleAffiliateUserStatus(
  id: number,
  status: boolean
): Promise<{ success: boolean }> {
  await db.update(affiliateUsers).set({ status }).where(eq(affiliateUsers.id, id))
  return { success: true }
}

// Legacy approve/reject aliases for backward compatibility
export async function approveAffiliateUser(id: number): Promise<{ success: boolean }> {
  return await toggleAffiliateUserStatus(id, true)
}

export async function rejectAffiliateUser(id: number): Promise<{ success: boolean }> {
  return await toggleAffiliateUserStatus(id, false)
}

// Pay affiliate user directly
export async function payAffiliateUser(data: {
  affiliateUserId: number
  amount: string
  paymentMethod: string
  paymentDetails?: string
  txnCode?: string
}): Promise<{ success: boolean }> {
  const user = await getAffiliateUserById(data.affiliateUserId)
  if (!user) throw new Error("Affiliate partner not found")

  // Insert payment log
  await db.insert(affiliatePayments).values({
    affiliateUserId: data.affiliateUserId,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    paymentDetails: data.paymentDetails || null,
    txnCode: data.txnCode || null,
    createdAt: new Date(),
  })

  // Deduct balance
  const currentBalance = parseFloat(user.balance || "0")
  const payAmount = parseFloat(data.amount || "0")
  const newBalance = Math.max(0, currentBalance - payAmount).toFixed(2)

  await db
    .update(affiliateUsers)
    .set({ balance: newBalance })
    .where(eq(affiliateUsers.id, data.affiliateUserId))

  return { success: true }
}

// Get payment history for an affiliate user
export async function getAffiliatePaymentsByUser(
  affiliateUserId: number
): Promise<AffiliatePayment[]> {
  return await db
    .select()
    .from(affiliatePayments)
    .where(eq(affiliatePayments.affiliateUserId, affiliateUserId))
    .orderBy(desc(affiliatePayments.createdAt))
}

// Get all affiliate referral customers
export async function getAllAffiliateReferrals(): Promise<(AffiliateReferral & { affiliateUserName?: string })[]> {
  const referrals = await db
    .select({
      id: affiliateReferrals.id,
      affiliateUserId: affiliateReferrals.affiliateUserId,
      referredUserName: affiliateReferrals.referredUserName,
      referredUserEmail: affiliateReferrals.referredUserEmail,
      referredUserPhone: affiliateReferrals.referredUserPhone,
      referralType: affiliateReferrals.referralType,
      orderCode: affiliateReferrals.orderCode,
      createdAt: affiliateReferrals.createdAt,
      affiliateUserName: affiliateUsers.userName,
    })
    .from(affiliateReferrals)
    .leftJoin(affiliateUsers, eq(affiliateReferrals.affiliateUserId, affiliateUsers.id))
    .orderBy(desc(affiliateReferrals.createdAt))

  return referrals.map((r) => ({
    ...r,
    affiliateUserName: r.affiliateUserName || "Unknown Affiliate",
  }))
}

// Get all affiliate withdraw requests
export async function getAllAffiliateWithdrawRequests(): Promise<AffiliateWithdrawRequest[]> {
  return await db
    .select()
    .from(affiliateWithdrawRequests)
    .orderBy(desc(affiliateWithdrawRequests.createdAt))
}

// Process withdraw request payout
export async function processWithdrawRequestPayout(data: {
  requestId: number
  paymentMethod: string
  paymentDetails?: string
  txnCode?: string
}): Promise<{ success: boolean }> {
  const rows = await db
    .select()
    .from(affiliateWithdrawRequests)
    .where(eq(affiliateWithdrawRequests.id, data.requestId))
  const req = rows[0]
  if (!req) throw new Error("Withdraw request not found")

  // Mark request approved with payout details
  await db
    .update(affiliateWithdrawRequests)
    .set({
      status: "approved",
      paymentMethod: data.paymentMethod,
      paymentDetails: data.paymentDetails || null,
      txnCode: data.txnCode || null,
    })
    .where(eq(affiliateWithdrawRequests.id, data.requestId))

  // Record payment
  await db.insert(affiliatePayments).values({
    affiliateUserId: req.affiliateUserId,
    amount: req.amount,
    paymentMethod: data.paymentMethod,
    paymentDetails: data.paymentDetails || null,
    txnCode: data.txnCode || null,
    createdAt: new Date(),
  })

  // Deduct balance from affiliate user
  const user = await getAffiliateUserById(req.affiliateUserId)
  if (user) {
    const currentBalance = parseFloat(user.balance || "0")
    const payAmount = parseFloat(req.amount || "0")
    const newBalance = Math.max(0, currentBalance - payAmount).toFixed(2)
    await db
      .update(affiliateUsers)
      .set({ balance: newBalance })
      .where(eq(affiliateUsers.id, req.affiliateUserId))
  }

  return { success: true }
}

// Approve withdraw request alias (for backward compatibility)
export async function approveWithdrawRequest(id: number): Promise<{ success: boolean }> {
  return await processWithdrawRequestPayout({
    requestId: id,
    paymentMethod: "Manual / Cash",
    paymentDetails: "Direct administrative payout approval",
  })
}

// Reject withdraw request
export async function rejectWithdrawRequest(id: number): Promise<{ success: boolean }> {
  await db
    .update(affiliateWithdrawRequests)
    .set({ status: "rejected" })
    .where(eq(affiliateWithdrawRequests.id, id))
  return { success: true }
}

// Get all affiliate audit logs
export async function getAllAffiliateLogs(): Promise<AffiliateLog[]> {
  return await db.select().from(affiliateLogs).orderBy(desc(affiliateLogs.createdAt))
}

// Apply for affiliate (frontend onboarding)
export async function applyForAffiliate(data: {
  userName: string
  userEmail: string
  phone?: string
  paypalEmail?: string
  bankInfo?: string
  verificationInfo?: string
}): Promise<{ success: boolean; user: AffiliateUser }> {
  const code = (data.userName.split(" ")[0] || "AFF") + "-" + Math.floor(1000 + Math.random() * 9000)
  const [newUser] = await db
    .insert(affiliateUsers)
    .values({
      userId: `usr_${Date.now()}`,
      userName: data.userName,
      userEmail: data.userEmail,
      phone: data.phone || null,
      paypalEmail: data.paypalEmail || null,
      bankInfo: data.bankInfo || null,
      verificationInfo: data.verificationInfo || null,
      balance: "0.00",
      status: true,
      approved: false, // Requires admin approval
      referralCode: code.toUpperCase(),
      createdAt: new Date(),
    })
    .returning()

  return { success: true, user: newUser }
}
