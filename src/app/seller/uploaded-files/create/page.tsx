import React from "react"
import { Metadata } from "next"
import { UploadNewFileView } from "@/app/admin/uploaded-files/create/_components/upload-new-file-view"

export const metadata: Metadata = {
  title: "Upload New File | Seller Portal",
}

export const dynamic = "force-dynamic"

export default function SellerUploadNewFilePage() {
  return (
    <div className="space-y-4">
      <UploadNewFileView backHref="/seller/uploaded-files" />
    </div>
  )
}
