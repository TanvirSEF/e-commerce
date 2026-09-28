"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global application error:", error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 text-[#d43533] rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Something Went Wrong!
          </h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            An unexpected error occurred while processing your request. Please try again or return to the homepage.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-gray-400">
              Error Digest: {error.digest}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
