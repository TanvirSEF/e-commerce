import React from "react"
import { Metadata } from "next"
import { UploadNewFileView } from "./_components/upload-new-file-view"

export const metadata: Metadata = {
  title: "Upload New File | Active eCommerce Admin",
}

export const dynamic = "force-dynamic"

export default function AdminUploadNewFilePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <UploadNewFileView backHref="/admin/uploaded-files" />
    </div>
  )
}
