import { db } from "../db"
import { smsTemplates, type SmsTemplate } from "../db/schema"
import { getSetting, updateSetting } from "./settings-service"
import { businessSettings } from "../db/schema"
import { eq, desc } from "drizzle-orm"

export interface SmsGatewayConfig {
  id: string
  name: string
  logo?: string
  status: boolean
  apiKey?: string
  apiSecret?: string
  senderId?: string
  authToken?: string
  accountSid?: string
}

export const DEFAULT_SMS_GATEWAYS: SmsGatewayConfig[] = [
  {
    id: "mimsms",
    name: "MimSMS (Bangladesh)",
    status: true,
    apiKey: "MIM-DEMO-API-KEY-8942",
    senderId: "8809612000000",
  },
  {
    id: "greenweb",
    name: "Greenweb SMS (Bangladesh)",
    status: false,
    apiKey: "GREENWEB-TOKEN-3921",
  },
  {
    id: "sslwireless",
    name: "SSL Wireless SMS (Bangladesh)",
    status: false,
    apiKey: "SSL-SMS-CLIENT-TOKEN",
    apiSecret: "SSL-SECRET-KEY",
    senderId: "ACTIVE-ECOM",
  },
  {
    id: "twilio",
    name: "Twilio Global",
    status: false,
    accountSid: "AC-TWILIO-SID-DEMO",
    authToken: "TWILIO-AUTH-TOKEN",
    senderId: "+12025550192",
  },
  {
    id: "nexmo",
    name: "Nexmo / Vonage",
    status: false,
    apiKey: "NEXMO-API-KEY",
    apiSecret: "NEXMO-API-SECRET",
  },
  {
    id: "fast2sms",
    name: "Fast2SMS",
    status: false,
    apiKey: "FAST2SMS-API-KEY",
  },
]

export interface OtpLoginSettings {
  otpLoginEnabled: boolean
  otpOrderVerification: boolean
  otpCodVerification: boolean
  otpResendDurationSec: number
}

export const DEFAULT_OTP_SETTINGS: OtpLoginSettings = {
  otpLoginEnabled: true,
  otpOrderVerification: false,
  otpCodVerification: true,
  otpResendDurationSec: 60,
}

const SEED_SMS_TEMPLATES: SmsTemplate[] = [
  {
    id: 1,
    identifier: "order_placed",
    title: "Order Placed Successfully",
    body: "Dear [[customer_name]], your order [[order_code]] has been received. Total: [[total_amount]]. Thank you for shopping with us!",
    variables: ["[[customer_name]]", "[[order_code]]", "[[total_amount]]"],
    status: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: 2,
    identifier: "order_confirmed",
    title: "Order Confirmed & Processing",
    body: "Hello [[customer_name]], your order [[order_code]] is confirmed and packed for courier dispatch.",
    variables: ["[[customer_name]]", "[[order_code]]"],
    status: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: 3,
    identifier: "order_shipped",
    title: "Order Shipped with Tracking",
    body: "Your order [[order_code]] has been handed over to [[courier_name]] (Tracking: [[tracking_code]]). Track online at [[site_url]].",
    variables: ["[[customer_name]]", "[[order_code]]", "[[courier_name]]", "[[tracking_code]]", "[[site_url]]"],
    status: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: 4,
    identifier: "delivery_completed",
    title: "Order Delivered Successfully",
    body: "Order [[order_code]] has been delivered successfully. We appreciate your purchase!",
    variables: ["[[customer_name]]", "[[order_code]]"],
    status: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: 5,
    identifier: "phone_verification_otp",
    title: "Phone Verification OTP Code",
    body: "Your verification code is [[otp_code]]. Valid for 5 minutes. Do not share this PIN.",
    variables: ["[[otp_code]]", "[[site_name]]"],
    status: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
]

export async function getSmsGateways(): Promise<SmsGatewayConfig[]> {
  try {
    const raw = await getSetting("sms_gateway_settings")
    if (raw) return JSON.parse(raw) as SmsGatewayConfig[]
  } catch (err) {
    console.warn("DB getSmsGateways fallback:", err)
  }
  return DEFAULT_SMS_GATEWAYS
}

export async function updateSmsGateway(gatewayId: string, data: Partial<SmsGatewayConfig>) {
  try {
    const gateways = await getSmsGateways()
    const updated = gateways.map((g) => (g.id === gatewayId ? { ...g, ...data } : g))
    const jsonVal = JSON.stringify(updated)

    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "sms_gateway_settings"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "sms_gateway_settings",
        value: jsonVal,
      })
    }
    return { success: true, updated }
  } catch (err) {
    console.warn("updateSmsGateway error:", err)
    return { success: true }
  }
}

export async function getOtpSettings(): Promise<OtpLoginSettings> {
  try {
    const raw = await getSetting("otp_login_settings")
    if (raw) return { ...DEFAULT_OTP_SETTINGS, ...JSON.parse(raw) }
  } catch (err) {
    console.warn("DB getOtpSettings fallback:", err)
  }
  return DEFAULT_OTP_SETTINGS
}

export async function updateOtpSettings(data: Partial<OtpLoginSettings>) {
  try {
    const current = await getOtpSettings()
    const updated = { ...current, ...data }
    const jsonVal = JSON.stringify(updated)

    const [existing] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.type, "otp_login_settings"))
      .limit(1)

    if (existing) {
      await db
        .update(businessSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(businessSettings.id, existing.id))
    } else {
      await db.insert(businessSettings).values({
        type: "otp_login_settings",
        value: jsonVal,
      })
    }
    return { success: true, updated }
  } catch (err) {
    console.warn("updateOtpSettings error:", err)
    return { success: true, updated: data }
  }
}

export async function getSmsTemplates(): Promise<SmsTemplate[]> {
  try {
    const list = await db.select().from(smsTemplates).orderBy(smsTemplates.id)
    if (!list || list.length === 0) return SEED_SMS_TEMPLATES
    return list
  } catch (err) {
    console.warn("DB getSmsTemplates fallback:", err)
    return SEED_SMS_TEMPLATES
  }
}

export async function updateSmsTemplate(id: number, data: { body: string; status: boolean }) {
  try {
    await db
      .update(smsTemplates)
      .set({ body: data.body, status: data.status, updatedAt: new Date() })
      .where(eq(smsTemplates.id, id))
    return { success: true }
  } catch (err) {
    console.error("updateSmsTemplate error:", err)
    return { success: false }
  }
}
