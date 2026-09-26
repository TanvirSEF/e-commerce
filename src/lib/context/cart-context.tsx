"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  thumbnail: string
  price: number
  quantity: number
  variation?: string
  selected: boolean
  sellerName?: string
  tax?: number
  shippingCost?: number
}

export interface AppliedCoupon {
  code: string
  discount: number
  discountType: "percent" | "amount"
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (item: Omit<CartItem, "id" | "selected">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, delta: number) => void
  setQuantity: (id: string, qty: number) => void
  toggleSelectItem: (id: string) => void
  toggleSelectAll: (selected: boolean) => void
  toggleSellerItems: (sellerName: string, selected: boolean) => void
  clearCart: () => void
  appliedCoupon: AppliedCoupon | null
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>
  removeCoupon: () => void

  totalCount: number
  selectedCount: number
  subtotal: number
  selectedSubtotal: number
  shippingTotal: number
  taxTotal: number
  couponDiscount: number
  grandTotal: number
  clubPoints: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const INITIAL_ITEMS: CartItem[] = [
  {
    id: "item-1",
    productId: "prod-1",
    name: "Classic Men's Casual Shirt - Slim Fit Cotton",
    slug: "classic-mens-casual-shirt",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1250,
    quantity: 1,
    variation: "Blue / L",
    selected: true,
    sellerName: "Inhouse Products",
    tax: 0,
    shippingCost: 60,
  },
  {
    id: "item-2",
    productId: "prod-2",
    name: "Wireless Noise-Cancelling Bluetooth Over-Ear Headphones",
    slug: "wireless-noise-cancelling-headphones",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 3450,
    quantity: 1,
    variation: "Matte Black",
    selected: true,
    sellerName: "Inhouse Products",
    tax: 0,
    shippingCost: 60,
  },
]

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS)
  const [isOpen, setIsOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)
  const isInitialized = React.useRef(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("active_ecom_cart")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map((item: CartItem) => ({
            ...item,
            selected: item.selected !== undefined ? item.selected : true,
            sellerName: item.sellerName || "Inhouse Products",
            tax: item.tax || 0,
            shippingCost: item.shippingCost || 60,
          }))
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(sanitized)
        }
      }
    } catch {
      // ignore
    }
    isInitialized.current = true
  }, [])

  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem("active_ecom_cart", JSON.stringify(items))
    }
  }, [items])

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen((prev) => !prev)

  const addItem = (newItem: Omit<CartItem, "id" | "selected">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.variation === newItem.variation
      )
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id
            ? { ...i, quantity: i.quantity + newItem.quantity, selected: true }
            : i
        )
      }
      return [
        ...prev,
        {
          ...newItem,
          id: `item-${Date.now()}`,
          selected: true,
          sellerName: newItem.sellerName || "Inhouse Products",
          tax: newItem.tax || 0,
          shippingCost: newItem.shippingCost || 60,
        },
      ]
    })
    setIsOpen(true)
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = i.quantity + delta
            return newQty > 0 ? { ...i, quantity: newQty } : null
          }
          return i
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const setQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    )
  }

  const toggleSelectItem = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i))
    )
  }

  const toggleSelectAll = (selected: boolean) => {
    setItems((prev) => prev.map((i) => ({ ...i, selected })))
  }

  const toggleSellerItems = (sellerName: string, selected: boolean) => {
    setItems((prev) =>
      prev.map((i) =>
        (i.sellerName || "Inhouse Products") === sellerName ? { ...i, selected } : i
      )
    )
  }

  const clearCart = () => {
    setItems([])
    setAppliedCoupon(null)
  }

  const applyCoupon = async (code: string) => {
    const clean = code.trim().toUpperCase()
    if (!clean) {
      return { success: false, message: "Please enter a coupon code." }
    }

    try {
      const { validateCouponAction } = await import("@/app/actions/ecommerce-actions")
      const res = await validateCouponAction(clean, selectedSubtotal || subtotal)
      if (res.success && res.discount) {
        setAppliedCoupon({
          code: clean,
          discount: res.discount,
          discountType: res.discountType || "percent",
        })
        return { success: true, message: res.message }
      } else if (!res.success && res.message) {
        return { success: false, message: res.message }
      }
    } catch (err) {
      console.warn("Coupon server validation fallback:", err)
    }

    if (clean === "WELCOME10") {
      setAppliedCoupon({ code: clean, discount: 10, discountType: "percent" })
      return { success: true, message: "Welcome coupon applied successfully (10% OFF)!" }
    }
    if (clean === "SAVE100") {
      setAppliedCoupon({ code: clean, discount: 100, discountType: "amount" })
      return { success: true, message: "Coupon applied! ৳100 discount added." }
    }
    if (clean === "HUI2026") {
      setAppliedCoupon({ code: clean, discount: 15, discountType: "percent" })
      return { success: true, message: "Special promo applied! 15% discount added." }
    }
    return { success: false, message: "Invalid or expired coupon code." }
  }


  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const selectedItems = items.filter((i) => i.selected)
  const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const selectedSubtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shippingTotal = selectedItems.length > 0 ? 60 : 0
  const taxTotal = 0

  let couponDiscount = 0
  if (appliedCoupon && selectedSubtotal > 0) {
    if (appliedCoupon.discountType === "percent") {
      couponDiscount = Math.round((selectedSubtotal * appliedCoupon.discount) / 100)
    } else {
      couponDiscount = Math.min(appliedCoupon.discount, selectedSubtotal)
    }
  }

  const grandTotal = Math.max(0, selectedSubtotal + shippingTotal + taxTotal - couponDiscount)
  const clubPoints = selectedItems.length * 5

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        setQuantity,
        toggleSelectItem,
        toggleSelectAll,
        toggleSellerItems,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        totalCount,
        selectedCount,
        subtotal,
        selectedSubtotal,
        shippingTotal,
        taxTotal,
        couponDiscount,
        grandTotal,
        clubPoints,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
