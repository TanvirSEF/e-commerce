import { db } from "../db"
import {
  sellerPackages,
  sellerPackagePayments,
  customerPackages,
  customerPackagePayments,
  type SellerPackage,
  type SellerPackagePayment,
  type CustomerPackage,
  type CustomerPackagePayment,
} from "../db/schema"
import { eq, desc } from "drizzle-orm"

export const SEED_SELLER_PACKAGES: SellerPackage[] = [
  {
    id: 1,
    name: "Starter Merchant",
    amount: "0.00",
    productUploadLimit: 25,
    duration: 365,
    logo: "/assets/img/package-starter.png",
    status: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Silver Growth",
    amount: "29.00",
    productUploadLimit: 150,
    duration: 30,
    logo: "/assets/img/package-silver.png",
    status: true,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Gold Enterprise",
    amount: "79.00",
    productUploadLimit: 1000,
    duration: 30,
    logo: "/assets/img/package-gold.png",
    status: true,
    createdAt: new Date(),
  },
]

export const SEED_CUSTOMER_PACKAGES: CustomerPackage[] = [
  {
    id: 1,
    name: "Basic Classifieds",
    amount: "0.00",
    productUpload: 5,
    logo: "/assets/img/customer-basic.png",
    status: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Pro Classified Booster",
    amount: "9.99",
    productUpload: 50,
    logo: "/assets/img/customer-pro.png",
    status: true,
    createdAt: new Date(),
  },
]

export const SEED_SELLER_PAYMENTS: (SellerPackagePayment & { sellerName?: string; packageName?: string })[] = [
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
    createdAt: new Date(),
    sellerName: "Apex Retailers Ltd.",
    packageName: "Silver Growth",
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
    createdAt: new Date(),
    sellerName: "Gadget Hub BD",
    packageName: "Gold Enterprise",
  },
]

let inMemorySellerPackages: SellerPackage[] = [...SEED_SELLER_PACKAGES]
let inMemoryCustomerPackages: CustomerPackage[] = [...SEED_CUSTOMER_PACKAGES]
let inMemorySellerPayments: (SellerPackagePayment & { sellerName?: string; packageName?: string })[] = [...SEED_SELLER_PAYMENTS]

// ---------------- Seller Packages ----------------
export async function getAllSellerPackages(): Promise<SellerPackage[]> {
  try {
    const rows = await db.select().from(sellerPackages).orderBy(sellerPackages.id)
    if (rows && rows.length > 0) return rows
  } catch (err) {
    console.warn("getAllSellerPackages fallback:", (err as Error).message)
  }
  return inMemorySellerPackages
}

export async function getSellerPackageById(id: number): Promise<SellerPackage | null> {
  try {
    const [row] = await db.select().from(sellerPackages).where(eq(sellerPackages.id, id)).limit(1)
    if (row) return row
  } catch (err) {
    console.warn("getSellerPackageById fallback:", (err as Error).message)
  }
  return inMemorySellerPackages.find((p) => p.id === id) || null
}

export async function createSellerPackage(data: {
  name: string
  amount: string
  productUploadLimit: number
  duration: number
  logo?: string
}): Promise<SellerPackage> {
  const newPkg: SellerPackage = {
    id: inMemorySellerPackages.length + 1,
    name: data.name,
    amount: data.amount,
    productUploadLimit: data.productUploadLimit,
    duration: data.duration,
    logo: data.logo || null,
    status: true,
    createdAt: new Date(),
  }
  try {
    const [inserted] = await db.insert(sellerPackages).values(newPkg).returning()
    if (inserted) return inserted
  } catch (err) {
    console.warn("createSellerPackage fallback:", (err as Error).message)
  }
  inMemorySellerPackages.push(newPkg)
  return newPkg
}

