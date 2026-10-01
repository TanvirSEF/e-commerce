export interface WalletRechargeItem {
  id: number
  userId: string
  userName: string
  userEmail: string
  amount: number
  paymentMethod: string
  paymentDetails: string | null
  addedBy: string
  approval: boolean
  createdAt: string
}

export interface AdminWalletRechargesResponse {
  items: WalletRechargeItem[]
  total: number
  counts: {
    all: number
    pending: number
    approved: number
    rechargedByAdmin: number
    rechargedByCustomer: number
  }
}
