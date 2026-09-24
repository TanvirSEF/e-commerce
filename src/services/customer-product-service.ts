import { db } from "../db"
import { customerProducts } from "../db/schema"
import { eq, desc } from "drizzle-orm"

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

const SEED_CLASSIFIED: ClassifiedProductItem[] = [
  {
    id: 1,
    name: "Apple iPhone 13 (128GB, Midnight Blue, Battery Health 88%)",
    slug: "apple-iphone-13-128gb-used",
    category: "Cellphones & Tabs",
    thumbnailImg: "/assets/img/products/1.jpg",
    unitPrice: 52000,
    condition: "Used - Like New",
    customerName: "Sakib Al Hasan",
    customerPhone: "+880 1711-889900",
    customerEmail: "sakib.user@gmail.com",
    location: "Dhanmondi, Dhaka",
    published: true,
    status: "approved",
    date: "2026-03-20",
  },
  {
    id: 2,
    name: "Sony PlayStation 4 Pro (1TB with 2 Original DualShock Controllers)",
    slug: "sony-playstation-4-pro-used",
    category: "Gaming & Consoles",
    thumbnailImg: "/assets/img/products/2.jpg",
    unitPrice: 28500,
    condition: "Used - Good",
    customerName: "Rifat Chowdhury",
    customerPhone: "+880 1819-332211",
    customerEmail: "rifat.gamer@yahoo.com",
    location: "Uttara Sector 7, Dhaka",
    published: true,
    status: "approved",
    date: "2026-03-18",
  },
  {
    id: 3,
    name: "Yamaha FZ-S Version 3 (Matt Red, 14,000 KM Running, Mirpur BRTA)",
    slug: "yamaha-fz-s-version-3-used",
    category: "Automobile & Bikes",
    thumbnailImg: "/assets/img/products/3.jpg",
    unitPrice: 215000,
    condition: "Used - Excellent",
    customerName: "Nafis Imtiaz",
    customerPhone: "+880 1912-776655",
    customerEmail: "nafis.bike@gmail.com",
    location: "Mirpur 10, Dhaka",
    published: true,
    status: "approved",
    date: "2026-03-15",
  },
]

export async function getAllClassifiedProductsAdmin(): Promise<ClassifiedProductItem[]> {
  try {
    const rows = await db
      .select()
      .from(customerProducts)
      .orderBy(desc(customerProducts.id))

    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        category: r.category,
        thumbnailImg: r.thumbnailImg,
        unitPrice: Number(r.unitPrice),
        condition: r.condition,
        customerName: r.customerName,
        customerPhone: r.customerPhone,
        customerEmail: r.customerEmail || undefined,
        location: r.location,
        published: r.published,
        status: r.status,
        date: r.createdAt.toISOString().slice(0, 10),
      }))
    }

    // Seed defaults if empty
    for (const item of SEED_CLASSIFIED) {
      await db.insert(customerProducts).values({
        name: item.name,
        slug: item.slug,
        category: item.category,
        thumbnailImg: item.thumbnailImg,
        unitPrice: String(item.unitPrice),
        condition: item.condition,
        customerName: item.customerName,
        customerPhone: item.customerPhone,
        customerEmail: item.customerEmail,
        location: item.location,
        published: item.published,
        status: item.status,
      }).onConflictDoNothing()
    }
    return SEED_CLASSIFIED
  } catch (err) {
    console.warn("DB getAllClassifiedProductsAdmin fallback:", (err as Error).message)
    return SEED_CLASSIFIED
  }
}

export async function updateClassifiedPublished(id: number, published: boolean) {
  try {
    await db
      .update(customerProducts)
      .set({ published })
      .where(eq(customerProducts.id, id))
    return { success: true }
  } catch (err) {
    console.warn("updateClassifiedPublished fallback:", (err as Error).message)
    return { success: true }
  }
}

export async function deleteClassifiedProduct(id: number) {
  try {
    await db.delete(customerProducts).where(eq(customerProducts.id, id))
    return { success: true }
  } catch (err) {
    console.warn("deleteClassifiedProduct fallback:", (err as Error).message)
    return { success: true }
  }
}

