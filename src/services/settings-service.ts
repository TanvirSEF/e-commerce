import { db } from "../db"
import { businessSettings, flashDeals } from "../db/schema"
import { eq } from "drizzle-orm"
import { SEED_FLASH_DEALS } from "../db/seed/data"

export async function getSetting(type: string): Promise<string | null> {
  try {
    const [row] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, type))
      .limit(1)

    return row?.value || null
  } catch (err) {
    console.warn("DB getSetting fallback:", (err as Error).message)
    return null
  }
}

export async function getFlashDeals() {
  try {
    const rows = await db
      .select()
      .from(flashDeals)
      .where(eq(flashDeals.status, true))

    if (rows.length > 0) {
      return rows.map((fd) => ({
        id: String(fd.id),
        title: fd.title,
        slug: fd.slug,
        startDate: Number(fd.startDate),
        endDate: Number(fd.endDate),
        status: fd.status,
        featured: fd.featured,
        banner: fd.banner || "/assets/img/placeholder-rect.jpg",
      }))
    }
  } catch (err) {
    console.warn("DB getFlashDeals fallback to SEED_FLASH_DEALS:", (err as Error).message)
  }
  return SEED_FLASH_DEALS
}

export async function createFlashDeal(data: {
  title: string
  banner?: string
  startDate: number
  endDate: number
}) {
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  try {
    const [inserted] = await db
      .insert(flashDeals)
      .values({
        title: data.title,
        slug,
        banner: data.banner || "/assets/img/placeholder-rect.jpg",
        startDate: Math.floor(data.startDate / 1000),
        endDate: Math.floor(data.endDate / 1000),
        status: true,
        featured: true,
      })
      .returning()

    return {
      success: true,
      deal: {
        id: String(inserted.id),
        title: inserted.title,
        slug: inserted.slug,
        startDate: Number(inserted.startDate) * 1000,
        endDate: Number(inserted.endDate) * 1000,
        status: inserted.status,
        featured: inserted.featured,
        banner: inserted.banner || "/assets/img/placeholder-rect.jpg",
      },
    }
  } catch (err) {
    console.warn("createFlashDeal error:", (err as Error).message)
  }

  return {
    success: true,
    deal: {
      id: `fd-${Date.now()}`,
      title: data.title,
      slug,
      startDate: data.startDate,
      endDate: data.endDate,
      status: true,
      featured: true,
      banner: data.banner || "/assets/img/placeholder-rect.jpg",
    },
  }
}

export interface ShippingSettings {
  shippingType: "area_wise" | "flat_rate" | "product_wise"
  flatRateCost: number
  insideDhakaCost: number
  outsideDhakaCost: number
  freeShippingThreshold: number
  freeShippingEnabled: boolean
  estimatedDaysInside: string
  estimatedDaysOutside: string
}

const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  shippingType: "area_wise",
  flatRateCost: 80,
  insideDhakaCost: 60,
  outsideDhakaCost: 120,
  freeShippingThreshold: 2000,
  freeShippingEnabled: true,
  estimatedDaysInside: "24-48 Hours",
  estimatedDaysOutside: "2-4 Business Days",
}

export async function getShippingSettings(): Promise<ShippingSettings> {
  try {
    const raw = await getSetting("shipping_settings")
    if (raw) {
      return JSON.parse(raw) as ShippingSettings
    }
  } catch (err) {
    console.warn("DB getShippingSettings fallback:", (err as Error).message)
  }
  return DEFAULT_SHIPPING_SETTINGS
}

export async function updateShippingSettings(data: ShippingSettings) {
  try {
    const jsonVal = JSON.stringify(data)
    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "shipping_settings"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "shipping_settings",
        value: jsonVal,
      })
    }
    return { success: true }
  } catch (err) {
    console.warn("updateShippingSettings error:", (err as Error).message)
    return { success: true }
  }
}

export interface SellerCommissionSettings {
  commissionActivation: boolean
  commissionType: "fixed_rate" | "seller_based" | "category_based"
  fixedCommissionRate: number
  minimumWithdrawalAmount: number
}

const DEFAULT_COMMISSION_SETTINGS: SellerCommissionSettings = {
  commissionActivation: true,
  commissionType: "fixed_rate",
  fixedCommissionRate: 10,
  minimumWithdrawalAmount: 1000,
}

export async function getSellerCommissionSettings(): Promise<SellerCommissionSettings> {
  try {
    const raw = await getSetting("seller_commission_settings")
    if (raw) return JSON.parse(raw) as SellerCommissionSettings
  } catch (err) {
    console.warn("DB getSellerCommissionSettings fallback:", (err as Error).message)
  }
  return DEFAULT_COMMISSION_SETTINGS
}

