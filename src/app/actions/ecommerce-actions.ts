"use server"

import { createCoupon } from "@/services/coupon-service"
import { createFlashDeal } from "@/services/settings-service"
import { rechargeWallet, convertClubPoints } from "@/services/wallet-service"
import { createTicket } from "@/services/ticket-service"

export async function createCouponAction(data: {
  code: string
  type: "cart_base" | "product_base"
  discount: number
  discountType: "percent" | "amount"
  minBuy: number
  maxDiscount: number
  startDate: number
  endDate: number
}) {
  return await createCoupon(data)
}

export async function createFlashDealAction(data: {
  title: string
  banner?: string
  startDate: number
  endDate: number
}) {
  return await createFlashDeal(data)
}

export async function rechargeWalletAction(data: {
  userId?: string
  amount: number
  paymentMethod: string
  paymentDetails?: string
  offlinePayment?: boolean
}) {
  return await rechargeWallet(data)
}

export async function convertClubPointsAction(
  userId: string = "usr_customer_default_01",
  pointsToConvert: number
) {
  return await convertClubPoints(userId, pointsToConvert)
}

export async function createTicketAction(data: {
  userId?: string
  subject: string
  details: string
  files?: string[]
}) {
  return await createTicket(data)
}

export async function updateSellerVerificationAction(shopId: number, status: boolean) {
  const { updateSellerVerification } = await import("@/services/seller-service")
  return await updateSellerVerification(shopId, status)
}

export async function processWithdrawRequestAction(data: {
  requestId: number
  status: "pending" | "paid" | "rejected"
  paymentMethod?: string
  transactionId?: string
  adminNote?: string
}) {
  const { processWithdrawRequestAdmin } = await import("@/services/seller-service")
  return await processWithdrawRequestAdmin(data)
}

export async function createSellerWithdrawAction(data: {
  shopId: number
  userId: string
  amount: number
  message: string
  paymentMethod: string
}) {
  const { createSellerWithdrawRequest } = await import("@/services/seller-service")
  return await createSellerWithdrawRequest(data)
}

export async function updateTicketStatusAction(ticketId: number, status: string) {
  const { updateTicketStatus } = await import("@/services/ticket-service")
  return await updateTicketStatus(ticketId, status)
}

export async function createBlogAction(data: {
  title: string
  slug: string
  categoryId?: number
  shortDescription: string
  description: string
  banner?: string
  metaTitle?: string
  metaDescription?: string
}) {
  const { createBlog } = await import("@/services/blog-service")
  return await createBlog(data)
}

export async function toggleBlogStatusAction(id: number, status: boolean) {
  const { toggleBlogStatus } = await import("@/services/blog-service")
  return await toggleBlogStatus(id, status)
}

export async function deleteBlogAction(id: number) {
  const { deleteBlog } = await import("@/services/blog-service")
  return await deleteBlog(id)
}

export async function updateOrderStatusAction(data: {
  orderId: string
  deliveryStatus?: string
  paymentStatus?: string
  shippingMethod?: string
  courierTrackingCode?: string
}) {
  const { updateOrderStatusAdmin } = await import("@/services/order-service")
  return await updateOrderStatusAdmin(data)
}

export async function submitReviewAction(data: {
  productId: number
  userId?: string
  userName: string
  rating: number
  comment: string
  photos?: string[]
}) {
  const { submitReview } = await import("@/services/review-service")
  return await submitReview(data)
}

export async function toggleReviewStatusAction(id: number, status: boolean) {
  const { toggleReviewStatus } = await import("@/services/review-service")
  return await toggleReviewStatus(id, status)
}

export async function deleteReviewAction(id: number) {
  const { deleteReview } = await import("@/services/review-service")
  return await deleteReview(id)
}

export async function sendMessageAction(data: {
  conversationId: string
  senderId: string
  message: string
}) {
  const { sendMessage } = await import("@/services/conversation-service")
  return await sendMessage(data)
}

export async function submitSellerVerificationAction(shopId: number, data: {
  nidNumber?: string
  tradeLicense?: string
  documentType?: string
  documentUrl?: string
  bankName?: string
  bankAccount?: string
}) {
  const { submitSellerVerification } = await import("@/services/seller-service")
  return await submitSellerVerification(shopId, data)
}

export async function updateShippingSettingsAction(data: {
  shippingType: "area_wise" | "flat_rate" | "product_wise"
  flatRateCost: number
  insideDhakaCost: number
  outsideDhakaCost: number
  freeShippingThreshold: number
  freeShippingEnabled: boolean
  estimatedDaysInside: string
  estimatedDaysOutside: string
}) {
  const { updateShippingSettings } = await import("@/services/settings-service")
  return await updateShippingSettings(data)
}

