export interface FollowedSellerItem {
  id: number
  shopId: number
  shopName: string
  shopSlug: string
  logo: string
  rating: number
  totalProducts: number
  verified: boolean
  followedDate: string
}

export interface DigitalPurchaseItem {
  id: string
  productName: string
  productSlug: string
  thumbnailImg: string
  orderCode: string
  purchaseDate: string
  fileSize: string
  fileFormat: string
  downloadUrl: string
  licenseKey?: string
}

const SEED_FOLLOWED_SELLERS: FollowedSellerItem[] = [
  {
    id: 1,
    shopId: 1,
    shopName: "Star Tech Official Store",
    shopSlug: "star-tech-official-store",
    logo: "/assets/img/shops/1.jpg",
    rating: 4.9,
    totalProducts: 142,
    verified: true,
    followedDate: "2026-02-14",
  },
  {
    id: 2,
    shopId: 2,
    shopName: "Apex Footwear Bangladesh",
    shopSlug: "apex-footwear-bangladesh",
    logo: "/assets/img/shops/2.jpg",
    rating: 4.7,
    totalProducts: 88,
    verified: true,
    followedDate: "2026-03-01",
  },
]

const SEED_DIGITAL_PURCHASES: DigitalPurchaseItem[] = [
  {
    id: "dp-1",
    productName: "Windows 11 Pro Retail License Key (Lifetime Activation)",
    productSlug: "windows-11-pro-license",
    thumbnailImg: "/assets/img/products/1.jpg",
    orderCode: "20260920-101122",
    purchaseDate: "2026-03-20",
    fileSize: "12 KB (License Text)",
    fileFormat: "TXT / KEY",
    downloadUrl: "#download-key",
    licenseKey: "W269N-WFGWX-YVC9B-4J6C9-T83GX",
  },
  {
    id: "dp-2",
    productName: "E-Commerce Financial Spreadsheet & Dashboard (Excel / Sheets)",
    productSlug: "ecommerce-financial-template",
    thumbnailImg: "/assets/img/products/2.jpg",
    orderCode: "20260918-092233",
    purchaseDate: "2026-03-18",
    fileSize: "4.8 MB (XLSX)",
    fileFormat: "XLSX",
    downloadUrl: "#download-template",
    licenseKey: "HUI-PRO-FIN-889922",
  },
]

export async function getFollowedSellers(): Promise<FollowedSellerItem[]> {
  return SEED_FOLLOWED_SELLERS
}

export async function getDigitalPurchases(): Promise<DigitalPurchaseItem[]> {
  return SEED_DIGITAL_PURCHASES
}
