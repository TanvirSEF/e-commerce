import React from "react"
import { Metadata } from "next"
import { getAllUploads } from "@/services/upload-service"
import { UploadedFilesView } from "./_components/uploaded-files-view"

export const metadata: Metadata = {
  title: "Uploaded Files Library | Active eCommerce Admin",
}

export default async function AdminUploadedFilesPage() {
  const initialFiles = await getAllUploads()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <UploadedFilesView initialFiles={initialFiles} />
    </div>
  )
}
