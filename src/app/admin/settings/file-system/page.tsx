import React from "react"
import { Metadata } from "next"
import { FileSystemSettingsView } from "./_components/file-system-settings-view"

export const metadata: Metadata = {
  title: "File System & Cloud Storage Configuration | Admin Control Panel",
  description: "Configure Cloudinary, AWS S3, and local storage drivers",
}

export default function FileSystemSettingsPage() {
  const currentDriver = process.env.STORAGE_DRIVER || "cloudinary"
  const cloudinaryConfig = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY ? "••••••••••••••" : "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ? "••••••••••••••" : "",
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <FileSystemSettingsView
        initialDriver={currentDriver}
        cloudinaryConfig={cloudinaryConfig}
      />
    </div>
  )
}
