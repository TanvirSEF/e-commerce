import { db } from "../db"
import { languages, translations, type Language, type Translation } from "../db/schema"
import { eq, and, like, or } from "drizzle-orm"

export const SEED_LANGUAGES: Language[] = [
  {
    id: 1,
    name: "English",
    code: "en",
    appLangCode: "en",
    rtl: false,
    status: true,
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Bangla",
    code: "bn",
    appLangCode: "bn",
    rtl: false,
    status: true,
    isDefault: false,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Arabic",
    code: "ar",
    appLangCode: "ar",
    rtl: true,
    status: true,
    isDefault: false,
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Spanish",
    code: "es",
    appLangCode: "es",
    rtl: false,
    status: true,
    isDefault: false,
    createdAt: new Date(),
  },
  {
    id: 5,
    name: "French",
    code: "fr",
    appLangCode: "fr",
    rtl: false,
    status: true,
    isDefault: false,
    createdAt: new Date(),
  },
]

export const SEED_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    "All Products": "All Products",
    "Add to Cart": "Add to Cart",
    "Buy Now": "Buy Now",
    "Dashboard": "Dashboard",
    "Cart": "Cart",
    "Checkout": "Checkout",
    "Track Order": "Track Order",
    "Wishlist": "Wishlist",
    "Compare": "Compare",
    "Flash Deals": "Flash Deals",
    "Categories": "Categories",
    "Brands": "Brands",
    "Today's Deal": "Today's Deal",
    "Subtotal": "Subtotal",
    "Shipping": "Shipping",
    "Tax": "Tax",
    "Total": "Total",
    "Apply Coupon": "Apply Coupon",
    "Login": "Login",
    "Register": "Register",
    "Logout": "Logout",
    "Order Confirmed": "Order Confirmed",
    "Continue Shopping": "Continue Shopping",
    "Customer Support": "Customer Support",
    "In-House Products": "In-House Products",
  },
  bn: {
    "All Products": "সব পণ্য",
    "Add to Cart": "কার্টে যোগ করুন",
    "Buy Now": "এখনই কিনুন",
    "Dashboard": "ড্যাশবোর্ড",
    "Cart": "কার্ট",
    "Checkout": "চেকআউট",
    "Track Order": "অর্ডার ট্র্যাক করুন",
    "Wishlist": "পছন্দের তালিকা",
    "Compare": "তুলনা করুন",
    "Flash Deals": "ফ্ল্যাশ ডিল",
    "Categories": "ক্যাটাগরি সমূহ",
    "Brands": "ব্র্যান্ড সমূহ",
    "Today's Deal": "আজকের সেরা অফার",
    "Subtotal": "উপমোট",
    "Shipping": "শিপিং খরচ",
    "Tax": "ভ্যাট/ট্যাক্স",
    "Total": "সর্বমোট",
    "Apply Coupon": "কুপন প্রয়োগ করুন",
    "Login": "লগইন",
    "Register": "নিবন্ধন করুন",
    "Logout": "লগআউট",
    "Order Confirmed": "অর্ডার নিশ্চিত হয়েছে",
    "Continue Shopping": "কেনাকাটা চালিয়ে যান",
    "Customer Support": "গ্রাহক সেবা",
    "In-House Products": "ইন-হাউস পণ্য",
  },
  ar: {
    "All Products": "جميع المنتجات",
    "Add to Cart": "أضف إلى السلة",
    "Buy Now": "اشتري الآن",
    "Dashboard": "لوحة التحكم",
    "Cart": "سلة التسوق",
    "Checkout": "الدفع",
    "Track Order": "تتبع الطلب",
    "Wishlist": "قائمة الرغبات",
    "Compare": "مقارنة",
    "Flash Deals": "عروض مذهلة",
    "Categories": "التصنيفات",
    "Brands": "العلامات التجارية",
    "Today's Deal": "صفقة اليوم",
    "Subtotal": "المجموع الفرعي",
    "Shipping": "الشحن",
    "Tax": "الضريبة",
    "Total": "الإجمالي",
    "Apply Coupon": "تطبيق القسيمة",
    "Login": "تسجيل الدخول",
    "Register": "إنشاء حساب",
    "Logout": "تسجيل الخروج",
    "Order Confirmed": "تم تأكيد الطلب",
    "Continue Shopping": "مواصلة التسوق",
    "Customer Support": "خدمة العملاء",
    "In-House Products": "منتجات المتجر",
  },
}

let inMemoryLanguages: Language[] = [...SEED_LANGUAGES]
let inMemoryTranslations: Record<string, Record<string, string>> = { ...SEED_TRANSLATIONS }

export async function getAllLanguages(): Promise<Language[]> {
  try {
    const rows = await db.select().from(languages).orderBy(languages.id)
    if (rows && rows.length > 0) return rows
  } catch (err) {
    console.warn("getAllLanguages DB fallback:", (err as Error).message)
  }
  return inMemoryLanguages
}

