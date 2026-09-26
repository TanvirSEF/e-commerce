import { NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary"
import { createUploadRecord, getAllUploads, deleteUploadRecord } from "@/services/upload-service"

export const dynamic = "force-dynamic"
export const maxDuration = 60 // 60s max execution for large uploads

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || undefined
    const type = searchParams.get("type") || undefined
    const sort = searchParams.get("sort") || undefined

    const files = await getAllUploads({ search, type, sort })
    return NextResponse.json({ success: true, files })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch uploads" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const filesToUpload: File[] = []

    // Collect all uploaded files from form data
    const allEntries = formData.getAll("file")
    if (allEntries.length > 0) {
      for (const entry of allEntries) {
        if (entry instanceof File && entry.size > 0) {
          filesToUpload.push(entry)
        }
      }
    }

    const filesEntries = formData.getAll("files")
    if (filesEntries.length > 0) {
      for (const entry of filesEntries) {
        if (entry instanceof File && entry.size > 0) {
          filesToUpload.push(entry)
        }
      }
    }

    if (filesToUpload.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid file provided for upload" },
        { status: 400 }
      )
    }

    const userId = (formData.get("userId") as string) || "admin"
    const results = []

    for (const file of filesToUpload) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const mimeType = file.type || "application/octet-stream"
      let resourceType: "auto" | "image" | "video" | "raw" = "auto"
      let typeCategory = "document"

      if (mimeType.startsWith("image/")) {
        resourceType = "image"
        typeCategory = "image"
      } else if (mimeType.startsWith("video/")) {
        resourceType = "video"
        typeCategory = "video"
      }

      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"

      let fileUrl = ""
      let publicId = ""

      if (isCloudinaryConfigured()) {
        const cloudResult = await uploadToCloudinary(buffer, {
          folder: "active-ecommerce/uploads",
          resourceType,
        })
        fileUrl = cloudResult.secureUrl
        publicId = cloudResult.publicId
      } else {
        // Fallback placeholder URL if Cloudinary is not configured
        fileUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800`
        publicId = `local-${Date.now()}`
      }

      const record = await createUploadRecord({
        fileOriginalName: file.name,
        fileName: publicId || file.name,
        fileSize: file.size,
        extension,
        type: typeCategory,
        externalLink: fileUrl,
        userId,
      })

      results.push(record)
    }

    return NextResponse.json({
      success: true,
      files: results,
      file: results[0],
      url: results[0]?.externalLink,
    })
  } catch (error: any) {
    console.error("Upload error in /api/uploader:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during file upload",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get("id")
    const publicId = searchParams.get("publicId")

    if (!idParam) {
      return NextResponse.json(
        { success: false, error: "Missing upload ID" },
        { status: 400 }
      )
    }

    if (publicId && isCloudinaryConfigured()) {
      await deleteFromCloudinary(publicId)
    }

    const id = parseInt(idParam, 10)
    await deleteUploadRecord(id)

    return NextResponse.json({ success: true, message: "File deleted successfully" })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete upload" },
      { status: 500 }
    )
  }
}
