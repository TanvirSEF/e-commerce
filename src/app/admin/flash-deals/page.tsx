import { Metadata } from "next"
import { getFlashDeals } from "@/services/settings-service"
import { FlashDealsManager } from "./_components/flash-deals-manager"

export const metadata: Metadata = {
  title: "Flash Deals | Admin Panel",
  description: "Manage flash deals and limited-time discount campaigns.",
}

export default async function AdminFlashDealsPage() {
  const deals = await getFlashDeals()

  return <FlashDealsManager initialDeals={deals} />
}
