import React from "react"
import { Metadata } from "next"
import { CustomerProductCreateView } from "./_components/customer-product-create-view"

export const metadata: Metadata = {
  title: "Post New Classified Ad | Customer Dashboard",
  description: "Upload and publish your second-hand product advertisement on the marketplace.",
}

export default function CustomerProductCreatePage() {
  return <CustomerProductCreateView />
}