export async function updateSellerPackage(
  id: number,
  data: Partial<Pick<SellerPackage, "name" | "amount" | "productUploadLimit" | "duration">>
): Promise<boolean> {
  try {
    await db.update(sellerPackages).set(data).where(eq(sellerPackages.id, id))
    return true
  } catch (err) {
    console.warn("updateSellerPackage fallback:", (err as Error).message)
  }
  inMemorySellerPackages = inMemorySellerPackages.map((p) => (p.id === id ? { ...p, ...data } : p))
  return true
}

export async function toggleSellerPackageStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db.update(sellerPackages).set({ status }).where(eq(sellerPackages.id, id))
    return true
  } catch (err) {
    console.warn("toggleSellerPackageStatus fallback:", (err as Error).message)
  }
  inMemorySellerPackages = inMemorySellerPackages.map((p) => (p.id === id ? { ...p, status } : p))
  return true
}

export async function getAllSellerPackagePayments() {
  try {
    const rows = await db.select().from(sellerPackagePayments).orderBy(desc(sellerPackagePayments.createdAt))
    if (rows && rows.length > 0) return rows
  } catch (err) {
    console.warn("getAllSellerPackagePayments fallback:", (err as Error).message)
  }
  return inMemorySellerPayments
}

export async function purchaseSellerPackage(data: {
  sellerId: number
  sellerPackageId: number
  amount: string
  paymentMethod: string
  paymentDetails?: string
  offlinePayment?: boolean
  sellerName?: string
  packageName?: string
}) {
  const newPayment = {
    id: inMemorySellerPayments.length + 1,
    sellerId: data.sellerId,
    sellerPackageId: data.sellerPackageId,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    paymentDetails: data.paymentDetails || null,
    offlinePayment: !!data.offlinePayment,
    approval: true,
    receipt: null,
    createdAt: new Date(),
    sellerName: data.sellerName || "Registered Seller",
    packageName: data.packageName || "Subscription Plan",
  }
  try {
    await db.insert(sellerPackagePayments).values({
      sellerId: newPayment.sellerId,
      sellerPackageId: newPayment.sellerPackageId,
      amount: newPayment.amount,
      paymentMethod: newPayment.paymentMethod,
      paymentDetails: newPayment.paymentDetails,
      offlinePayment: newPayment.offlinePayment,
      approval: newPayment.approval,
    })
  } catch (err) {
    console.warn("purchaseSellerPackage fallback:", (err as Error).message)
  }
  inMemorySellerPayments.unshift(newPayment)
  return { success: true, payment: newPayment }
}

// ---------------- Customer Packages ----------------
export async function getAllCustomerPackages(): Promise<CustomerPackage[]> {
  try {
    const rows = await db.select().from(customerPackages).orderBy(customerPackages.id)
    if (rows && rows.length > 0) return rows
  } catch (err) {
    console.warn("getAllCustomerPackages fallback:", (err as Error).message)
  }
  return inMemoryCustomerPackages
}

export async function createCustomerPackage(data: {
  name: string
  amount: string
  productUpload: number
}): Promise<CustomerPackage> {
  const newPkg: CustomerPackage = {
    id: inMemoryCustomerPackages.length + 1,
    name: data.name,
    amount: data.amount,
    productUpload: data.productUpload,
    logo: null,
    status: true,
    createdAt: new Date(),
  }
  try {
    const [inserted] = await db.insert(customerPackages).values(newPkg).returning()
    if (inserted) return inserted
  } catch (err) {
    console.warn("createCustomerPackage fallback:", (err as Error).message)
  }
  inMemoryCustomerPackages.push(newPkg)
  return newPkg
}

export async function toggleCustomerPackageStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db.update(customerPackages).set({ status }).where(eq(customerPackages.id, id))
    return true
  } catch (err) {
    console.warn("toggleCustomerPackageStatus fallback:", (err as Error).message)
  }
  inMemoryCustomerPackages = inMemoryCustomerPackages.map((p) => (p.id === id ? { ...p, status } : p))
  return true
}
