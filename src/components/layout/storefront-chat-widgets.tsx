"use client"

import React, { useState } from "react"
import type { ChatWidgetsSettings } from "@/services/settings-service"

interface StorefrontChatWidgetsProps {
  settings?: ChatWidgetsSettings | null
}

export function StorefrontChatWidgets({ settings }: StorefrontChatWidgetsProps) {
  const [hoveredWidget, setHoveredWidget] = useState<string | null>(null)

  if (!settings) return null

  const isWhatsAppActive = Boolean(
    settings.whatsapp?.active && settings.whatsapp?.phone?.trim()
  )
  const isFacebookActive = Boolean(
    settings.facebook?.active && settings.facebook?.pageId?.trim()
  )

  if (!isWhatsAppActive && !isFacebookActive) {
    return null
  }

  const cleanPhone = (settings.whatsapp?.phone || "").replace(/[^0-9]/g, "")
  const waMessage = encodeURIComponent(
    settings.whatsapp?.message || "Hi! How can we assist you today?"
  )
  const waUrl = `https://wa.me/${cleanPhone}?text=${waMessage}`
  const fbUrl = `https://m.me/${settings.facebook?.pageId?.trim()}`

  const isLeft = settings.whatsapp?.position === "bottom-left"

  return (
    <div
      className={`fixed z-40 flex flex-col items-center gap-3 transition-all duration-300 ${
        isLeft ? "left-5" : "right-5"
      } bottom-20 lg:bottom-8`}
      aria-label="Customer Live Chat"
    >
      {/* WhatsApp Floating Chat Button */}
      {isWhatsAppActive && (
        <div
          className="relative flex items-center"
          onMouseEnter={() => setHoveredWidget("whatsapp")}
          onMouseLeave={() => setHoveredWidget(null)}
        >
          {/* Tooltip Label */}
          <span
            className={`pointer-events-none absolute hidden sm:block whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md transition-all duration-200 ${
              isLeft ? "left-14" : "right-14"
            } ${
              hoveredWidget === "whatsapp"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2 pointer-events-none"
            }`}
          >
            Chat on WhatsApp
          </span>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact support on WhatsApp"
            className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:bg-[#20ba5a] active:scale-95"
          >
            {/* Ripple Pulse Effect */}
            <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping opacity-60 pointer-events-none" />

            <svg
              className="h-7 w-7 fill-current relative z-10"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-1.077-.061-.632-.198-1.503-.63-2.42-1.488-.846-.788-1.393-1.748-1.579-2.033-.186-.285-.015-.44.116-.57.12-.12.268-.312.403-.467.135-.156.18-.266.27-.446.09-.18.045-.338-.023-.473-.067-.135-.6-1.446-.823-1.98-.216-.522-.437-.45-.6-.459-.156-.007-.336-.009-.516-.009s-.472.067-.719.336c-.247.27-.944.922-.944 2.249s.967 2.608 1.102 2.788c.135.18 1.905 2.91 4.618 4.079.645.279 1.15.445 1.543.57.649.207 1.239.178 1.706.108.52-.078 1.6-.654 1.826-1.285.225-.631.225-1.172.158-1.285-.068-.113-.248-.18-.517-.315zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.957-1.398A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.597 0-3.093-.471-4.351-1.28l-.312-.199-2.932.827.838-2.859-.215-.331A8.146 8.146 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167 4.502 0 8.167 3.664 8.167 8.167 0 4.503-3.665 8.167-8.167 8.167z" />
            </svg>
          </a>
        </div>
      )}

      {/* Facebook Messenger Floating Chat Button */}
      {isFacebookActive && (
        <div
          className="relative flex items-center"
          onMouseEnter={() => setHoveredWidget("messenger")}
          onMouseLeave={() => setHoveredWidget(null)}
        >
          {/* Tooltip Label */}
          <span
            className={`pointer-events-none absolute hidden sm:block whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md transition-all duration-200 ${
              isLeft ? "left-14" : "right-14"
            } ${
              hoveredWidget === "messenger"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2 pointer-events-none"
            }`}
          >
            Chat on Messenger
          </span>

          <a
            href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact support on Facebook Messenger"
            className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-linear-to-tr from-[#0084FF] to-[#00C6FF] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95"
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.48 5.43 3.79 7.03V22l3.83-2.1c.76.21 1.55.33 2.38.33 5.52 0 10-4.03 10-9s-4.48-9-10-9zm1.09 12.1l-2.61-2.78-5.09 2.78 5.6-5.95 2.67 2.78 5.03-2.78-5.6 5.95z" />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}
