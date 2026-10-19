import { Metadata } from "next"
import { getProducts } from "@/services/product-service"
import { TodaysDealView } from "./_components/todays-deal-view"

export const metadata: Metadata = {
  title: "Today's Deal | Active eCommerce CMS",
  description: "Limited-time 24-hour deals on top trending products.",
}

export const dynamic = "force-dynamic"

export default async function TodaysDealPage() {
  const { data: deals } = await getProducts({ todaysDeal: true, limit: 50 })
  return <TodaysDealView products={deals} />
}
