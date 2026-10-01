"use server"

import { revalidatePath } from "next/cache"
import {
  updateSmsGateway,
  updateOtpSettings,
  sendBulkSms,
  updateSmsTemplate,
} from "@/services/sms-service"
import type {
  SmsGatewayConfig,
  OtpLoginSettings,
  BulkSmsPayload,
} from "@/types/otp-sms"

export async function updateSmsGatewayAction(
  gatewayId: string,
  data: Partial<SmsGatewayConfig>
) {
  await updateSmsGateway(gatewayId, data)
  revalidatePath("/admin/otp-configuration")
  revalidatePath("/admin/sms")
  return { success: true }
}

export async function updateOtpSettingsAction(data: Partial<OtpLoginSettings>) {
  await updateOtpSettings(data)
  revalidatePath("/admin/otp-login-configuration")
  return { success: true }
}

export async function sendBulkSmsAction(payload: BulkSmsPayload) {
  const result = await sendBulkSms(payload)
  revalidatePath("/admin/sms")
  return result
}

export async function updateSmsTemplateAction(
  id: number,
  data: { body: string; status: boolean }
) {
  await updateSmsTemplate(id, data)
  revalidatePath("/admin/sms-templates")
  return { success: true }
}
