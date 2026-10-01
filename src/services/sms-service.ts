import { db } from "../db"
import { smsTemplates, businessSettings, users } from "../db/schema"
import { eq, and, count } from "drizzle-orm"
import type {
  SmsGatewayConfig,
  OtpLoginSettings,
  SmsTemplateItem,
  BulkSmsPayload,
} from "@/types/otp-sms"
export type {
  SmsGatewayConfig,
  OtpLoginSettings,
  SmsTemplateItem,
  BulkSmsPayload,
} from "@/types/otp-sms"

export const CANONICAL_SMS_GATEWAYS: SmsGatewayConfig[] = [
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
    senderId: "GREENWEB",
  },
  {
    id: "sslwireless",
    name: "SSL Wireless SMS (Bangladesh)",
    status: false,
    apiKey: "SSL-SMS-CLIENT-TOKEN",
    apiSecret: "SSL-SECRET-KEY",
    senderId: "ACTIVE-ECOM",
    apiUrl: "https://smsplus.sslwireless.com/api/v3/send-sms",
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
    name: "Nexmo / Vonage Global",
    status: false,
    apiKey: "NEXMO-API-KEY",
    apiSecret: "NEXMO-API-SECRET",
    senderId: "ECOM-OTP",
  },
  {
    id: "fast2sms",
    name: "Fast2SMS (India)",
    status: false,
    apiKey: "FAST2SMS-API-KEY",
    senderId: "FASTSMS",
  },
]

export const CANONICAL_OTP_SETTINGS: OtpLoginSettings = {
  otpCustomerRegistration: true,
  otpOrderVerification: false,
  otpCodVerification: true,
  otpDeliveryBoyVerification: true,
  otpPasswordReset: true,
  otpWalletRecharge: false,
  otpResendDurationSec: 60,
  otpExpireDurationMin: 5,
}

export const CANONICAL_SMS_TEMPLATES: Omit<SmsTemplateItem, "id">[] = [
  {
    identifier: "phone_verification_otp",
    title: "Phone Verification OTP Code",
    body: "Your verification code is [[otp_code]]. Valid for 5 minutes. Do not share this PIN with anyone - [[site_name]].",
    variables: ["[[otp_code]]", "[[site_name]]"],
    status: true,
  },
  {
    identifier: "order_placed",
    title: "Order Placed Successfully",
    body: "Dear [[customer_name]], your order [[order_code]] has been received. Total: [[total_amount]]. Thank you for shopping with [[site_name]]!",
    variables: ["[[customer_name]]", "[[order_code]]", "[[total_amount]]", "[[site_name]]"],
    status: true,
  },
  {
    identifier: "order_confirmed",
    title: "Order Confirmed & Processing",
    body: "Hello [[customer_name]], your order [[order_code]] is confirmed and packed for courier dispatch by [[site_name]].",
    variables: ["[[customer_name]]", "[[order_code]]", "[[site_name]]"],
    status: true,
  },
  {
    identifier: "order_picked_up",
    title: "Order Picked Up by Delivery Boy",
    body: "Dear [[customer_name]], order [[order_code]] has been picked up by delivery personnel [[delivery_boy_name]].",
    variables: ["[[customer_name]]", "[[order_code]]", "[[delivery_boy_name]]", "[[site_name]]"],
    status: true,
  },
  {
    identifier: "order_on_the_way",
    title: "Order On The Way",
    body: "Dear [[customer_name]], your order [[order_code]] is out for delivery. Rider: [[delivery_boy_name]] (Phone: [[delivery_boy_phone]]).",
    variables: ["[[customer_name]]", "[[order_code]]", "[[delivery_boy_name]]", "[[delivery_boy_phone]]"],
    status: true,
  },
  {
    identifier: "order_shipped",
    title: "Order Shipped with Tracking",
    body: "Your order [[order_code]] has been handed over to [[courier_name]] (Tracking: [[tracking_code]]). Track online at [[site_url]].",
    variables: ["[[customer_name]]", "[[order_code]]", "[[courier_name]]", "[[tracking_code]]", "[[site_url]]"],
    status: true,
  },
  {
    identifier: "delivery_completed",
    title: "Order Delivered Successfully",
    body: "Order [[order_code]] has been delivered successfully. We appreciate your purchase with [[site_name]]!",
    variables: ["[[customer_name]]", "[[order_code]]", "[[site_name]]"],
    status: true,
  },
  {
    identifier: "order_cancelled",
    title: "Order Cancelled Notification",
    body: "Dear [[customer_name]], your order [[order_code]] has been cancelled. Please visit [[site_url]] for more details.",
    variables: ["[[customer_name]]", "[[order_code]]", "[[site_name]]", "[[site_url]]"],
    status: true,
  },
  {
    identifier: "order_paid",
    title: "Order Payment Received",
    body: "Payment of [[amount]] for order [[order_code]] received successfully. Thank you - [[site_name]].",
    variables: ["[[customer_name]]", "[[order_code]]", "[[amount]]", "[[site_name]]"],
    status: true,
  },
  {
    identifier: "assign_delivery_boy",
    title: "Delivery Boy Assignment",
    body: "New delivery assigned: Order [[order_code]]. Pickup and deliver promptly - [[site_name]].",
    variables: ["[[order_code]]", "[[delivery_boy_name]]", "[[site_name]]"],
    status: true,
  },
]