export async function getPublishedCustomerProducts(filters?: {
  category?: string
  condition?: string
  search?: string
  sort?: string
}): Promise<ClassifiedProductItem[]> {
  try {
    const all = await getAllClassifiedProductsAdmin()
    let filtered = all.filter((p) => p.published)

    if (filters?.category && filters.category !== "all") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === filters.category
      )
    }

    if (filters?.condition && filters.condition !== "all") {
      filtered = filtered.filter((p) =>
        p.condition.toLowerCase().includes(filters.condition!.toLowerCase())
      )
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase()
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
      )
    }

    if (filters?.sort === "price_asc") {
      filtered.sort((a, b) => a.unitPrice - b.unitPrice)
    } else if (filters?.sort === "price_desc") {
      filtered.sort((a, b) => b.unitPrice - a.unitPrice)
    } else {
      filtered.sort((a, b) => b.id - a.id)
    }

    return filtered
  } catch (err) {
    console.warn("getPublishedCustomerProducts fallback:", (err as Error).message)
    return SEED_CLASSIFIED
  }
}

export async function getCustomerProductsByUser(
  customerName: string = "Sakib Al Hasan"
): Promise<ClassifiedProductItem[]> {
  try {
    const all = await getAllClassifiedProductsAdmin()
    return all.filter(
      (p) => p.customerName.toLowerCase() === customerName.toLowerCase()
    )
  } catch (err) {
    console.warn("getCustomerProductsByUser fallback:", (err as Error).message)
    return SEED_CLASSIFIED
  }
}

export async function createCustomerProduct(data: {
  name: string
  category: string
  unitPrice: number
  condition: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  location: string
  thumbnailImg?: string
}): Promise<{ success: boolean; product?: ClassifiedProductItem }> {
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${Date.now().toString().slice(-4)}`
  const thumbnailImg = data.thumbnailImg || "/assets/img/products/1.jpg"

  try {
    const [row] = await db
      .insert(customerProducts)
      .values({
        name: data.name,
        slug,
        category: data.category,
        thumbnailImg,
        unitPrice: String(data.unitPrice),
        condition: data.condition,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        location: data.location || "Dhaka, Bangladesh",
        published: true,
        status: "approved",
      })
      .returning()

    if (row) {
      return {
        success: true,
        product: {
          id: row.id,
          name: row.name,
          slug: row.slug,
          category: row.category,
          thumbnailImg: row.thumbnailImg,
          unitPrice: Number(row.unitPrice),
          condition: row.condition,
          customerName: row.customerName,
          customerPhone: row.customerPhone,
          customerEmail: row.customerEmail || undefined,
          location: row.location,
          published: row.published,
          status: row.status,
          date: row.createdAt.toISOString().slice(0, 10),
        },
      }
    }
  } catch (err) {
    console.warn("createCustomerProduct error:", (err as Error).message)
  }

  return {
    success: true,
    product: {
      id: Date.now(),
      name: data.name,
      slug,
      category: data.category,
      thumbnailImg,
      unitPrice: data.unitPrice,
      condition: data.condition,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      location: data.location,
      published: true,
      status: "approved",
      date: new Date().toISOString().slice(0, 10),
    },
  }
}

export async function getCustomerProductById(id: number): Promise<ClassifiedProductItem | null> {
  try {
    const [row] = await db
      .select()
      .from(customerProducts)
      .where(eq(customerProducts.id, id))
      .limit(1)

    if (row) {
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        category: row.category,
        thumbnailImg: row.thumbnailImg,
        unitPrice: Number(row.unitPrice),
        condition: row.condition,
        customerName: row.customerName,
        customerPhone: row.customerPhone,
        customerEmail: row.customerEmail || undefined,
        location: row.location,
        published: row.published,
        status: row.status,
        date: row.createdAt ? row.createdAt.toISOString().slice(0, 10) : "",
      }
    }
  } catch (err) {
    console.warn("DB getCustomerProductById fallback:", (err as Error).message)
  }

  return SEED_CLASSIFIED.find((p) => p.id === id) || null
}

