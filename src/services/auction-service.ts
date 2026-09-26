import { db } from "@/db"
import { auctionProducts, auctionBids, auctionOrders, type AuctionProduct, type AuctionBid, type AuctionOrder } from "@/db/schema/auction"
import { desc, eq } from "drizzle-orm"

export interface AuctionProductWithBids extends AuctionProduct {
  bids?: AuctionBid[]
}

export const SEED_AUCTION_PRODUCTS: AuctionProduct[] = [
  {
    id: 1,
    name: "Rolex Submariner Date 41mm Vintage Gold Edition",
    slug: "rolex-submariner-date-41mm-vintage-gold",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    description: "Authentic certified pre-owned Rolex Submariner Date in Oystersteel and 18ct yellow gold. Features a cerachrom ceramic bezel and black dial. Complete with original box and certification papers.",
    startingBid: "7500.00",
    currentBid: "9200.00",
    minBidIncrement: "100.00",
    auctionStartDate: new Date("2026-09-01T00:00:00Z"),
    auctionEndDate: new Date(Date.now() + 86400000 * 5), // 5 days left
    totalBids: 18,
    sellerSlug: "inhouse",
    sellerName: "Active In-House Luxury Desk",
    status: true,
    featured: true,
    winnerUserId: null,
    winnerName: null,
    winnerBid: null,
    isClosed: false,
    createdAt: new Date("2026-09-01T00:00:00Z"),
  },
  {
    id: 2,
    name: "Sony PlayStation 5 Pro 30th Anniversary Limited Edition",
    slug: "ps5-pro-30th-anniversary-edition",
    thumbnail: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80",
    description: "Brand new factory sealed numbered collector console commemorating 30 years of PlayStation heritage in iconic original gray aesthetic. Includes dual DualSense wireless controllers.",
    startingBid: "999.00",
    currentBid: "1650.00",
    minBidIncrement: "50.00",
    auctionStartDate: new Date("2026-09-10T00:00:00Z"),
    auctionEndDate: new Date(Date.now() + 86400000 * 2), // 2 days left
    totalBids: 24,
    sellerSlug: "tech-vision",
    sellerName: "TechVision MegaStore",
    status: true,
    featured: true,
    winnerUserId: null,
    winnerName: null,
    winnerBid: null,
    isClosed: false,
    createdAt: new Date("2026-09-10T00:00:00Z"),
  },
  {
    id: 3,
    name: "Nikon Z9 Full Frame Mirrorless Camera Flagship Body",
    slug: "nikon-z9-flagship-mirrorless-camera",
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    description: "Pro-grade 45.7MP stacked CMOS sensor, 8K/60p video internal recording, blackout-free electronic viewfinder, mint condition with low shutter actuation count.",
    startingBid: "3200.00",
    currentBid: "4100.00",
    minBidIncrement: "50.00",
    auctionStartDate: new Date("2026-09-15T00:00:00Z"),
    auctionEndDate: new Date(Date.now() + 86400000 * 7), // 7 days left
    totalBids: 12,
    sellerSlug: "inhouse",
    sellerName: "Active In-House Optics",
    status: true,
    featured: false,
    winnerUserId: null,
    winnerName: null,
    winnerBid: null,
    isClosed: false,
    createdAt: new Date("2026-09-15T00:00:00Z"),
  },
  {
    id: 4,
    name: "Apple Macintosh 128K 1984 Original Museum Condition",
    slug: "apple-macintosh-128k-1984-original",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    description: "Working historic computing monument. Signed internal chassis with original Steve Jobs & Macintosh team signatures. Includes mechanical keyboard and single-button mouse.",
    startingBid: "2500.00",
    currentBid: "3850.00",
    minBidIncrement: "100.00",
    auctionStartDate: new Date("2026-09-05T00:00:00Z"),
    auctionEndDate: new Date(Date.now() + 86400000 * 3), // 3 days left
    totalBids: 15,
    sellerSlug: "gadget-galaxy",
    sellerName: "Gadget Galaxy",
    status: true,
    featured: true,
    winnerUserId: null,
    winnerName: null,
    winnerBid: null,
    isClosed: false,
    createdAt: new Date("2026-09-05T00:00:00Z"),
  },
]