export async function getSmsGateways(): Promise<SmsGatewayConfig[]> {
  try {
    const [row] = await db
      .select({ value: businessSettings.value })
      .from(businessSettings)
      .where(eq(businessSettings.type, "sms_gateway_settings"))
      .limit(1)

    if (row?.value) {
      const parsed = JSON.parse(row.value) as SmsGatewayConfig[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (err) {
    console.error("getSmsGateways error:", err)
  }
  return CANONICAL_SMS_GATEWAYS
}

export async function updateSmsGateway(gatewayId: string, data: Partial<SmsGatewayConfig>): Promise<void> {
  try {
    const current = await getSmsGateways()
    const updated = current.map((g) => (g.id === gatewayId ? { ...g, ...data } : g))
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
  } catch (err) {
    console.error("updateSmsGateway error:", err)
    throw err
  }
}

export async function getOtpSettings(): Promise<OtpLoginSettings> {
  try {
    const [row] = await db
      .select({ value: businessSettings.value })
      .from(businessSettings)
      .where(eq(businessSettings.type, "otp_login_settings"))
      .limit(1)

    if (row?.value) {
      return { ...CANONICAL_OTP_SETTINGS, ...JSON.parse(row.value) }
    }
  } catch (err) {
    console.error("getOtpSettings error:", err)
  }
  return CANONICAL_OTP_SETTINGS
}

export async function updateOtpSettings(data: Partial<OtpLoginSettings>): Promise<void> {
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
  } catch (err) {
    console.error("updateOtpSettings error:", err)
    throw err
  }
}

export async function getSmsTemplates(): Promise<SmsTemplateItem[]> {
  try {
    const rows = await db.select().from(smsTemplates).orderBy(smsTemplates.id)
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        identifier: r.identifier,
        title: r.title,
        body: r.body,
        variables: (r.variables as string[]) || [],
        status: r.status,
        createdAt: r.createdAt.toISOString().slice(0, 10),
        updatedAt: r.updatedAt.toISOString().slice(0, 10),
      }))
    }
  } catch (err) {
    console.error("getSmsTemplates error:", err)
  }
  return []
}

export async function updateSmsTemplate(
  id: number,
  data: { body: string; status: boolean }
): Promise<void> {
  try {
    await db
      .update(smsTemplates)
      .set({
        body: data.body,
        status: data.status,
        updatedAt: new Date(),
      })
      .where(eq(smsTemplates.id, id))
  } catch (err) {
    console.error("updateSmsTemplate error:", err)
    throw err
  }
}

export async function getRecipientCounts(): Promise<{ customers: number; sellers: number }> {
  try {
    const [cCount, sCount] = await Promise.all([
      db.select({ c: count() }).from(users).where(eq(users.role, "customer")),
      db.select({ c: count() }).from(users).where(eq(users.role, "seller")),
    ])
    return {
      customers: Number(cCount[0]?.c ?? 0),
      sellers: Number(sCount[0]?.c ?? 0),
    }
  } catch (err) {
    console.error("getRecipientCounts error:", err)
    return { customers: 0, sellers: 0 }
  }
}

export async function sendBulkSms(
  payload: BulkSmsPayload
): Promise<{ success: boolean; count: number }> {
  try {
    let recipientCount = 0
    if (payload.recipientType === "custom") {
      recipientCount = (payload.customNumbers || "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0).length
    } else if (payload.recipientType === "all_customers") {
      const counts = await getRecipientCounts()
      recipientCount = counts.customers
    } else if (payload.recipientType === "all_sellers") {
      const counts = await getRecipientCounts()
      recipientCount = counts.sellers
    }

    return { success: true, count: recipientCount }
  } catch (err) {
    console.error("sendBulkSms error:", err)
    throw err
  }
}
