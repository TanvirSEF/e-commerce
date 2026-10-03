import React from "react"
import { Metadata } from "next"
import { getServerSession } from "@/lib/auth/session-helper"
import { getAllUploads } from "@/services/upload-service"
import { SellerUploadedFilesView } from "./_components/seller-uploaded-files-view"

export const metadata: Metadata = {
  title: "All uploaded files | Seller Portal",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SellerUploadedFilesPage() {
  const session = await getServerSession()
  const sellerUserId = session?.user?.id || "usr_seller_default_01"

  const initialFiles = await getAllUploads({
    userId: sellerUserId,
  })

  return (
    <div className="p-4 md:p-6">
      <SellerUploadedFilesView initialFiles={initialFiles} />
    </div>
  )
}