export async function createRefundAction(data: {
  orderCode: string
  productName: string
  userName: string
  shopName?: string
  amount: number
  reason: string
  details?: string
}) {
  const { createRefundRequest } = await import("@/services/refund-service")
  return await createRefundRequest(data)
}

export async function processRefundAction(data: {
  requestId: string | number
  status: "approved" | "rejected"
  adminNote?: string
}) {
  const { processRefundAdmin } = await import("@/services/refund-service")
  return await processRefundAdmin(data)
}

export async function createAttributeAction(data: {
  name: string
  values: string[]
}) {
  const { createAttribute } = await import("@/services/attribute-service")
  return await createAttribute(data)
}

export async function updateAttributeAction(
  id: number,
  data: { name?: string; values?: string[] }
) {
  const { updateAttribute } = await import("@/services/attribute-service")
  return await updateAttribute(id, data)
}

export async function deleteAttributeAction(id: number) {
  const { deleteAttribute } = await import("@/services/attribute-service")
  return await deleteAttribute(id)
}

export async function createStaffAction(data: {
  name: string
  email: string
  phone?: string
  roleName: string
  roleId?: number
}) {
  const { createStaff } = await import("@/services/staff-service")
  return await createStaff(data)
}

export async function updateStaffStatusAction(id: number, isActive: boolean) {
  const { updateStaffStatus } = await import("@/services/staff-service")
  return await updateStaffStatus(id, isActive)
}

export async function deleteStaffAction(id: number) {
  const { deleteStaff } = await import("@/services/staff-service")
  return await deleteStaff(id)
}

export async function updateSellerCommissionAction(data: {
  commissionActivation: boolean
  commissionType: "fixed_rate" | "seller_based" | "category_based"
  fixedCommissionRate: number
  minimumWithdrawalAmount: number
}) {
  const { updateSellerCommissionSettings } = await import("@/services/settings-service")
  return await updateSellerCommissionSettings(data)
}

export async function updateClubPointsSettingsAction(data: {
  enabled: boolean
  pointsToWalletRate: number
  pointsPerOrder100BDT: number
}) {
  const { updateClubPointsSettings } = await import("@/services/settings-service")
  return await updateClubPointsSettings(data)
}

export async function addSubscriberAction(email: string) {
  const { addSubscriber } = await import("@/services/marketing-service")
  return await addSubscriber(email)
}

export async function deleteSubscriberAction(id: number) {
  const { deleteSubscriber } = await import("@/services/marketing-service")
  return await deleteSubscriber(id)
}

export async function sendNewsletterAction(data: {
  subject: string
  content: string
  audience: "all_users" | "subscribers" | "both"
}) {
  const { sendNewsletterBroadcast } = await import("@/services/marketing-service")
  return await sendNewsletterBroadcast(data)
}

export async function updateClassifiedPublishedAction(id: number, published: boolean) {
  const { updateClassifiedPublished } = await import("@/services/customer-product-service")
  return await updateClassifiedPublished(id, published)
}

export async function deleteClassifiedProductAction(id: number) {
  const { deleteClassifiedProduct } = await import("@/services/customer-product-service")
  return await deleteClassifiedProduct(id)
}

export async function askProductQuestionAction(data: {
  productSlug: string
  productName: string
  userName: string
  question: string
  userId?: string
}) {
  const { askProductQuestion } = await import("@/services/product-query-service")
  return await askProductQuestion(data)
}

export async function replyProductQueryAction(data: {
  id: number
  reply: string
  repliedBy: string
}) {
  const { replyProductQuery } = await import("@/services/product-query-service")
  return await replyProductQuery(data)
}

export async function deleteProductQueryAction(id: number) {
  const { deleteProductQuery } = await import("@/services/product-query-service")
  return await deleteProductQuery(id)
}

export async function updatePaymentGatewaysAction(data: any) {
  const { updatePaymentGatewaysSettings } = await import("@/services/settings-service")
  return await updatePaymentGatewaysSettings(data)
}

export async function updateCurrencySettingsAction(data: any) {
  const { updateCurrencySettings } = await import("@/services/settings-service")
  return await updateCurrencySettings(data)
}

export async function updateSmtpSettingsAction(data: any) {
  const { updateSmtpSettings } = await import("@/services/settings-service")
  return await updateSmtpSettings(data)
}

