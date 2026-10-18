"use client"

import React, { useEffect, useRef, useState } from "react"
import Script from "next/script"

interface GoogleRecaptchaProps {
  siteKey?: string
  version?: "v2" | "v3"
  active?: boolean
  onVerify: (token: string) => void
  onExpired?: () => void
}

declare global {
  interface Window {
    grecaptcha?: any
  }
}

export function GoogleRecaptcha({
  siteKey,
  version = "v2",
  active = true,
  onVerify,
  onExpired,
}: GoogleRecaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const widgetIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active || !siteKey || !scriptLoaded) return

    const tryRender = () => {
      if (typeof window === "undefined" || !window.grecaptcha) return

      if (version === "v2") {
        if (window.grecaptcha.render && containerRef.current && widgetIdRef.current === null) {
          try {
            widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
              sitekey: siteKey,
              callback: (token: string) => onVerify(token),
              "expired-callback": () => onExpired?.(),
            })
          } catch {
            // Already rendered
          }
        }
      } else if (version === "v3" && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          try {
            window.grecaptcha.execute(siteKey, { action: "submit" }).then((token: string) => {
              onVerify(token)
            })
          } catch (err) {
            console.warn("reCAPTCHA v3 execution failed:", err)
          }
        })
      }
    }

    tryRender()
  }, [scriptLoaded, active, siteKey, version, onVerify, onExpired])

  const isRealSiteKey =
    Boolean(siteKey) &&
    siteKey!.trim() !== "" &&
    !siteKey!.includes("XXXX") &&
    !siteKey!.toLowerCase().includes("dummy") &&
    !siteKey!.toLowerCase().includes("test") &&
    siteKey!.length > 10

  if (!active || !isRealSiteKey) {
    return null
  }

  const scriptUrl =
    version === "v3"
      ? `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey!)}`
      : `https://www.google.com/recaptcha/api.js?render=explicit`

  return (
    <div className="my-3">
      <Script
        id="google-recaptcha-script"
        src={scriptUrl}
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      {version === "v2" && (
        <div
          ref={containerRef}
          className="min-h-[78px] flex items-center justify-start overflow-hidden"
        />
      )}
    </div>
  )
}