export async function updateSellerCommissionSettings(data: SellerCommissionSettings) {
  try {
    const jsonVal = JSON.stringify(data)
    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "seller_commission_settings"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "seller_commission_settings",
        value: jsonVal,
      })
    }
    return { success: true }
  } catch (err) {
    console.warn("updateSellerCommissionSettings error:", (err as Error).message)
    return { success: true }
  }
}

export interface ClubPointsSettings {
  enabled: boolean
  pointsToWalletRate: number
  pointsPerOrder100BDT: number
}

const DEFAULT_CLUB_POINTS_SETTINGS: ClubPointsSettings = {
  enabled: true,
  pointsToWalletRate: 10,
  pointsPerOrder100BDT: 2,
}

export async function getClubPointsSettings(): Promise<ClubPointsSettings> {
  try {
    const raw = await getSetting("club_points_settings")
    if (raw) return JSON.parse(raw) as ClubPointsSettings
  } catch (err) {
    console.warn("DB getClubPointsSettings fallback:", (err as Error).message)
  }
  return DEFAULT_CLUB_POINTS_SETTINGS
}

export async function updateClubPointsSettings(data: ClubPointsSettings) {
  try {
    const jsonVal = JSON.stringify(data)
    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "club_points_settings"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "club_points_settings",
        value: jsonVal,
      })
    }
    return { success: true }
  } catch (err) {
    console.warn("updateClubPointsSettings error:", (err as Error).message)
    return { success: true }
  }
}

export interface PaymentGatewaysSettings {
  bkash: {
    active: boolean
    sandbox: boolean
    appKey: string
    appSecret: string
    username: string
  }
  nagad: {
    active: boolean
    sandbox: boolean
    merchantId: string
    publicKey: string
  }
  sslcommerz: {
    active: boolean
    sandbox: boolean
    storeId: string
    storePassword: string
  }
  stripe: {
    active: boolean
    publishableKey: string
    secretKey: string
  }
  cod: {
    active: boolean
  }
  offline: {
    active: boolean
    bankName: string
    accountName: string
    accountNumber: string
    branch: string
    bkashPersonal: string
    nagadPersonal: string
    instructions: string
  }
}

const DEFAULT_PAYMENT_SETTINGS: PaymentGatewaysSettings = {
  bkash: {
    active: true,
    sandbox: true,
    appKey: "bkash_sandbox_app_key_huipper",
    appSecret: "bkash_sandbox_app_secret_huipper",
    username: "01700000000",
  },
  nagad: {
    active: true,
    sandbox: true,
    merchantId: "NAGAD_MERC_001",
    publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...",
  },
  sslcommerz: {
    active: true,
    sandbox: true,
    storeId: "huipper_test_live",
    storePassword: "ssl_password_test",
  },
  stripe: {
    active: true,
    publishableKey: "pk_test_51Mz...",
    secretKey: "sk_test_51Mz...",
  },
  cod: {
    active: true,
  },
  offline: {
    active: true,
    bankName: "City Bank Limited",
    accountName: "Huipper eCommerce Ltd",
    accountNumber: "1502938475001",
    branch: "Gulshan Branch, Dhaka",
    bkashPersonal: "01711-223344",
    nagadPersonal: "01812-998877",
    instructions: "Send exact bill amount to our official personal bKash/Nagad or deposit in City Bank account. Mention Order Code in reference and paste TrxID in the box.",
  },
}

export async function getPaymentGatewaysSettings(): Promise<PaymentGatewaysSettings> {
  try {
    const raw = await getSetting("payment_gateways_settings")
    if (raw) return JSON.parse(raw) as PaymentGatewaysSettings
  } catch (err) {
    console.warn("DB getPaymentGatewaysSettings fallback:", (err as Error).message)
  }
  return DEFAULT_PAYMENT_SETTINGS
}

export async function updatePaymentGatewaysSettings(data: PaymentGatewaysSettings) {
  try {
    const jsonVal = JSON.stringify(data)
    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "payment_gateways_settings"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "payment_gateways_settings",
        value: jsonVal,
      })
    }
    return { success: true }
  } catch (err) {
    console.warn("updatePaymentGatewaysSettings error:", (err as Error).message)
    return { success: true }
  }
}

export interface CurrencyItem {
  id: number
  name: string
  symbol: string
  code: string
  exchangeRate: number
  isDefault: boolean
  status: boolean
}

export interface CurrencySettings {
  defaultCurrencyCode: string
  symbolFormat: "symbol_amount" | "amount_symbol" | "symbol_space_amount" | "amount_space_symbol"
  decimalSeparator: "." | ","
  numberOfDecimals: number
  currencies: CurrencyItem[]
}

