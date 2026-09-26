import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Wallet, ArrowRight, Home } from "lucide-react"

export const metadata = {
  title: "Wallet Recharge Successful | Huipper",
  description: "Your Wallet Recharge Request has been processed successfully.",
}

export default function WalletRechargeSuccessPage() {
  return (
    <div className="bg-[#f8f9fb] min-h-[70vh] py-16 flex items-center justify-center">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 sm:p-12">
          {/* Success Graphic */}
          <div className="relative mx-auto mb-6 h-36 w-36 sm:h-44 sm:w-44 flex items-center justify-center">
            <Image
              src="/assets/img/success.svg"
              alt="Recharge Successful"
              width={160}
              height={160}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292933] mb-3">
            Wallet Recharge Successful
          </h1>

          <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
            Your Wallet Recharge Request is Successful. Your wallet balance has been updated and is ready to use for instant checkouts.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard/wallet"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-[#d43533] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b82a28] transition-colors"
            >
              <Wallet className="h-4 w-4" />
              Go to My Wallet
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-gray-300 bg-white px-6 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Home className="h-4 w-4 text-gray-400" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
