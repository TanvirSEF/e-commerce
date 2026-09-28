import React from "react"
import { AdminPickupAddressesView } from "./_components/admin-pickup-addresses-view"

export const metadata = {
  title: "Courier Pickup Addresses | Admin Panel",
}

const initialPickupAddresses = [
  {
    id: 1,
    nickname: "Central Hub - Dhaka",
    courierType: "pathao",
    phone: "+880 1711 000111",
    address: "Road 11, Block D, Banani, Dhaka-1213",
    status: true,
  },
  {
    id: 2,
    nickname: "Chittagong Depot",
    courierType: "steadfast",
    phone: "+880 1819 222333",
    address: "Agrabad Commercial Area, Chittagong",
    status: true,
  },
  {
    id: 3,
    nickname: "Uttara Express Hub",
    courierType: "redx",
    phone: "+880 1912 334455",
    address: "Sector 3, Uttara, Dhaka",
    status: false,
  },
]

export default function PickupAddressesPage() {
  return <AdminPickupAddressesView initialAddresses={initialPickupAddresses} />
}
