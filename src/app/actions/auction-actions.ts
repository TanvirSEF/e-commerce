"use server"

import { revalidatePath } from "next/cache"
import {
  toggleAuctionPublished,
  toggleAuctionFeatured,
  deleteAuctionProduct,
  bulkDeleteAuctionProducts,
  bulkPublishAuctionProducts,
  bulkFeaturedAuctionProducts,
  createAuctionProduct,
  updateAuctionOrderStatus,
  deleteAuctionOrder,
} from "@/services/auction-service"

export async function toggleAuctionPublishedAction(id: number, status: boolean) {
  const result = await toggleAuctionPublished(id, status)
  revalidatePath("/admin/auction/all-products")
  revalidatePath("/admin/auction/inhouse-products")
  revalidatePath("/admin/auction/seller-products")
  return result
}

export async function toggleAuctionFeaturedAction(id: number, featured: boolean) {
  const result = await toggleAuctionFeatured(id, featured)
  revalidatePath("/admin/auction/all-products")
  revalidatePath("/admin/auction/inhouse-products")
  revalidatePath("/admin/auction/seller-products")
  return result
}

export async function deleteAuctionProductAction(id: number) {
  const result = await deleteAuctionProduct(id)
  revalidatePath("/admin/auction/all-products")
  revalidatePath("/admin/auction/inhouse-products")
  revalidatePath("/admin/auction/seller-products")
  return result
}

export async function bulkDeleteAuctionProductsAction(ids: number[]) {
  const result = await bulkDeleteAuctionProducts(ids)
  revalidatePath("/admin/auction/all-products")
  revalidatePath("/admin/auction/inhouse-products")
  revalidatePath("/admin/auction/seller-products")
  return result
}

export async function bulkPublishAuctionProductsAction(ids: number[]) {
  const result = await bulkPublishAuctionProducts(ids)
  revalidatePath("/admin/auction/all-products")
  revalidatePath("/admin/auction/inhouse-products")
  revalidatePath("/admin/auction/seller-products")
  return result
}

export async function bulkFeaturedAuctionProductsAction(ids: number[]) {
  const result = await bulkFeaturedAuctionProducts(ids)
  revalidatePath("/admin/auction/all-products")
  revalidatePath("/admin/auction/inhouse-products")
  revalidatePath("/admin/auction/seller-products")
  return result
}

export async function createAuctionProductAction(data: {
  name: string
  slug: string
  thumbnail: string
  description?: string
  startingBid: string
  minBidIncrement?: string
  auctionStartDate: Date
  auctionEndDate: Date
  sellerSlug?: string
  sellerName?: string
  featured?: boolean
}) {
  const result = await createAuctionProduct(data)
  revalidatePath("/admin/auction/all-products")
  revalidatePath("/admin/auction/inhouse-products")
  revalidatePath("/admin/auction/seller-products")
  return result
}

export async function updateAuctionOrderStatusAction(
  id: number,
  data: { paymentStatus?: string; deliveryStatus?: string }
) {
  const result = await updateAuctionOrderStatus(id, data)
  revalidatePath("/admin/auction/orders")
  return result
}

export async function deleteAuctionOrderAction(id: number) {
  const result = await deleteAuctionOrder(id)
  revalidatePath("/admin/auction/orders")
  return result
}
