import { v2 as cloudinary, type UploadApiResponse } from "cloudinary"

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  )
}

export interface CloudinaryUploadResult {
  publicId: string
  secureUrl: string
  format: string
  bytes: number
  resourceType: string
  width?: number
  height?: number
}

/**
 * Upload a file buffer or stream directly to Cloudinary
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options?: {
    folder?: string
    publicId?: string
    filename?: string
    resourceType?: "auto" | "image" | "video" | "raw"
  }
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not properly configured. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local"
    )
  }

  const folder = options?.folder || "active-ecommerce"
  const resourceType = options?.resourceType || "auto"

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: options?.publicId,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          reject(error || new Error("Failed to upload file to Cloudinary"))
          return
        }

        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          format: result.format || "",
          bytes: result.bytes,
          resourceType: result.resource_type,
          width: result.width,
          height: result.height,
        })
      }
    )

    uploadStream.end(buffer)
  })
}

/**
 * Delete an asset from Cloudinary by public ID
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<{ result: string }> {
  if (!isCloudinaryConfigured()) {
    return { result: "not_configured" }
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    })
    return res
  } catch (err) {
    console.error("Cloudinary destroy error:", err)
    return { result: "error" }
  }
}

export { cloudinary }
