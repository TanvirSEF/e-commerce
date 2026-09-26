import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getShopBySlug, getShopProducts, getShopCoupons } from "@/services/shop-service"
import { ShopHeader } from "../_components/shop-header"
import { ShopNav } from "../_components/shop-nav"
import { ShopHomeTab } from "../_components/shop-home-tab"
import { ShopCouponsTab } from "../_components/shop-coupons-tab"
import { ShopProductsTab } from "../_components/shop-products-tab"

interface PageProps {
  params: Promise<{ slug: string; type: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, type } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) return { title: "Store Not Found" }

  const formattedType = type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `${shop.name} - ${formattedType} | Active eCommerce CMS`,
    description: `Browse ${formattedType} from ${shop.name}. Quality products with verified seller guarantee.`,
  }
}

export default async function ShopTypePage({ params }: PageProps) {
  const { slug, type } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) {
    notFound()
  }

  const tab = type || "all-products"
  const [{ products }, coupons] = await Promise.all([
    getShopProducts(slug, { type: tab === "top-selling" ? "top-selling" : undefined }),
    getShopCoupons(slug),
  ])

  return (
    <div className="bg-[#f2f3f8] min-h-screen">
      {/* Shop Identity Header */}
      <ShopHeader shop={shop} />

      {/* Tabs Navigation */}
      <ShopNav
        shopSlug={shop.slug}
        activeTab={tab}
        couponCount={coupons.length}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {tab === "home" && (
          <ShopHomeTab shop={shop} products={products} coupons={coupons} />
        )}

        {tab === "top-selling" && (
          <ShopProductsTab
            products={products}
            title={`Top Selling Products from ${shop.name}`}
          />
        )}

        {tab === "coupons" && (
          <ShopCouponsTab coupons={coupons} shopName={shop.name} />
        )}

        {tab === "all-products" && (
          <ShopProductsTab
            products={products}
            title={`All Products from ${shop.name}`}
          />
        )}

        {tab !== "home" && tab !== "top-selling" && tab !== "coupons" && tab !== "all-products" && (
          <ShopProductsTab
            products={products}
            title={`Products from ${shop.name}`}
          />
        )}
      </div>
    </div>
  )
}
