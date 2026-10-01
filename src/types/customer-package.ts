// src/types/customer-package.ts
export interface CustomerPackageItem {
  id: number
  name: string
  amount: number
  productUpload: number
  logo: string | null
  status: boolean
  createdAt: string
}

export interface CustomerPackageInputData {
  name: string
  amount: number
  productUpload: number
  logo?: string
}
