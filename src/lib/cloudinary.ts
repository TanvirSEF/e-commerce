import { v2 as cloudinary, type UploadApiResponse } from "cloudinary"

const envCloudName = process.env.CLOUDINARY_CLOUD_NAME
const envApiKey = process.env.CLOUDINARY_API_KEY
const envApiSecret = process.env.CLOUDINARY_API_SECRET

if (envCloudName && envApiKey && envApiSecret) {
  cloudinary.config({
    cloud_name: envCloudName,
    api_key: envApiKey,
    api_secret: envApiSecret,
    secure: true,
  })
}

export async function getActiveCloudinaryConfig(override?: {
  cloudName?: string
  apiKey?: string
  apiSecret?: string
}) {
  if (override?.cloudName && override?.apiKey && override?.apiSecret) {
    return {
      cloud_name: override.cloudName,
      api_key: override.apiKey,
      api_secret: override.apiSecret,
    }
  }

  try {
    const { getFileSystemSettings } = await import("@/services/settings-service")
    const fsSettings = await getFileSystemSettings()
    if (fsSettings.cloudinaryCloudName && fsSettings.cloudinaryApiKey && fsSettings.cloudinaryApiSecret) {
      return {
        cloud_name: fsSettings.cloudinaryCloudName,
        api_key: fsSettings.cloudinaryApiKey,
        api_secret: fsSettings.cloudinaryApiSecret,
      }
    }
  } catch {}

  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
  }
}

export function isCloudinaryConfigured(override?: {
  cloudName?: string
  apiKey?: string
  apiSecret?: string
}): boolean {
  if (override?.cloudName && override?.apiKey && override?.apiSecret) {
    return true
  }
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  )
}

export async function testCloudinaryConnection(override?: {
  cloudName?: string
  apiKey?: string
  apiSecret?: string
}): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    const conf = await getActiveCloudinaryConfig(override)
    if (!conf.cloud_name || !conf.api_key || !conf.api_secret) {
      return {
        success: false,
        message: "Cloudinary credentials (Cloud Name, API Key, and API Secret) are required.",
      }
    }

    cloudinary.config({
      cloud_name: conf.cloud_name,
      api_key: conf.api_key,
      api_secret: conf.api_secret,
      secure: true,
    })

    const res = await cloudinary.api.ping()
    if (res && res.status === "ok") {
      return {
        success: true,
        message: `Cloudinary API connected successfully! (Cloud: ${conf.cloud_name}, Status: OK)`,
      }
    }
    return {
      success: false,
      message: "Cloudinary responded with an unexpected status.",
      details: res,
    }
  } catch (err: any) {
    let msg = err?.message || "Failed to connect to Cloudinary"
    if (err?.error?.message) {
      msg = err.error.message
    }
    return {
      success: false,
      message: `Cloudinary connection failed: ${msg}`,
    }
  }
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
    credentials?: { cloudName?: string; apiKey?: string; apiSecret?: string }
  }
): Promise<CloudinaryUploadResult> {
  const conf = await getActiveCloudinaryConfig(options?.credentials)
  if (!conf.cloud_name || !conf.api_key || !conf.api_secret) {
    throw new Error(
      "Cloudinary is not properly configured. Please check Cloudinary credentials in Admin File System settings or .env"
    )
  }

  cloudinary.config({
    cloud_name: conf.cloud_name,
    api_key: conf.api_key,
    api_secret: conf.api_secret,
    secure: true,
  })

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
  const conf = await getActiveCloudinaryConfig()
  if (!conf.cloud_name || !conf.api_key || !conf.api_secret) {
    return { result: "not_configured" }
  }

  cloudinary.config({
    cloud_name: conf.cloud_name,
    api_key: conf.api_key,
    api_secret: conf.api_secret,
    secure: true,
  })

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
