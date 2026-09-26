import React from "react"
import { Metadata } from "next"
import { SellerOrderDetailsView, SellerOrderDetailsData } from "./_components/seller-order-details-view"

export const metadata: Metadata = {
  title: "Order Details | Seller Portal",
}

interface SellerOrderPageProps {
  params: Promise<{ id: string }>
}

export default async function SellerOrderDetailsPage({ params }: SellerOrderPageProps) {
  const { id } = await params

  // Sample order detail matching Active eCommerce structure
  const order: SellerOrderDetailsData = {
    id,
    code: id.startsWith("2026") ? id : `20260923-${id}`,
    date: "23 Sep 2026, 14:32",
    customerName: "Mohammad Tanvir",
    customerEmail: "tanvir.client@example.com",
    customerPhone: "+880 1712 345678",
    shippingAddress: "House 42, Road 11, Banani, Dhaka-1213, Bangladesh",
    paymentType: "Cash on Delivery",
    paymentStatus: "paid",
    deliveryStatus: "on_the_way",
    trackingCode: "TRK-84920194",
    subtotal: 4200,
    shippingCost: 120,
    tax: 210,
    couponDiscount: 200,
    total: 4330,
    items: [
      {
        id: "item-1",
        name: "Classic Men's Casual Shirt - Slim Fit Cotton",
        thumbnail: "/assets/img/placeholder.jpg",
        slug: "classic-mens-casual-shirt",
        variation: "Navy Blue / XL",
        price: 1250,
        quantity: 2,
        total: 2500,
      },
      {
        id: "item-2",
        name: "Wireless Mechanical Gaming Keyboard RGB",
        thumbnail: "/assets/img/placeholder.jpg",
        slug: "wireless-mechanical-gaming-keyboard-rgb",
        price: 1700,
        quantity: 1,
        total: 1700,
      },
    ],
  }

  return <SellerOrderDetailsView order={order} />
}
