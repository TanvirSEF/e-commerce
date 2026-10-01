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
  apiUrl?: string
}

export interface OtpLoginSettings {
  otpCustomerRegistration: boolean
  otpOrderVerification: boolean
  otpCodVerification: boolean
  otpDeliveryBoyVerification: boolean
  otpPasswordReset: boolean
  otpWalletRecharge: boolean
  otpResendDurationSec: number
  otpExpireDurationMin: number
}

export interface SmsTemplateItem {
  id: number
  identifier: string
  title: string
  body: string
  variables: string[]
  status: boolean
  createdAt?: string
  updatedAt?: string
}

export interface BulkSmsPayload {
  recipientType: "all_customers" | "all_sellers" | "custom"
  customNumbers?: string
  message: string
  gatewayId?: string
}
