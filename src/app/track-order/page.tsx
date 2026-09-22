import { Suspense } from "react"
import { Metadata } from "next"
import { TrackOrderView } from "./_components/track-order-view"

export const metadata: Metadata = {
  title: "Track Order | Active eCommerce",
  description: "Check the status and real-time delivery progress of your order.",
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f9fa]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d43533] border-t-transparent" />
        </div>
      }
    >
      <TrackOrderView />
    </Suspense>
  )
}
