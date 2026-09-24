import { db } from "@/db"
import { pages, type Page, type NewPage } from "@/db/schema/pages"
import { eq, desc, asc } from "drizzle-orm"

export const DEFAULT_SYSTEM_PAGES: Page[] = [
  {
    id: 1,
    type: "home_page",
    title: "Home Page",
    slug: "home",
    content: "Main storefront landing page.",
    metaTitle: "Active eCommerce - Multi-Vendor Marketplace",
    metaDescription: "Welcome to Active eCommerce marketplace",
    keywords: "ecommerce, shopping, marketplace",
    metaImage: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    type: "terms_conditions_page",
    title: "Terms & Conditions",
    slug: "terms",
    content: "Terms and conditions of use for Active eCommerce CMS.",
    metaTitle: "Terms & Conditions",
    metaDescription: "Terms of service and legal agreement",
    keywords: "terms, legal, policy",
    metaImage: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 3,
    type: "privacy_policy_page",
    title: "Privacy Policy",
    slug: "privacy-policy",
    content: "Privacy policy describing how data is collected and protected.",
    metaTitle: "Privacy Policy",
    metaDescription: "Privacy policy and GDPR details",
    keywords: "privacy, security, data",
    metaImage: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 4,
    type: "return_policy_page",
    title: "Return Policy",
    slug: "return-policy",
    content: "Guidelines for returning items and receiving refunds.",
    metaTitle: "Return Policy",
    metaDescription: "Return and refund guidelines",
    keywords: "returns, refunds, exchange",
    metaImage: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 5,
    type: "support_policy_page",
    title: "Support Policy",
    slug: "support-policy",
    content: "Support SLAs and guidelines for customer inquiries.",
    metaTitle: "Support Policy",
    metaDescription: "Customer support rules and helpdesk information",
    keywords: "support, tickets, helpdesk",
    metaImage: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 6,
    type: "contact_us_page",
    title: "Contact Us",
    slug: "contact",
    content: "Get in touch with customer support and sales team.",
    metaTitle: "Contact Us",
    metaDescription: "Contact Active eCommerce support",
    keywords: "contact, email, support",
    metaImage: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 7,
    type: "custom_page",
    title: "About Us",
    slug: "about-us",
    content: "Active eCommerce is the leading multi-vendor marketplace platform delivering top-tier shopping experiences across Bangladesh and beyond.",
    metaTitle: "About Us",
    metaDescription: "Learn more about Active eCommerce marketplace",
    keywords: "about, company, profile",
    metaImage: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

export async function getAllPages(): Promise<Page[]> {
  try {
    const list = await db.select().from(pages).orderBy(asc(pages.id))
    if (!list || list.length === 0) {
      // Seed default system pages if table is empty
      try {
        for (const p of DEFAULT_SYSTEM_PAGES) {
          await db.insert(pages).values({
            type: p.type,
            title: p.title,
            slug: p.slug,
            content: p.content,
            metaTitle: p.metaTitle,
            metaDescription: p.metaDescription,
            keywords: p.keywords,
            metaImage: p.metaImage,
          }).onConflictDoNothing()
        }
        return await db.select().from(pages).orderBy(asc(pages.id))
      } catch {
        return DEFAULT_SYSTEM_PAGES
      }
    }
    return list
  } catch (error) {
    console.error("DB getAllPages fallback:", error)
    return DEFAULT_SYSTEM_PAGES
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug))
    if (page) return page
    return DEFAULT_SYSTEM_PAGES.find((p) => p.slug === slug) || null
  } catch (error) {
    console.error("DB getPageBySlug fallback:", error)
    return DEFAULT_SYSTEM_PAGES.find((p) => p.slug === slug) || null
  }
}

export async function createCustomPage(data: {
  title: string
  slug: string
  content: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  metaImage?: string
}): Promise<Page> {
  const cleanSlug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-")
  const [created] = await db
    .insert(pages)
    .values({
      type: "custom_page",
      title: data.title,
      slug: cleanSlug,
      content: data.content,
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || "",
      keywords: data.keywords || "",
      metaImage: data.metaImage || null,
    })
    .returning()
  return created
}

export async function updateCustomPage(
  id: number,
  data: {
    title: string
    slug: string
    content: string
    metaTitle?: string
    metaDescription?: string
    keywords?: string
    metaImage?: string
  }
): Promise<Page | null> {
  const cleanSlug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-")
  const [updated] = await db
    .update(pages)
    .set({
      title: data.title,
      slug: cleanSlug,
      content: data.content,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      keywords: data.keywords,
      metaImage: data.metaImage,
      updatedAt: new Date(),
    })
    .where(eq(pages.id, id))
    .returning()
  return updated || null
}

export async function deleteCustomPage(id: number): Promise<boolean> {
  try {
    const [page] = await db.select().from(pages).where(eq(pages.id, id))
    if (!page || page.type !== "custom_page") {
      return false // Don't delete system default pages
    }
    await db.delete(pages).where(eq(pages.id, id))
    return true
  } catch (error) {
    console.error("Error deleting page:", error)
    return false
  }
}
