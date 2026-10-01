// src/types/customer-admin.ts
export interface AdminCustomerItem {
  id: string
  name: string
  email: string
  phone: string | null
  image: string | null
  balance: number
  role: string
  emailVerified: boolean
  banned: boolean
  isSuspicious: boolean
  createdAt: string
}

export interface AdminCustomersResponse {
  items: AdminCustomerItem[]
  total: number
  counts: {
    all: number
    banned: number
    suspicious: number
    verified: number
    unverified: number
  }
}