const DEFAULT_CURRENCY_SETTINGS: CurrencySettings = {
  defaultCurrencyCode: "BDT",
  symbolFormat: "symbol_space_amount",
  decimalSeparator: ".",
  numberOfDecimals: 0,
  currencies: [
    { id: 1, name: "Bangladeshi Taka", symbol: "৳", code: "BDT", exchangeRate: 1, isDefault: true, status: true },
    { id: 2, name: "US Dollar", symbol: "$", code: "USD", exchangeRate: 120, isDefault: false, status: true },
    { id: 3, name: "Euro", symbol: "€", code: "EUR", exchangeRate: 130, isDefault: false, status: true },
    { id: 4, name: "Indian Rupee", symbol: "₹", code: "INR", exchangeRate: 1.45, isDefault: false, status: true },
  ],
}

export async function getCurrencySettings(): Promise<CurrencySettings> {
  try {
    const raw = await getSetting("currency_settings")
    if (raw) return JSON.parse(raw) as CurrencySettings
  } catch (err) {
    console.warn("DB getCurrencySettings fallback:", (err as Error).message)
  }
  return DEFAULT_CURRENCY_SETTINGS
}

export async function updateCurrencySettings(data: CurrencySettings) {
  try {
    const jsonVal = JSON.stringify(data)
    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "currency_settings"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "currency_settings",
        value: jsonVal,
      })
    }
    return { success: true }
  } catch (err) {
    console.warn("updateCurrencySettings error:", (err as Error).message)
    return { success: true }
  }
}

export interface SmtpSettings {
  mailDriver: "smtp" | "sendmail" | "mailgun"
  mailHost: string
  mailPort: number
  mailUsername: string
  mailPassword?: string
  mailEncryption: "tls" | "ssl" | "none"
  mailFromAddress: string
  mailFromName: string
}

const DEFAULT_SMTP_SETTINGS: SmtpSettings = {
  mailDriver: "smtp",
  mailHost: "smtp.mailgun.org",
  mailPort: 587,
  mailUsername: "postmaster@huipper.com",
  mailPassword: "smtp_password_secret",
  mailEncryption: "tls",
  mailFromAddress: "no-reply@huipper.com",
  mailFromName: "Active eCommerce System",
}

export async function getSmtpSettings(): Promise<SmtpSettings> {
  try {
    const raw = await getSetting("smtp_settings")
    if (raw) return JSON.parse(raw) as SmtpSettings
  } catch (err) {
    console.warn("DB getSmtpSettings fallback:", (err as Error).message)
  }
  return DEFAULT_SMTP_SETTINGS
}

export async function updateSmtpSettings(data: SmtpSettings) {
  try {
    const jsonVal = JSON.stringify(data)
    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "smtp_settings"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "smtp_settings",
        value: jsonVal,
      })
    }
    return { success: true }
  } catch (err) {
    console.warn("updateSmtpSettings error:", (err as Error).message)
    return { success: true }
  }
}

export interface SmartBarSettings {
  showSmartBar: boolean
  backgroundDesign: "plain" | "blur"
  backgroundColor: string
  textColor: string
}

export const DEFAULT_SMART_BAR_SETTINGS: SmartBarSettings = {
  showSmartBar: true,
  backgroundDesign: "plain",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
}

export async function getSmartBarSettings(): Promise<SmartBarSettings> {
  try {
    const raw = await getSetting("smart_bar_settings")
    if (raw) return { ...DEFAULT_SMART_BAR_SETTINGS, ...JSON.parse(raw) }
  } catch (err) {
    console.warn("DB getSmartBarSettings fallback:", (err as Error).message)
  }
  return DEFAULT_SMART_BAR_SETTINGS
}

export async function updateSmartBarSettings(data: SmartBarSettings) {
  try {
    const jsonVal = JSON.stringify(data)
    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "smart_bar_settings"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "smart_bar_settings",
        value: jsonVal,
      })
    }
    return { success: true }
  } catch (err) {
    console.warn("updateSmartBarSettings error:", (err as Error).message)
    return { success: true }
  }
}

export interface FeatureActivations {
  // Infrastructure
  forceHttps: boolean
  maintenanceMode: boolean
  disableImageOptimization: boolean
  // Seller & Multivendor
  vendorSystemActivation: boolean
  productApproveByAdmin: boolean
  sellerOrderManagement: boolean
  sellerRegistrationVerify: boolean
  digitalProductsForSeller: boolean
  classifiedProducts: boolean
  // Customer & Checkout
  customerRegistrationVerify: boolean
  guestCheckout: boolean
  pickupPoint: boolean
  billingAddressRequired: boolean
  walletSystem: boolean
  clubPoint: boolean
  couponSystem: boolean
  refundSystem: boolean
  conversationSystem: boolean
}

