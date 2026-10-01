"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { categories } from "@/db/schema/products"
import { brands } from "@/db/schema/products"

export async function importDemoDataAction() {
  try {
    // Count existing records first (idempotent — only seed if empty)
    const existingCategories = await db.select().from(categories).limit(1)
    const existingBrands = await db.select().from(brands).limit(1)

    const results: Record<string, number> = {
      categories: 0,
      brands: 0,
    }

    if (existingCategories.length === 0) {
      const demoCategories = [
        { name: "Electronics", slug: "electronics", icon: "monitor", featured: true, orderLevel: 1 },
        { name: "Fashion", slug: "fashion", icon: "shirt", featured: true, orderLevel: 2 },
        { name: "Home & Garden", slug: "home-garden", icon: "home", featured: false, orderLevel: 3 },
        { name: "Sports & Outdoors", slug: "sports-outdoors", icon: "activity", featured: false, orderLevel: 4 },
        { name: "Books & Education", slug: "books-education", icon: "book", featured: false, orderLevel: 5 },
        { name: "Health & Beauty", slug: "health-beauty", icon: "heart", featured: true, orderLevel: 6 },
        { name: "Toys & Kids", slug: "toys-kids", icon: "gift", featured: false, orderLevel: 7 },
        { name: "Automotive", slug: "automotive", icon: "car", featured: false, orderLevel: 8 },
        { name: "Groceries", slug: "groceries", icon: "shopping-cart", featured: false, orderLevel: 9 },
        { name: "Office Supplies", slug: "office-supplies", icon: "briefcase", featured: false, orderLevel: 10 },
      ]
      await db.insert(categories).values(demoCategories)
      results.categories = demoCategories.length
    }

    if (existingBrands.length === 0) {
      const demoBrands = [
        { name: "Samsung", slug: "samsung", logo: "/assets/img/placeholder-brand.png", top: true },
        { name: "Apple", slug: "apple", logo: "/assets/img/placeholder-brand.png", top: true },
        { name: "Sony", slug: "sony", logo: "/assets/img/placeholder-brand.png", top: false },
        { name: "Nike", slug: "nike", logo: "/assets/img/placeholder-brand.png", top: true },
        { name: "Adidas", slug: "adidas", logo: "/assets/img/placeholder-brand.png", top: false },
        { name: "LG", slug: "lg", logo: "/assets/img/placeholder-brand.png", top: false },
        { name: "Dell", slug: "dell", logo: "/assets/img/placeholder-brand.png", top: false },
        { name: "HP", slug: "hp", logo: "/assets/img/placeholder-brand.png", top: false },
      ]
      await db.insert(brands).values(demoBrands)
      results.brands = demoBrands.length
    }

    revalidatePath("/admin")
    revalidatePath("/admin/products")

    const totalInserted = Object.values(results).reduce((a, b) => a + b, 0)

    return {
      success: true,
      message:
        totalInserted > 0
          ? `Demo data imported: ${results.categories} categories, ${results.brands} brands inserted.`
          : "Demo data already exists — no new records added.",
      results,
    }
  } catch (err) {
    console.error("importDemoDataAction error:", err)
    return {
      success: false,
      message: "Failed to import demo data. Check server logs.",
      results: {},
    }
  }
}
