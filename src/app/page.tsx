import React from "react"
import { HomeFeaturesBar } from "./_components/home-features-bar"
import { HomeHero } from "./_components/home-hero"
import { FlashDealSection } from "./_components/flash-deal-section"
import { TodaysDealSection } from "./_components/todays-deal-section"
import { FeaturedCategories } from "./_components/featured-categories"
import { PromoBanners } from "./_components/promo-banners"
import { FeaturedProductsSection } from "./_components/featured-products-section"
import { BestSellingSection } from "./_components/best-selling-section"
import { HomeCategoryProducts } from "./_components/home-category-products"
import { TopSellersSection } from "./_components/top-sellers-section"
import { TopBrandsSection } from "./_components/top-brands-section"
import { HomeCouponsSection } from "./_components/home-coupons-section"
import { HomePreorderSection } from "./_components/home-preorder-section"
import { HomeAuctionSection } from "./_components/home-auction-section"
import { getHomePageData } from "@/services/home-service"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const data = await getHomePageData()

  return (
    <div className="flex flex-col gap-2">
      {/* 1. Value Proposition Features Bar */}
      <HomeFeaturesBar />

      {/* 2. Hero Section: Category Menu + Slider */}
      <HomeHero
        categories={data.hero.categories}
        sliders={data.hero.sliders}
      />

      {/* 3. Flash Deals with Live Countdown */}
      {data.flashDeal && <FlashDealSection deal={data.flashDeal} />}

      {/* 4. Today's Deals (todays_deal = true) */}
      {data.todaysDeals.length > 0 && (
        <TodaysDealSection products={data.todaysDeals} />
      )}

      {/* 5. Featured Categories Grid */}
      <FeaturedCategories categories={data.featuredCategories} />

      {/* 6. Promotional Banners Grid */}
      <PromoBanners />

      {/* 7. Featured Products Section */}
      {data.featuredProducts.length > 0 && (
        <FeaturedProductsSection products={data.featuredProducts} />
      )}

      {/* 8. Pre-order Highlights */}
      {data.preorders.length > 0 && (
        <HomePreorderSection preorders={data.preorders} />
      )}

      {/* 9. Best Selling Products (Sorted by numOfSale DESC) */}
      <BestSellingSection products={data.bestSellingProducts} />

      {/* 10. Live Auction Highlights */}
      {data.auctions.length > 0 && (
        <HomeAuctionSection auctions={data.auctions} />
      )}

      {/* 11. Exclusive Coupons Banner */}
      {data.coupons.length > 0 && (
        <HomeCouponsSection coupons={data.coupons} />
      )}

      {/* 12. Dynamic Category Product Showcases */}
      {data.categorySections.map((sec) => (
        <HomeCategoryProducts
          key={sec.id}
          title={sec.name}
          slug={sec.slug}
          subcategories={sec.subcategories}
          products={sec.products}
          accentColor={sec.accentColor}
        />
      ))}

      {/* 13. Top Verified Sellers */}
      {data.topSellers.length > 0 && (
        <TopSellersSection sellers={data.topSellers} />
      )}

      {/* 14. Top Brands */}
      {data.topBrands.length > 0 && (
        <TopBrandsSection brands={data.topBrands} />
      )}
    </div>
  )
}
