"use client"

import React from "react"
import Link from "next/link"
import { ShieldAlert, Home, ArrowLeft } from "lucide-react"

export default function Forbidden() {
  return (
    <section className="text-center py-16 px-4 bg-white min-h-[60vh] flex items-center justify-center">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-red-50 flex items-center justify-center text-[#d43533] mb-4">
          <ShieldAlert className="w-12 h-12 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292933]">
            Access Denied!
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            You do not have the right permission to access this page or resource.
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
