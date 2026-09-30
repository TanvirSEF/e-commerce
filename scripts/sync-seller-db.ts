import { db } from "../src/db"
import {
  shops,
  sellerWithdrawRequests,
  sellerPackages,
  sellerPackagePayments,
  businessSettings,
} from "../src/db/schema"
import { eq } from "drizzle-orm"

async function syncSellerDatabase() {
  console.log("Starting Seller Module Database Synchronization...")

  // 1. Link shops to user and update verification info
  await db
    .update(shops)
    .set({
      userId: "usr_seller_default_01",
      verificationStatus: true,
      verificationInfo: {
        nidNumber: "19942691234567890",
        tradeLicense: "TRAD/DNCC/029141",
        documentType: "Trade License & NID",
        documentUrl: "/assets/img/placeholder.jpg",
        bankName: "City Bank PLC",
        bankAccount: "1102948192001",
        submittedAt: "2026-03-20 12:45",
      },
    })
    .where(eq(shops.id, 1))

  await db
    .update(shops)
    .set({
      userId: "usr_seller_default_01",
      verificationStatus: false,
      verificationInfo: {
        nidNumber: "19922699887766554",
        tradeLicense: "TRAD/DSCC/081290",
        documentType: "Trade License",
        documentUrl: "/assets/img/placeholder.jpg",
        bankName: "BRAC Bank PLC",
        bankAccount: "1501203948571001",
        submittedAt: "2026-03-22 16:30",
      },
    })
    .where(eq(shops.id, 2))

  await db
    .update(shops)
    .set({
      userId: "usr_seller_default_01",
      verificationStatus: false,
      verificationInfo: {
        nidNumber: "19885566778899001",
        tradeLicense: "TRAD/GCC/991204",
        documentType: "Trade License",
        documentUrl: "/assets/img/placeholder.jpg",
        bankName: "Dutch-Bangla Bank PLC",
        bankAccount: "105120048192",
        submittedAt: "2026-03-24 10:15",
      },
    })
    .where(eq(shops.id, 4))

  // 2. Seed seller withdraw requests if empty
  const existingWithdraws = await db.select().from(sellerWithdrawRequests)
  if (existingWithdraws.length === 0) {
    console.log("Seeding seller withdraw requests...")
    await db.insert(sellerWithdrawRequests).values([
      {
        id: 1,
        userId: "usr_seller_default_01",
        shopId: 1,
        amount: "15400.00",
        message: "Monthly sales payout via bKash Merchant",
        status: "pending",
        paymentMethod: "bKash",
        transactionId: null,
        adminNote: null,
      },
      {
        id: 2,
        userId: "usr_seller_default_01",
        shopId: 2,
        amount: "32000.00",
        message: "Bank transfer to City Bank A/C: 1102938481",
        status: "paid",
        paymentMethod: "Bank Transfer",
        transactionId: "TXN-CITY-98214",
        adminNote: "Disbursed via automated BEFTN batch",
      },
      {
        id: 3,
        userId: "usr_seller_default_01",
        shopId: 4,
        amount: "7500.00",
        message: "Weekly settlement",
        status: "pending",
        paymentMethod: "Cash",
        transactionId: null,
        adminNote: null,
      },
    ])
  }

  // 3. Seed seller package payments if empty
  const existingPayments = await db.select().from(sellerPackagePayments)
  if (existingPayments.length === 0) {
    console.log("Seeding seller package payments...")
    await db.insert(sellerPackagePayments).values([
      {
        id: 1,
        sellerId: 1,
        sellerPackageId: 2,
        amount: "29.00",
        paymentMethod: "bKash",
        paymentDetails: "TrxID: 9X238FA2",
        offlinePayment: false,
        approval: true,
        receipt: null,
      },
      {
        id: 2,
        sellerId: 2,
        sellerPackageId: 3,
        amount: "79.00",
        paymentMethod: "Bank Slip",
        paymentDetails: "Bank: City Bank, Dep Ref #55412",
        offlinePayment: true,
        approval: true,
        receipt: "/uploads/slips/slip-55412.jpg",
      },
    ])
  }

  // 4. Ensure businessSettings has default commission configuration
  const defaultCommission = JSON.stringify({
    commissionActivation: true,
    commissionType: "fixed_rate",
    fixedCommissionRate: 10,
    minimumWithdrawalAmount: 1000,
  })

  const [commSetting] = await db
    .select()
    .from(businessSettings)
    .where(eq(businessSettings.type, "seller_commission_settings"))
    .limit(1)

  if (!commSetting) {
    await db.insert(businessSettings).values({
      type: "seller_commission_settings",
      value: defaultCommission,
    })
  }

  console.log("Seller database sync finished successfully!")
}

syncSellerDatabase()
  .catch((err) => {
    console.error("Error during seller db sync:", err)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
