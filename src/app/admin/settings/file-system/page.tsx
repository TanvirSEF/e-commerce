import React from "react"
import { Metadata } from "next"
import { getFileSystemSettings } from "@/services/settings-service"
import { FileSystemSettingsView } from "./_components/file-system-settings-view"

export const metadata: Metadata = {
  title: "File System & Cloud Storage Configuration | Admin Control Panel",
  description: "Configure Cloudinary, AWS S3, and local storage drivers",
}

export const dynamic = "force-dynamic"

export default async function FileSystemSettingsPage() {
  const settings = await getFileSystemSettings()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <FileSystemSettingsView initialSettings={settings} />
    </div>
  )
}