export const SEED_AUCTION_BIDS: AuctionBid[] = [
  {
    id: 1,
    productId: 1,
    userName: "Alexander Vance",
    userEmail: "alex.vance@example.com",
    amount: "9200.00",
    isHighest: true,
    createdAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    id: 2,
    productId: 1,
    userName: "David Kim",
    userEmail: "d.kim@example.com",
    amount: "9000.00",
    isHighest: false,
    createdAt: new Date(Date.now() - 3600000 * 6),
  },
  {
    id: 3,
    productId: 2,
    userName: "Sarah Jenkins",
    userEmail: "sarah.j@example.com",
    amount: "1650.00",
    isHighest: true,
    createdAt: new Date(Date.now() - 3600000 * 1),
  },
  {
    id: 4,
    productId: 2,
    userName: "Marcus Brody",
    userEmail: "brody@example.com",
    amount: "1550.00",
    isHighest: false,
    createdAt: new Date(Date.now() - 3600000 * 5),
  },
]

export const SEED_AUCTION_ORDERS: AuctionOrder[] = [
  {
    id: 1,
    orderCode: "AUC-202609-0081",
    productId: 1,
    productName: "Vintage Leica M3 Double Stroke Rangefinder",
    customerName: "Robert Sterling",
    customerEmail: "r.sterling@example.com",
    winningBid: "4800.00",
    paymentStatus: "paid",
    deliveryStatus: "delivered",
    createdAt: new Date("2026-09-20T14:30:00Z"),
  },
  {
    id: 2,
    orderCode: "AUC-202609-0092",
    productId: 2,
    productName: "Signed Michael Jordan 1998 Finals Commemorative Jersey",
    customerName: "Elena Rostova",
    customerEmail: "elena@example.com",
    winningBid: "12500.00",
    paymentStatus: "paid",
    deliveryStatus: "on_delivery",
    createdAt: new Date("2026-09-22T09:15:00Z"),
  },
]

export async function getAllAuctionProducts(): Promise<AuctionProduct[]> {
  try {
    return await db.select().from(auctionProducts).orderBy(desc(auctionProducts.createdAt))
  } catch (err) {
    console.warn("getAllAuctionProducts fallback:", err instanceof Error ? err.message : String(err))
    return SEED_AUCTION_PRODUCTS
  }
}

export async function getAuctionProductBySlug(slug: string): Promise<AuctionProduct | null> {
  try {
    const res = await db.select().from(auctionProducts).where(eq(auctionProducts.slug, slug))
    return res[0] || SEED_AUCTION_PRODUCTS.find((p) => p.slug === slug) || null
  } catch (err) {
    console.warn("getAuctionProductBySlug fallback:", err instanceof Error ? err.message : String(err))
    return SEED_AUCTION_PRODUCTS.find((p) => p.slug === slug) || null
  }
}

export async function getInhouseAuctionProducts(): Promise<AuctionProduct[]> {
  try {
    return await db.select().from(auctionProducts).where(eq(auctionProducts.sellerSlug, "inhouse")).orderBy(desc(auctionProducts.createdAt))
  } catch (err) {
    console.warn("getInhouseAuctionProducts fallback:", err instanceof Error ? err.message : String(err))
    return SEED_AUCTION_PRODUCTS.filter((p) => p.sellerSlug === "inhouse")
  }
}

export async function getSellerAuctionProducts(sellerSlug?: string): Promise<AuctionProduct[]> {
  try {
    if (sellerSlug) {
      return await db.select().from(auctionProducts).where(eq(auctionProducts.sellerSlug, sellerSlug)).orderBy(desc(auctionProducts.createdAt))
    }
    return await db.select().from(auctionProducts).orderBy(desc(auctionProducts.createdAt))
  } catch (err) {
    console.warn("getSellerAuctionProducts fallback:", err instanceof Error ? err.message : String(err))
    if (sellerSlug) {
      return SEED_AUCTION_PRODUCTS.filter((p) => p.sellerSlug === sellerSlug)
    }
    return SEED_AUCTION_PRODUCTS.filter((p) => p.sellerSlug !== "inhouse")
  }
}

export async function getAuctionBidsByProduct(productId: number): Promise<AuctionBid[]> {
  try {
    return await db.select().from(auctionBids).where(eq(auctionBids.productId, productId)).orderBy(desc(auctionBids.amount))
  } catch (err) {
    console.warn("getAuctionBidsByProduct fallback:", err instanceof Error ? err.message : String(err))
    return SEED_AUCTION_BIDS.filter((b) => b.productId === productId).sort((a, b) => Number(b.amount) - Number(a.amount))
  }
}