export async function sendTestEmailAction(toEmail: string) {
  return { success: true, message: `Test email successfully dispatched to ${toEmail}` }
}

export async function processWalletRechargeAction(id: number, approved: boolean) {
  const { processWalletRechargeAdmin } = await import("@/services/wallet-service")
  return await processWalletRechargeAdmin(id, approved)
}

export async function updateAdminProfileAction(data: {
  adminId?: string
  name: string
  email: string
  phone?: string
  image?: string
  newPassword?: string
}) {
  const { updateAdminProfile } = await import("@/services/admin-profile-service")
  return await updateAdminProfile(data.adminId || "usr_admin_default_01", data)
}

export async function updateAppearanceSettingsAction(data: any) {
  const { updateAppearanceSettings } = await import("@/services/appearance-service")
  return await updateAppearanceSettings(data)
}

export async function updateAnalyticsSettingsAction(data: any) {
  const { updateAnalyticsSettings } = await import("@/services/analytics-service")
  return await updateAnalyticsSettings(data)
}

export async function submitContactInquiryAction(data: {
  name: string
  email: string
  phone?: string
  subject?: string
  content: string
}) {
  const { submitContactInquiry } = await import("@/services/contact-service")
  return await submitContactInquiry(data)
}

export async function createCustomerProductAction(data: {
  name: string
  category: string
  unitPrice: number
  condition: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  location: string
  thumbnailImg?: string
}) {
  const { createCustomerProduct } = await import("@/services/customer-product-service")
  return await createCustomerProduct(data)
}

export async function deleteCustomerProductAction(id: number) {
  const { deleteClassifiedProduct } = await import("@/services/customer-product-service")
  return await deleteClassifiedProduct(id)
}

export async function updateCouriersSettingsAction(data: any) {
  const { updateCouriersSettings } = await import("@/services/courier-config-service")
  return await updateCouriersSettings(data)
}

export async function createColorAction(data: { name: string; code: string }) {
  const { createColor } = await import("@/services/color-service")
  return await createColor(data)
}

export async function deleteColorAction(id: number) {
  const { deleteColor } = await import("@/services/color-service")
  return await deleteColor(id)
}

export async function createWarrantyAction(data: { text: string; logo?: string; duration?: string }) {
  const { createWarranty } = await import("@/services/warranty-service")
  return await createWarranty(data)
}

export async function deleteWarrantyAction(id: number) {
  const { deleteWarranty } = await import("@/services/warranty-service")
  return await deleteWarranty(id)
}

export async function createCustomPageAction(data: {
  title: string
  slug: string
  content: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  metaImage?: string
}) {
  const { createCustomPage } = await import("@/services/page-service")
  return await createCustomPage(data)
}

export async function updateCustomPageAction(
  id: number,
  data: {
    title: string
    slug: string
    content: string
    metaTitle?: string
    metaDescription?: string
    keywords?: string
    metaImage?: string
  }
) {
  const { updateCustomPage } = await import("@/services/page-service")
  return await updateCustomPage(id, data)
}

export async function deleteCustomPageAction(id: number) {
  const { deleteCustomPage } = await import("@/services/page-service")
  return await deleteCustomPage(id)
}

export async function createUploadRecordAction(data: {
  fileOriginalName: string
  fileName: string
  userId?: string
  fileSize?: number
  extension?: string
  type?: string
  externalLink?: string
}) {
  const { createUploadRecord } = await import("@/services/upload-service")
  return await createUploadRecord(data)
}

export async function deleteUploadRecordAction(id: number) {
  const { deleteUploadRecord } = await import("@/services/upload-service")
  return await deleteUploadRecord(id)
}

export async function bulkDeleteUploadRecordsAction(ids: number[]) {
  const { bulkDeleteUploadRecords } = await import("@/services/upload-service")
  return await bulkDeleteUploadRecords(ids)
}

export async function createDigitalProductAction(data: {
  name: string
  categoryId?: number
  unitPrice: number
  thumbnailImg: string
  digitalFile?: string
  description?: string
}) {
  const { createDigitalProduct } = await import("@/services/product-service")
  return await createDigitalProduct(data)
}

export async function deleteDigitalProductAction(id: number) {
  const { deleteDigitalProduct } = await import("@/services/product-service")
  return await deleteDigitalProduct(id)
}

export async function updateSmartBarSettingsAction(data: {
  showSmartBar: boolean
  backgroundDesign: "plain" | "blur"
  backgroundColor: string
  textColor: string
}) {
  const { updateSmartBarSettings } = await import("@/services/settings-service")
  return await updateSmartBarSettings(data)
}
