export interface ClassifiedProductItem {
  id: number
  name: string
  slug: string
  category: string
  thumbnailImg: string
  unitPrice: number
  condition: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  location: string
  published: boolean
  status: string
  date: string
  description?: string
}

export interface AdminClassifiedResponse {
  items: ClassifiedProductItem[]
  total: number
}
