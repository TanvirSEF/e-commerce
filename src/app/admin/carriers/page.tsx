import React from "react"
import { Metadata } from "next"
import { AdminCarriersView } from "./_components/admin-carriers-view"

export const metadata: Metadata = {
  title: "Shipping Carriers | Admin Control Panel",
  description: "Manage courier and shipping carrier integrations",
}

export default function AdminCarriersPage() {
  const initialCarriers = [
    {
      id: 1,
      name: "DHL Express",
      transitTime: "1-3 Business Days",
      logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200",
      status: true,
      freeShipping: false,
    },
    {
      id: 2,
      name: "FedEx International",
      transitTime: "2-4 Business Days",
      logo: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=200",
      status: true,
      freeShipping: false,
    },
    {
      id: 3,
      name: "UPS Standard",
      transitTime: "3-5 Business Days",
      logo: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200",
      status: true,
      freeShipping: true,
    },
    {
      id: 4,
      name: "RedX Logistics",
      transitTime: "24-48 Hours",
      logo: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200",
      status: true,
      freeShipping: false,
    },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <AdminCarriersView initialCarriers={initialCarriers} />
    </div>
  )
}
