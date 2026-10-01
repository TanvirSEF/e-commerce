import pg from "pg"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const { Client } = pg

async function seedBlogs() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    // 1. Ensure columns exist in PostgreSQL
    await client.query(`
      ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_img TEXT;
      ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
    `)

    // 2. Check and seed blog categories
    const existingCats = await client.query("SELECT id, slug FROM blog_categories;")
    const catMap = new Map<string, number>()
    for (const row of existingCats.rows) {
      catMap.set(row.slug, row.id)
    }

    const defaultCategories = [
      { name: "Fashion & Trends", slug: "fashion-trends" },
      { name: "Technology & Gadgets", slug: "technology-gadgets" },
      { name: "Lifestyle & Living", slug: "lifestyle-living" },
      { name: "Shopping Tips", slug: "shopping-tips" },
    ]

    for (const cat of defaultCategories) {
      if (!catMap.has(cat.slug)) {
        const res = await client.query(
          "INSERT INTO blog_categories (category_name, slug, created_at) VALUES ($1, $2, NOW()) RETURNING id;",
          [cat.name, cat.slug]
        )
        catMap.set(cat.slug, res.rows[0].id)
      }
    }

    // 3. Check and seed blogs
    const existingBlogs = await client.query("SELECT slug FROM blogs;")
    const existingSlugs = new Set(existingBlogs.rows.map((r: { slug: string }) => r.slug))

    const defaultBlogs = [
      {
        title: "10 Essential Gadgets Every Remote Worker Needs in 2026",
        slug: "10-essential-gadgets-remote-worker-2026",
        categorySlug: "technology-gadgets",
        shortDescription:
          "Discover the top productivity boosters and smart desktop accessories to elevate your daily home office experience.",
        description:
          "Working remotely has become the standard for modern professionals. Having the right tools and ergonomic peripherals not only enhances your daily workflow efficiency but also protects your physical well-being. From active noise-cancelling headphones to wireless charging stations and ultrawide monitors, here is our ultimate gear checklist for 2026.",
        banner: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&auto=format&fit=crop&q=80",
        status: true,
        metaTitle: "10 Essential Gadgets for Remote Work (2026)",
        metaImg: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
        metaDescription: "Boost your productivity with top home office and remote work accessories.",
        metaKeywords: "gadgets, remote work, home office, technology",
      },
      {
        title: "The Ultimate Guide to Seasonal Fashion & Sustainable Fabrics",
        slug: "ultimate-guide-seasonal-fashion-sustainable-fabrics",
        categorySlug: "fashion-trends",
        shortDescription:
          "Explore eco-friendly wardrobe staples, organic cotton blends, and modern minimalist outfit styling.",
        description:
          "Sustainable fashion is more than a trend—it is a conscious choice towards enduring quality. In this article, our stylists break down the essential pieces you need for versatile seasonal layering, breathable pure cottons, and timeless colors that never go out of style.",
        banner: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80",
        status: true,
        metaTitle: "Seasonal Fashion & Sustainable Fabrics Guide",
        metaImg: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
        metaDescription: "Tips and advice for choosing sustainable and eco-friendly outfits this season.",
        metaKeywords: "fashion, sustainable clothing, seasonal styles",
      },
      {
        title: "How to Maximize Your Savings During Flash Sales and Festival Promos",
        slug: "how-to-maximize-savings-flash-sales",
        categorySlug: "shopping-tips",
        shortDescription:
          "Smart coupon stacking tricks, wallet cashbacks, and early-bird checkout tips to get the highest discounts.",
        description:
          "Online flash sales offer incredible price drops, but items go out of stock in minutes. Learn the best strategies: setting wishlist alerts, pre-filling shipping addresses, combining store vouchers with bank payment discounts, and collecting club points for extra savings.",
        banner: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80",
        status: true,
        metaTitle: "Maximize Savings in Flash Sales & Promotions",
        metaImg: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80",
        metaDescription: "Proven shopping strategies to score the biggest savings on ecommerce sales.",
        metaKeywords: "flash sale, coupons, discount tips, smart shopping",
      },
      {
        title: "The Modern Home: Minimalist Living and Smart Organization in 2026",
        slug: "modern-home-minimalist-living",
        categorySlug: "lifestyle-living",
        shortDescription:
          "Declutter your living space and create a calm, functional home environment with smart interior design.",
        description:
          "Minimalist living is not about having less—it is about making room for what truly matters. Transform your home using neutral palettes, modular storage units, and ambient smart lighting to achieve a serene daily sanctuary.",
        banner: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80",
        status: true,
        metaTitle: "Minimalist Living & Modern Home Organization",
        metaImg: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
        metaDescription: "Discover tips to organize your modern home and embrace peaceful minimalist design.",
        metaKeywords: "interior design, minimalism, home organization, lifestyle",
      },
    ]

    for (const b of defaultBlogs) {
      if (!existingSlugs.has(b.slug)) {
        const categoryId = catMap.get(b.categorySlug) || null
        await client.query(
          `INSERT INTO blogs (
            category_id, title, slug, short_description, description,
            banner, status, meta_title, meta_img, meta_description, meta_keywords,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW());`,
          [
            categoryId,
            b.title,
            b.slug,
            b.shortDescription,
            b.description,
            b.banner,
            b.status,
            b.metaTitle,
            b.metaImg,
            b.metaDescription,
            b.metaKeywords,
          ]
        )
      }
    }

    console.log("✅ Seeded canonical blog categories and blogs successfully!")
  } finally {
    await client.end()
  }
}

seedBlogs().catch((err) => {
  console.error("Error seeding blogs:", err)
  process.exit(1)
})
