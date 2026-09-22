import { Metadata } from "next"
import { getCoupons } from "@/services/coupon-service"
import { CouponsView } from "./_components/coupons-view"

export const metadata: Metadata = {
  title: "All Coupons | Active eCommerce CMS",
  description: "Browse verified coupons, promotional discount codes, and voucher offers.",
}

export default async function CouponsPage() {
  const coupons = await getCoupons()

  return <CouponsView coupons={coupons} />
}
