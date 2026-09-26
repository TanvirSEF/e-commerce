"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { ShippingStep, AddressData } from "./shipping-step"
import { DeliveryStep } from "./delivery-step"
import { PaymentStep } from "./payment-step"
import { placeOrderAction } from "@/app/actions/ecommerce-actions"
import { ChevronRight, MapPin, Truck, CreditCard, ChevronDown } from "lucide-react"

const DEFAULT_ADDRESSES: AddressData[] = [
  {
    id: "addr-1",
    name: "Tanvir Ahmed",
    email: "tanvir@example.com",
    phone: "+880 1712 345678",
    address: "House #12, Road #4, Block #C, Banani",
    city: "Dhaka",
    postalCode: "1213",
    country: "Bangladesh",
    isDefault: true,
  },
  {
    id: "addr-2",
    name: "Office Address",
    email: "work@example.com",
    phone: "+880 1912 987654",
    address: "Level 8, Concord Tower, Gulshan-2",
    city: "Dhaka",
    postalCode: "1212",
    country: "Bangladesh",
    isDefault: false,
  },
]

export function CheckoutView() {
  const router = useRouter()
  const {
    items,
    selectedCount,
    selectedSubtotal,
    shippingTotal,
    taxTotal,
    couponDiscount,
    grandTotal,
    clearCart,
  } = useCart()

  const selectedItems = items.filter((i) => i.selected)

  // Step Accordion state
  const [openSections, setOpenSections] = useState({
    shipping: true,
    delivery: true,
    payment: true,
  })

  // Address state
  const [addresses, setAddresses] = useState<AddressData[]>(DEFAULT_ADDRESSES)
  const [selectedAddressId, setSelectedAddressId] = useState(DEFAULT_ADDRESSES[0].id)
  const [sameAsShipping, setSameAsShipping] = useState(true)

  // Delivery state
  const [deliveryType, setDeliveryType] = useState<"home_delivery" | "pickup_point" | "carrier">("home_delivery")
  const [pickupPoint, setPickupPoint] = useState("Dhanmondi Hub (Road 27)")
  const [carrier, setCarrier] = useState("Steadfast Courier")

  // Payment state
  const [paymentOption, setPaymentOption] = useState("cash_on_delivery")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [agreed, setAgreed] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0]

  const toggleSection = (section: "shipping" | "delivery" | "payment") => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleAddNewAddress = (newAddr: AddressData) => {
    setAddresses((prev) => [...prev, newAddr])
    setSelectedAddressId(newAddr.id)
  }

  const handleSubmitOrder = async () => {
    if (!agreed) return
    setIsSubmitting(true)

    try {
      const orderPayload = {
        userId: "usr_customer_default_01",
        shippingAddress: {
          name: selectedAddress.name,
          email: selectedAddress.email,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          country: selectedAddress.country,
          postal_code: selectedAddress.postalCode,
        },
        billingAddress: {
          name: selectedAddress.name,
          email: selectedAddress.email,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          country: selectedAddress.country,
          postal_code: selectedAddress.postalCode,
        },
        paymentType: paymentOption,
        items: selectedItems.map((item) => ({
          productId: Number(item.productId || item.id) || undefined,
          variation: item.variation || undefined,
          price: item.price,
          quantity: item.quantity,
        })),
        grandTotal: grandTotal,
        shippingCost: shippingTotal,
        couponDiscount: couponDiscount,
      }

      const res = await placeOrderAction(orderPayload)
      const orderCode = res?.order?.code || `20260926-${Math.floor(100000 + Math.random() * 900000)}`

      const orderData = {
        code: orderCode,
        tracking_code: res?.order?.trackingCode,
        date: Date.now(),
        status: "pending",
        delivery_status: "pending",
        payment_type: paymentOption,
        payment_status: paymentOption === "cash_on_delivery" ? "unpaid" : "paid",
        shipping_type: deliveryType,
        carrier: deliveryType === "carrier" ? carrier : undefined,
        pickup_point: deliveryType === "pickup_point" ? pickupPoint : undefined,
        shipping_address: selectedAddress,
        billing_address: selectedAddress,
        notes: additionalNotes,
        grand_total: grandTotal,
        subtotal: selectedSubtotal,
        shipping_cost: shippingTotal,
        tax: taxTotal,
        discount: couponDiscount,
        items: selectedItems,
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(`order_${orderCode}`, JSON.stringify(orderData))
        localStorage.setItem("active_ecom_last_order", JSON.stringify(orderData))
      }

      clearCart()
      router.push(`/order-confirmed/${orderCode}`)
    } catch (err) {
      console.error("Order submission failed:", err)
      alert("Failed to submit order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (selectedItems.length === 0) {
    return (
      <div className="bg-[#f8f9fa] min-h-[60vh] py-12">
        <div className="container mx-auto px-4 max-w-xl text-center bg-white p-8 rounded border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800">No items selected for checkout</h3>
          <p className="mt-2 text-xs text-gray-500">
            Please add or select items in your shopping cart to proceed.
          </p>
          <div className="mt-5">
            <Link
              href="/cart"
              className="inline-flex rounded bg-[#d43533] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#9d1b1a]"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f8f9fa] min-h-[80vh] py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#d43533] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/cart" className="hover:text-[#d43533] transition-colors">
            Cart
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="font-semibold text-gray-800">Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Accordion Steps */}
          <div className="lg:col-span-8 space-y-4">
            {/* Step 1: Shipping Info */}
            <div className="rounded border border-gray-200 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("shipping")}
                className="flex w-full items-center justify-between p-4 sm:p-5 border-b border-gray-100 text-left hover:bg-gray-50/50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-[#d43533]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">1. Shipping Info</h3>
                    <p className="text-[11px] text-gray-500">Delivery and billing address details</p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    openSections.shipping ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.shipping && (
                <div className="p-4 sm:p-5 animate-in fade-in duration-150">
                  <ShippingStep
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={(addr) => setSelectedAddressId(addr.id)}
                    addresses={addresses}
                    onAddNewAddress={handleAddNewAddress}
                    sameAsShipping={sameAsShipping}
                    setSameAsShipping={setSameAsShipping}
                  />
                </div>
              )}
            </div>

            {/* Step 2: Delivery Info */}
            <div className="rounded border border-gray-200 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("delivery")}
                className="flex w-full items-center justify-between p-4 sm:p-5 border-b border-gray-100 text-left hover:bg-gray-50/50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-[#d43533]">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">2. Delivery Info</h3>
                    <p className="text-[11px] text-gray-500">Shipping method and package items</p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    openSections.delivery ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.delivery && (
                <div className="p-4 sm:p-5 animate-in fade-in duration-150">
                  <DeliveryStep
                    items={selectedItems}
                    deliveryType={deliveryType}
                    setDeliveryType={setDeliveryType}
                    pickupPoint={pickupPoint}
                    setPickupPoint={setPickupPoint}
                    carrier={carrier}
                    setCarrier={setCarrier}
                  />
                </div>
              )}
            </div>

            {/* Step 3: Payment */}
            <div className="rounded border border-gray-200 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("payment")}
                className="flex w-full items-center justify-between p-4 sm:p-5 border-b border-gray-100 text-left hover:bg-gray-50/50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-[#d43533]">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">3. Payment</h3>
                    <p className="text-[11px] text-gray-500">Select payment method and confirm</p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    openSections.payment ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.payment && (
                <div className="p-4 sm:p-5 animate-in fade-in duration-150">
                  <PaymentStep
                    paymentOption={paymentOption}
                    setPaymentOption={setPaymentOption}
                    additionalNotes={additionalNotes}
                    setAdditionalNotes={setAdditionalNotes}
                    agreed={agreed}
                    setAgreed={setAgreed}
                    isSubmitting={isSubmitting}
                    onSubmitOrder={handleSubmitOrder}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column (4 cols): Order Summary */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">
              <h4 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                Order Summary
              </h4>

              <div className="divide-y divide-gray-100 text-sm">
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Subtotal ({selectedCount} items)</span>
                  <span className="font-semibold text-gray-900">{formatPrice(selectedSubtotal)}</span>
                </div>
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">{formatPrice(shippingTotal)}</span>
                </div>
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold text-gray-900">{formatPrice(taxTotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between py-2 text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-bold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between pt-3 pb-1">
                  <span className="text-sm font-bold uppercase text-gray-900">Total</span>
                  <span className="text-xl font-extrabold text-[#d43533]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Delivery To pill */}
              <div className="mt-4 rounded bg-gray-50 p-3 text-xs text-gray-600 border border-gray-100">
                <div className="font-bold text-gray-800 mb-0.5">Shipping to:</div>
                <div className="line-clamp-2">
                  {selectedAddress.name}, {selectedAddress.address}, {selectedAddress.city}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
