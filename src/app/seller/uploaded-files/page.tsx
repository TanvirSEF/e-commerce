import React from "react"
import { Metadata } from "next"
import { getAllUploads } from "@/services/upload-service"
import { UploadedFilesView } from "@/app/admin/uploaded-files/_components/uploaded-files-view"

export const metadata: Metadata = {
  title: "Uploaded Files | Seller Portal",
}

export default async function SellerUploadedFilesPage() {
  const initialFiles = await getAllUploads()

  return (
    <div className="space-y-4">
      <UploadedFilesView initialFiles={initialFiles} />
    </div>
  )
}
