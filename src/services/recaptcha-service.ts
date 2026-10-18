import { getThirdPartySettings } from "./settings-service"

export interface RecaptchaVerificationResult {
  success: boolean
  error?: string
  score?: number
}

/**
 * Server-side verification for Google reCAPTCHA v2 / v3
 * Calls https://www.google.com/recaptcha/api/siteverify
 */
export async function verifyRecaptchaToken(
  token: string | undefined | null
): Promise<RecaptchaVerificationResult> {
  try {
    const settings = await getThirdPartySettings()

    const isRealSecret =
      Boolean(settings.recaptchaSecretKey) &&
      settings.recaptchaSecretKey.trim() !== "" &&
      !settings.recaptchaSecretKey.includes("XXXX") &&
      !settings.recaptchaSecretKey.toLowerCase().includes("dummy") &&
      !settings.recaptchaSecretKey.toLowerCase().includes("test") &&
      settings.recaptchaSecretKey.length > 10

    // If reCAPTCHA is not enabled in Admin or secret key is missing/dummy, allow request
    if (!settings.recaptchaActive || !isRealSecret) {
      return { success: true }
    }

    // When reCAPTCHA is active, token is mandatory
    if (!token || token.trim() === "") {
      return {
        success: false,
        error: "Please complete the reCAPTCHA security check.",
      }
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: settings.recaptchaSecretKey.trim(),
        response: token.trim(),
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      console.warn("reCAPTCHA HTTP error:", response.status)
      // Fail open gracefully if Google service is down
      return { success: true }
    }

    const data = await response.json()

    if (!data.success) {
      const errorCodes = Array.isArray(data["error-codes"]) ? data["error-codes"].join(", ") : ""
      console.warn("reCAPTCHA validation failed:", errorCodes)
      return {
        success: false,
        error: "Google security verification failed. Please try again.",
      }
    }

    // For v3 score check
    if (settings.recaptchaVersion === "v3" && typeof data.score === "number" && data.score < 0.5) {
      return {
        success: false,
        error: "Security check detected suspicious activity. Please try again.",
        score: data.score,
      }
    }

    return {
      success: true,
      score: typeof data.score === "number" ? data.score : undefined,
    }
  } catch (err: any) {
    console.error("verifyRecaptchaToken unexpected error:", err)
    // Fail open so customers are never locked out due to network issues with Google
    return { success: true }
  }
}