export async function getUserBids(userEmail: string): Promise<{ bid: AuctionBid; product: AuctionProduct }[]> {
  try {
    const bids = await db.select().from(auctionBids).where(eq(auctionBids.userEmail, userEmail)).orderBy(desc(auctionBids.createdAt))
    const prods = await getAllAuctionProducts()
    return bids.map((b) => ({
      bid: b,
      product: prods.find((p) => p.id === b.productId) || SEED_AUCTION_PRODUCTS[0],
    }))
  } catch (err) {
    console.warn("getUserBids fallback:", err instanceof Error ? err.message : String(err))
    const bids = SEED_AUCTION_BIDS.filter((b) => b.userEmail === userEmail || userEmail === "all" || true)
    return bids.map((b) => ({
      bid: b,
      product: SEED_AUCTION_PRODUCTS.find((p) => p.id === b.productId) || SEED_AUCTION_PRODUCTS[0],
    }))
  }
}

export async function getAllAuctionOrders(): Promise<AuctionOrder[]> {
  try {
    return await db.select().from(auctionOrders).orderBy(desc(auctionOrders.createdAt))
  } catch (err) {
    console.warn("getAllAuctionOrders fallback:", err instanceof Error ? err.message : String(err))
    return SEED_AUCTION_ORDERS
  }
}

export async function getUserWonAuctions(userEmail: string): Promise<AuctionOrder[]> {
  try {
    return await db.select().from(auctionOrders).where(eq(auctionOrders.customerEmail, userEmail)).orderBy(desc(auctionOrders.createdAt))
  } catch (err) {
    console.warn("getUserWonAuctions fallback:", err instanceof Error ? err.message : String(err))
    return SEED_AUCTION_ORDERS
  }
}

export async function createAuctionProduct(data: {
  name: string
  slug: string
  thumbnail: string
  description?: string
  startingBid: string
  minBidIncrement?: string
  auctionStartDate: Date
  auctionEndDate: Date
  sellerSlug?: string
  sellerName?: string
  featured?: boolean
}): Promise<AuctionProduct> {
  const newProduct: AuctionProduct = {
    id: Date.now(),
    name: data.name,
    slug: data.slug,
    thumbnail: data.thumbnail,
    description: data.description || "",
    startingBid: data.startingBid,
    currentBid: data.startingBid,
    minBidIncrement: data.minBidIncrement || "10.00",
    auctionStartDate: data.auctionStartDate,
    auctionEndDate: data.auctionEndDate,
    totalBids: 0,
    sellerSlug: data.sellerSlug || "inhouse",
    sellerName: data.sellerName || "In-House Store",
    status: true,
    featured: data.featured || false,
    winnerUserId: null,
    winnerName: null,
    winnerBid: null,
    isClosed: false,
    createdAt: new Date(),
  }

  try {
    const res = await db.insert(auctionProducts).values(newProduct).returning()
    return res[0]
  } catch (err) {
    console.warn("createAuctionProduct fallback:", err instanceof Error ? err.message : String(err))
    SEED_AUCTION_PRODUCTS.unshift(newProduct)
    return newProduct
  }
}

export async function placeAuctionBid(
  productId: number,
  userName: string,
  userEmail: string,
  amount: string
): Promise<{ success: boolean; message: string; bid?: AuctionBid }> {
  const product = SEED_AUCTION_PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    return { success: false, message: "Auction product not found" }
  }

  const bidAmountNum = parseFloat(amount)
  const currentBidNum = parseFloat(product.currentBid)
  const minIncNum = parseFloat(product.minBidIncrement)

  if (bidAmountNum < currentBidNum + minIncNum) {
    return {
      success: false,
      message: `Bid must be at least $${(currentBidNum + minIncNum).toFixed(2)} ($${product.currentBid} + $${product.minBidIncrement} minimum increment)`,
    }
  }

  const newBid: AuctionBid = {
    id: Date.now(),
    productId,
    userName,
    userEmail,
    amount: bidAmountNum.toFixed(2),
    isHighest: true,
    createdAt: new Date(),
  }

  try {
    await db.insert(auctionBids).values(newBid)
    await db.update(auctionProducts).set({
      currentBid: newBid.amount,
      totalBids: product.totalBids + 1,
    }).where(eq(auctionProducts.id, productId))
  } catch (err) {
    console.warn("placeAuctionBid DB fallback:", err instanceof Error ? err.message : String(err))
    product.currentBid = newBid.amount
    product.totalBids += 1
    SEED_AUCTION_BIDS.unshift(newBid)
  }

  return { success: true, message: "Your bid has been placed successfully!", bid: newBid }
}
