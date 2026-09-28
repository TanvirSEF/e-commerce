"use client"

import React from "react"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <section className="text-center py-16 px-4 bg-white min-h-[60vh] flex items-center justify-center">
      <div className="max-w-xl mx-auto space-y-6">
        <img
          src="/assets/img/404.svg"
          alt="404 Page Not Found"
          className="max-w-[280px] sm:max-w-xs mx-auto drop-shadow-sm"
        />
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292933]">
            Page Not Found!
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            The page you are looking for has not been found on our server or may have been moved.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Page
          </button>
        </div>
      </div>
    </section>
  )
}
