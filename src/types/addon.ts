export interface AddonItem {
  id: number
  name: string
  uniqueIdentifier: string
  version: string
  description: string
  image: string
  installed: boolean
  activated: boolean
  purchaseCode?: string
}

export interface AvailableAddonItem {
  id: string
  name: string
  image: string
  rating: number
  shortDescription: string
  price: number
  link?: string
  purchase?: string
  comingSoon?: boolean
}

export interface InstallAddonPayload {
  name: string
  uniqueIdentifier: string
  version?: string
  purchaseCode: string
  mainPurchaseCode?: string
  description?: string
  image?: string
}
