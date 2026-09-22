import { Metadata } from "next"
import { getCoupons } from "@/services/coupon-service"
import { CouponsManager } from "./_components/coupons-manager"

export const metadata: Metadata = {
  title: "Coupons | Admin Panel",
  description: "Manage discount coupons and promotional campaign codes.",
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons()

  return <CouponsManager initialCoupons={coupons} />
}