export async function getLanguageById(id: number): Promise<Language | null> {
  try {
    const [row] = await db.select().from(languages).where(eq(languages.id, id)).limit(1)
    if (row) return row
  } catch (err) {
    console.warn("getLanguageById DB fallback:", (err as Error).message)
  }
  return inMemoryLanguages.find((l) => l.id === id) || null
}

export async function createLanguage(data: {
  name: string
  code: string
  appLangCode?: string
}): Promise<Language> {
  const newLang: Language = {
    id: inMemoryLanguages.length + 1,
    name: data.name,
    code: data.code.toLowerCase(),
    appLangCode: data.appLangCode || data.code.toLowerCase(),
    rtl: false,
    status: true,
    isDefault: false,
    createdAt: new Date(),
  }
  try {
    const [inserted] = await db.insert(languages).values(newLang).returning()
    if (inserted) return inserted
  } catch (err) {
    console.warn("createLanguage DB fallback:", (err as Error).message)
  }
  inMemoryLanguages.push(newLang)
  return newLang
}

export async function updateLanguage(
  id: number,
  data: Partial<Pick<Language, "name" | "code" | "appLangCode">>
): Promise<boolean> {
  try {
    await db.update(languages).set(data).where(eq(languages.id, id))
    return true
  } catch (err) {
    console.warn("updateLanguage DB fallback:", (err as Error).message)
  }
  inMemoryLanguages = inMemoryLanguages.map((l) => (l.id === id ? { ...l, ...data } : l))
  return true
}

export async function toggleLanguageStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await db.update(languages).set({ status }).where(eq(languages.id, id))
    return true
  } catch (err) {
    console.warn("toggleLanguageStatus DB fallback:", (err as Error).message)
  }
  inMemoryLanguages = inMemoryLanguages.map((l) => (l.id === id ? { ...l, status } : l))
  return true
}

export async function toggleLanguageRtl(id: number, rtl: boolean): Promise<boolean> {
  try {
    await db.update(languages).set({ rtl }).where(eq(languages.id, id))
    return true
  } catch (err) {
    console.warn("toggleLanguageRtl DB fallback:", (err as Error).message)
  }
  inMemoryLanguages = inMemoryLanguages.map((l) => (l.id === id ? { ...l, rtl } : l))
  return true
}

export async function setDefaultLanguage(id: number): Promise<boolean> {
  try {
    await db.update(languages).set({ isDefault: false })
    await db.update(languages).set({ isDefault: true }).where(eq(languages.id, id))
    return true
  } catch (err) {
    console.warn("setDefaultLanguage DB fallback:", (err as Error).message)
  }
  inMemoryLanguages = inMemoryLanguages.map((l) => ({ ...l, isDefault: l.id === id }))
  return true
}

export async function getTranslationsForLanguage(
  langCode: string,
  search?: string
): Promise<{ key: string; value: string }[]> {
  try {
    const rows = await db
      .select()
      .from(translations)
      .where(eq(translations.lang, langCode))
    if (rows && rows.length > 0) {
      let list = rows.map((r) => ({ key: r.langKey, value: r.langValue }))
      if (search) {
        const q = search.toLowerCase()
        list = list.filter((item) => item.key.toLowerCase().includes(q) || item.value.toLowerCase().includes(q))
      }
      return list
    }
  } catch (err) {
    console.warn("getTranslationsForLanguage DB fallback:", (err as Error).message)
  }

  // Fallback to in-memory/seed
  const baseKeys = Object.keys(SEED_TRANSLATIONS.en || {})
  const targetMap = inMemoryTranslations[langCode] || {}

  let results = baseKeys.map((key) => ({
    key,
    value: targetMap[key] || "",
  }))

  if (search) {
    const q = search.toLowerCase()
    results = results.filter((item) => item.key.toLowerCase().includes(q) || item.value.toLowerCase().includes(q))
  }
  return results
}

export async function saveTranslationsForLanguage(
  langCode: string,
  values: Record<string, string>
): Promise<boolean> {
  try {
    for (const [key, val] of Object.entries(values)) {
      const [existing] = await db
        .select()
        .from(translations)
        .where(and(eq(translations.lang, langCode), eq(translations.langKey, key)))
        .limit(1)

      if (existing) {
        await db
          .update(translations)
          .set({ langValue: val })
          .where(eq(translations.id, existing.id))
      } else {
        await db.insert(translations).values({
          lang: langCode,
          langKey: key,
          langValue: val,
        })
      }
    }
    return true
  } catch (err) {
    console.warn("saveTranslationsForLanguage DB fallback:", (err as Error).message)
  }

  if (!inMemoryTranslations[langCode]) {
    inMemoryTranslations[langCode] = {}
  }
  Object.assign(inMemoryTranslations[langCode], values)
  return true
}
