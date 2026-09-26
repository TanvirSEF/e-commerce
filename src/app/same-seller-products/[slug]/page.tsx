import { redirect } from "next/navigation"

interface SameSellerProps {
  params: Promise<{
    slug: string
  }>
}

export default async function SameSellerProductsPage({ params }: SameSellerProps) {
  const { slug } = await params
  if (slug === "in-house") {
    redirect("/inhouse")
  }
  redirect(`/shop/${slug}?tab=all-products`)
}
