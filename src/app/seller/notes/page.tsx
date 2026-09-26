import React from "react"
import { Metadata } from "next"
import { SellerNotesView } from "./_components/seller-notes-view"

export const metadata: Metadata = {
  title: "Order Notes | Seller Portal",
}

export default function SellerNotesPage() {
  return <SellerNotesView />
}
