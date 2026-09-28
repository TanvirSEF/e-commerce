import React from "react"
import Link from "next/link"
import { Wrench, RefreshCw } from "lucide-react"

export const metadata = {
  title: "Under Maintenance | Active eCommerce",
}

export default function MaintenancePage() {
  return (
    <section className="min-h-screen bg-white flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4 border border-amber-100 shadow-sm">
          <Wrench className="w-12 h-12 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            We are Under Maintenance.
          </h2>
          <p className="text-base text-gray-500">
            We will be back soon! Our team is performing scheduled maintenance to upgrade your shopping experience.
          </p>
        </div>
        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Check Again
          </Link>
        </div>
      </div>
    </section>
  )
}