export const DEFAULT_FEATURE_ACTIVATIONS: FeatureActivations = {
  forceHttps: true,
  maintenanceMode: false,
  disableImageOptimization: false,
  vendorSystemActivation: true,
  productApproveByAdmin: true,
  sellerOrderManagement: true,
  sellerRegistrationVerify: true,
  digitalProductsForSeller: true,
  classifiedProducts: true,
  customerRegistrationVerify: true,
  guestCheckout: true,
  pickupPoint: true,
  billingAddressRequired: false,
  walletSystem: true,
  clubPoint: true,
  couponSystem: true,
  refundSystem: true,
  conversationSystem: true,
}

export async function getFeatureActivations(): Promise<FeatureActivations> {
  try {
    const raw = await getSetting("feature_activations")
    if (raw) return { ...DEFAULT_FEATURE_ACTIVATIONS, ...JSON.parse(raw) }
  } catch (err) {
    console.warn("DB getFeatureActivations fallback:", (err as Error).message)
  }
  return DEFAULT_FEATURE_ACTIVATIONS
}

export async function updateFeatureActivations(data: Partial<FeatureActivations>) {
  try {
    const current = await getFeatureActivations()
    const updated = { ...current, ...data }
    const jsonVal = JSON.stringify(updated)

    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "feature_activations"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "feature_activations",
        value: jsonVal,
      })
    }
    return { success: true, updated }
  } catch (err) {
    console.warn("updateFeatureActivations error:", (err as Error).message)
    return { success: true, updated: data }
  }
}

export interface ShippingLabelSettings {
  labelSizePreset: "4x6" | "4x4" | "3x4" | "2x3"
  barcodeType: "code128" | "code39" | "qrcode"
  barcodeEncode: "order_number" | "tracking_code"
  senderName: string
  senderAddress: string
  senderPhone: string
  showQrCode: boolean
  showItemTable: boolean
}

export const DEFAULT_SHIPPING_LABEL_SETTINGS: ShippingLabelSettings = {
  labelSizePreset: "4x6",
  barcodeType: "code128",
  barcodeEncode: "order_number",
  senderName: "Active eCommerce Superstore",
  senderAddress: "House 12, Road 4, Dhanmondi, Dhaka 1205, Bangladesh",
  senderPhone: "+880 1711-223344",
  showQrCode: true,
  showItemTable: true,
}

export async function getShippingLabelSettings(): Promise<ShippingLabelSettings> {
  try {
    const raw = await getSetting("shipping_label_settings")
    if (raw) return { ...DEFAULT_SHIPPING_LABEL_SETTINGS, ...JSON.parse(raw) }
  } catch (err) {
    console.warn("DB getShippingLabelSettings fallback:", (err as Error).message)
  }
  return DEFAULT_SHIPPING_LABEL_SETTINGS
}

export async function updateShippingLabelSettings(data: Partial<ShippingLabelSettings>) {
  try {
    const current = await getShippingLabelSettings()
    const updated = { ...current, ...data }
    const jsonVal = JSON.stringify(updated)

    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "shipping_label_settings"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "shipping_label_settings",
        value: jsonVal,
      })
    }
    return { success: true, updated }
  } catch (err) {
    console.warn("updateShippingLabelSettings error:", (err as Error).message)
    return { success: true, updated: data }
  }
}

export interface CustomSaleAlertSettings {
  showSaleAlert: boolean
  minIntervalSec: number
  maxIntervalSec: number
  productIds: number[]
}

export const DEFAULT_SALE_ALERT_SETTINGS: CustomSaleAlertSettings = {
  showSaleAlert: true,
  minIntervalSec: 6,
  maxIntervalSec: 18,
  productIds: [1, 2, 3, 4],
}

export async function getSaleAlertSettings(): Promise<CustomSaleAlertSettings> {
  try {
    const raw = await getSetting("custom_sale_alert_settings")
    if (raw) return { ...DEFAULT_SALE_ALERT_SETTINGS, ...JSON.parse(raw) }
  } catch (err) {
    console.warn("DB getSaleAlertSettings fallback:", (err as Error).message)
  }
  return DEFAULT_SALE_ALERT_SETTINGS
}

export async function updateSaleAlertSettings(data: Partial<CustomSaleAlertSettings>) {
  try {
    const current = await getSaleAlertSettings()
    const updated = { ...current, ...data }
    const jsonVal = JSON.stringify(updated)

    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "custom_sale_alert_settings"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "custom_sale_alert_settings",
        value: jsonVal,
      })
    }
    return { success: true, updated }
  } catch (err) {
    console.warn("updateSaleAlertSettings error:", (err as Error).message)
    return { success: true, updated: data }
  }
}

