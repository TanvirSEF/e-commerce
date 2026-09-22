import mongoose from "mongoose"
import { SEED_CATEGORIES, SEED_BRANDS, SEED_PRODUCTS, SEED_FLASH_DEALS } from "../lib/seed-data"
import CategoryModel from "../lib/models/Category"
import BrandModel from "../lib/models/Brand"
import ProductModel from "../lib/models/Product"
import UserModel from "../lib/models/User"
import BusinessSettingModel from "../lib/models/BusinessSetting"
import FlashDealModel from "../lib/models/FlashDeal"

async function runSeed() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("❌ MONGODB_URI is missing in .env.local")
    process.exit(1)
  }

  console.log("🌱 Connecting to MongoDB Atlas...")
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
    console.log("✅ Successfully connected to MongoDB Atlas database!")
  } catch (err) {
    console.error("❌ Connection failed:", (err as Error).message)
    console.error("👉 Please ensure your IP address is whitelisted in MongoDB Atlas Network Access.")
    process.exit(1)
  }

  try {
    console.log("\n📦 1. Seeding Categories...")
    const categoryMap = new Map<string, mongoose.Types.ObjectId>()
    for (const cat of SEED_CATEGORIES) {
      const doc = await CategoryModel.findOneAndUpdate(
        { slug: cat.slug },
        {
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          banner: cat.banner,
          featured: cat.featured,
          order_level: cat.orderLevel,
        },
        { upsert: true, new: true }
      )
      categoryMap.set(cat.slug, doc._id as mongoose.Types.ObjectId)
      console.log(`   + Category: ${cat.name}`)
    }

    console.log("\n🏷️  2. Seeding Brands...")
    const brandMap = new Map<string, mongoose.Types.ObjectId>()
    for (const brand of SEED_BRANDS) {
      const doc = await BrandModel.findOneAndUpdate(
        { slug: brand.slug },
        {
          name: brand.name,
          slug: brand.slug,
          logo: brand.logo,
          top: brand.top,
        },
        { upsert: true, new: true }
      )
      brandMap.set(brand.slug, doc._id as mongoose.Types.ObjectId)
      console.log(`   + Brand: ${brand.name}`)
    }

    console.log("\n🛍️  3. Seeding Products & Variants...")
    for (const prod of SEED_PRODUCTS) {
      const catId = categoryMap.get(prod.categorySlug) || Array.from(categoryMap.values())[0]
      const brandId = brandMap.get(prod.brandSlug)

      await ProductModel.findOneAndUpdate(
        { slug: prod.slug },
        {
          name: prod.name,
          slug: prod.slug,
          sku: prod.sku,
          category: catId,
          brand: brandId || null,
          photos: prod.images,
          thumbnail_img: prod.thumbnail,
          unit_price: prod.price,
          purchase_price: prod.originalPrice,
          discount: prod.discountPercent,
          discount_type: "percent",
          current_stock: prod.stock,
          unit: prod.unit,
          rating: prod.rating,
          num_of_reviews: prod.reviewCount,
          num_of_sale: prod.salesCount,
          description: prod.description,
          colors: prod.colors.map((c) => c.hex),
          choice_options: prod.sizes.length
            ? [{ attribute_id: "size", values: prod.sizes }]
            : [],
          variations: prod.sizes.map((s) => ({
            variant: s,
            sku: `${prod.sku}-${s}`,
            price: prod.price,
            stock: Math.floor(prod.stock / (prod.sizes.length || 1)),
          })),
          featured: prod.featured,
          todays_deal: prod.todaysDeal,
          published: true,
        },
        { upsert: true, new: true }
      )
      console.log(`   + Product: ${prod.name.slice(0, 45)}...`)
    }

    console.log("\n👤 4. Seeding Default Accounts...")
    // Admin Account
    await UserModel.findOneAndUpdate(
      { email: "admin@example.com" },
      {
        name: "Active eCommerce Admin",
        email: "admin@example.com",
        phone: "+880 1700 000000",
        password: "admin_secured_hash",
        user_type: "admin",
        avatar: "/assets/img/avatar-place.png",
        balance: 50000,
      },
      { upsert: true }
    )
    console.log("   + Admin: admin@example.com")

    // Customer Account
    await UserModel.findOneAndUpdate(
      { email: "tanvir@example.com" },
      {
        name: "Tanvir Ahmed",
        email: "tanvir@example.com",
        phone: "+880 1712 345678",
        password: "customer_secured_hash",
        user_type: "customer",
        avatar: "/assets/img/avatar-place.png",
        balance: 2500,
        addresses: [
          {
            address: "House 12, Road 4, Sector 7, Uttara",
            country: "Bangladesh",
            city: "Dhaka",
            state: "Dhaka",
            postal_code: "1230",
            phone: "+880 1712 345678",
            set_default: true,
          },
        ],
      },
      { upsert: true }
    )
    console.log("   + Customer: tanvir@example.com")

    console.log("\n⚡ 5. Seeding Flash Deals...")
    for (const fd of SEED_FLASH_DEALS) {
      await FlashDealModel.findOneAndUpdate(
        { slug: fd.slug },
        {
          title: fd.title,
          slug: fd.slug,
          start_date: Math.floor(fd.startDate / 1000),
          end_date: Math.floor(fd.endDate / 1000),
          status: fd.status,
          featured: fd.featured,
          banner: fd.banner,
        },
        { upsert: true }
      )
      console.log(`   + Flash Deal: ${fd.title}`)
    }

    console.log("\n⚙️  6. Seeding Business Settings...")
    const settings = [
      { type: "site_name", value: "Active eCommerce CMS" },
      { type: "currency_code", value: "BDT" },
      { type: "currency_symbol", value: "৳" },
      { type: "home_categories", value: JSON.stringify(Array.from(categoryMap.values()).slice(0, 4)) },
      { type: "top_brands", value: JSON.stringify(Array.from(brandMap.values()).slice(0, 6)) },
    ]
    for (const setting of settings) {
      await BusinessSettingModel.findOneAndUpdate(
        { type: setting.type },
        { value: setting.value },
        { upsert: true }
      )
      console.log(`   + Setting: ${setting.type}`)
    }

    console.log("\n========================================================")
    console.log("🎉 SUCCESS: MongoDB Atlas database seeded completely!")
    console.log("========================================================\n")
    process.exit(0)
  } catch (err) {
    console.error("❌ Error during seeding:", err)
    process.exit(1)
  }
}

runSeed()
