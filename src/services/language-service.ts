import fs from "node:fs"
import path from "node:path"
import { db } from "../db"
import { languages, translations, type Language, type Translation } from "../db/schema"
import { eq, and } from "drizzle-orm"

const LANGS_CACHE_FILE = path.join(process.cwd(), "src", "db", "languages_cache.json")
const TRANS_CACHE_FILE = path.join(process.cwd(), "src", "db", "translations_cache.json")

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
    "Become a Seller !": "Become a Seller !",
    "Login to Seller": "Login to Seller",
    "Apply Now": "Apply Now",
    "Helpline:": "Helpline:",
    "I am shopping for...": "I am shopping for...",
    "Search in active eCommerce...": "Search in active eCommerce...",
    "Home": "Home",
    "All Categories": "All Categories",
    "All Brands": "All Brands",
    "All Sellers": "All Sellers",
    "Coupons": "Coupons",
    "Blogs": "Blogs",
    "Shopping Cart": "Shopping Cart",
    "View Cart": "View Cart",
    "Your Cart is Empty": "Your Cart is Empty",
    "Unit Price": "Unit Price",
    "Quantity": "Quantity",
    "Price": "Price",
    "Welcome,": "Welcome,",
    "Login / Register": "Login / Register",
    "My Account": "My Account",
    "Purchase History": "Purchase History",
    "Sent Refund Request": "Sent Refund Request",
    "Notifications": "Notifications",
    "Classified Ads": "Classified Ads",
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
    "Compare": "তুলনা",
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
    "Become a Seller !": "সেলার হোন !",
    "Login to Seller": "সেলার লগইন",
    "Apply Now": "আবেদন করুন",
    "Helpline:": "হেল্পলাইন:",
    "I am shopping for...": "আমি খুঁজছি...",
    "Search in active eCommerce...": "এক্টিভ ই-কমার্সে খুঁজুন...",
    "Home": "হোম",
    "All Categories": "সব ক্যাটাগরি",
    "All Brands": "সব ব্র্যান্ড",
    "All Sellers": "সব বিক্রেতা",
    "Coupons": "কুপন",
    "Blogs": "ব্লগ",
    "Shopping Cart": "শপিং কার্ট",
    "View Cart": "কার্ট দেখুন",
    "Your Cart is Empty": "আপনার কার্ট খালি",
    "Unit Price": "একক মূল্য",
    "Quantity": "পরিমাণ",
    "Price": "মূল্য",
    "Welcome,": "স্বাগতম,",
    "Login / Register": "লগইন / নিবন্ধন",
    "My Account": "আমার অ্যাকাউন্ট",
    "Purchase History": "ক্রয় ইতিহাস",
    "Sent Refund Request": "রিফান্ড অনুরোধ",
    "Notifications": "বিজ্ঞপ্তি",
    "Classified Ads": "শ্রেণীবদ্ধ বিজ্ঞাপন",
  },
  ar: {
    "All Products": "جميع المنتجات",
    "Add to Cart": "أضف إلى السلة",
    "Buy Now": "اشتري الآن",
    "Dashboard": "لوحة التحكم",
    "Cart": "سلة التسوق",
    "Checkout": "الدفع",
    "Track Order": "تتبع الطلب",
    "Wishlist": "المفضلة",
    "Compare": "المقارنة",
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
    "Become a Seller !": "كن بائعاً !",
    "Login to Seller": "تسجيل دخول البائع",
    "Apply Now": "قدم الآن",
    "Helpline:": "خط المساعدة:",
    "I am shopping for...": "أنا أبحث عن...",
    "Search in active eCommerce...": "البحث في المتجر...",
    "Home": "الرئيسية",
    "All Categories": "جميع التصنيفات",
    "All Brands": "جميع العلامات",
    "All Sellers": "جميع البائعين",
    "Coupons": "القسائم",
    "Blogs": "المدونات",
    "Shopping Cart": "سلة التسوق",
    "View Cart": "عرض السلة",
    "Your Cart is Empty": "سلتك فارغة",
    "Unit Price": "سعر الوحدة",
    "Quantity": "الكمية",
    "Price": "السعر",
    "Welcome,": "مرحباً،",
    "Login / Register": "تسجيل الدخول / إنشاء حساب",
    "My Account": "حسابي",
    "Purchase History": "سجل المشتريات",
    "Sent Refund Request": "طلب استرداد",
    "Notifications": "الإشعارات",
    "Classified Ads": "الإعلانات المبوبة",
  },
}

let inMemoryLanguages: Language[] | null = null
let lastLangsMtime = 0

function loadLanguagesCache(): Language[] {
  try {
    if (fs.existsSync(LANGS_CACHE_FILE)) {
      const stat = fs.statSync(LANGS_CACHE_FILE)
      if (inMemoryLanguages === null || stat.mtimeMs > lastLangsMtime) {
        const data = fs.readFileSync(LANGS_CACHE_FILE, "utf-8")
        inMemoryLanguages = JSON.parse(data)
        lastLangsMtime = stat.mtimeMs
      }
      return inMemoryLanguages!
    }
  } catch (err) {
    console.warn("Failed to read languages cache file:", (err as Error).message)
  }
  if (!inMemoryLanguages) {
    inMemoryLanguages = [...SEED_LANGUAGES]
  }
  return inMemoryLanguages
}

function saveLanguagesCache(langs: Language[]) {
  inMemoryLanguages = langs
  try {
    const dir = path.dirname(LANGS_CACHE_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(LANGS_CACHE_FILE, JSON.stringify(langs, null, 2), "utf-8")
    const stat = fs.statSync(LANGS_CACHE_FILE)
    lastLangsMtime = stat.mtimeMs
  } catch (err) {
    console.warn("Failed to write languages cache file:", (err as Error).message)
  }
}

let inMemoryTranslations: Record<string, Record<string, string>> | null = null
let lastTransMtime = 0

function loadTranslationsCache(): Record<string, Record<string, string>> {
  try {
    if (fs.existsSync(TRANS_CACHE_FILE)) {
      const stat = fs.statSync(TRANS_CACHE_FILE)
      if (inMemoryTranslations === null || stat.mtimeMs > lastTransMtime) {
        const data = fs.readFileSync(TRANS_CACHE_FILE, "utf-8")
        inMemoryTranslations = JSON.parse(data)
        lastTransMtime = stat.mtimeMs
      }
      return inMemoryTranslations!
    }
  } catch (err) {
    console.warn("Failed to read translations cache file:", (err as Error).message)
  }
  if (!inMemoryTranslations) {
    inMemoryTranslations = { ...SEED_TRANSLATIONS }
  }
  return inMemoryTranslations
}

function saveTranslationsCache(trans: Record<string, Record<string, string>>) {
  inMemoryTranslations = trans
  try {
    const dir = path.dirname(TRANS_CACHE_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(TRANS_CACHE_FILE, JSON.stringify(trans, null, 2), "utf-8")
    const stat = fs.statSync(TRANS_CACHE_FILE)
    lastTransMtime = stat.mtimeMs
  } catch (err) {
    console.warn("Failed to write translations cache file:", (err as Error).message)
  }
}

export async function getAllLanguages(): Promise<Language[]> {
  try {
    const rows = await db.select().from(languages).orderBy(languages.id)
    if (rows && rows.length > 0) {
      saveLanguagesCache(rows)
      return rows
    }
  } catch {
    // Database connection fallback
  }
  return loadLanguagesCache()
}

export async function getLanguageById(id: number): Promise<Language | null> {
  try {
    const [row] = await db.select().from(languages).where(eq(languages.id, id)).limit(1)
    if (row) return row
  } catch {
    // Database connection fallback
  }
  const cached = loadLanguagesCache()
  return cached.find((l) => l.id === id) || null
}

export async function createLanguage(data: {
  name: string
  code: string
  appLangCode?: string
}): Promise<Language> {
  const currentLangs = loadLanguagesCache()
  const newLang: Language = {
    id: currentLangs.length > 0 ? Math.max(...currentLangs.map((l) => l.id)) + 1 : 1,
    name: data.name,
    code: data.code.toLowerCase(),
    appLangCode: data.appLangCode || data.code.toLowerCase(),
    rtl: false,
    status: true,
    isDefault: false,
    createdAt: new Date(),
  }
  currentLangs.push(newLang)
  saveLanguagesCache(currentLangs)

  try {
    const [inserted] = await db.insert(languages).values(newLang).returning()
    if (inserted) return inserted
  } catch (err) {
    console.warn("createLanguage DB fallback:", (err as Error).message)
  }
  return newLang
}

export async function updateLanguage(
  id: number,
  data: Partial<Pick<Language, "name" | "code" | "appLangCode">>
): Promise<boolean> {
  const currentLangs = loadLanguagesCache().map((l) => (l.id === id ? { ...l, ...data } : l))
  saveLanguagesCache(currentLangs)

  try {
    await db.update(languages).set(data).where(eq(languages.id, id))
    return true
  } catch (err) {
    console.warn("updateLanguage DB fallback:", (err as Error).message)
  }
  return true
}

export async function toggleLanguageStatus(id: number, status: boolean): Promise<boolean> {
  const currentLangs = loadLanguagesCache().map((l) => (l.id === id ? { ...l, status } : l))
  saveLanguagesCache(currentLangs)

  try {
    await db.update(languages).set({ status }).where(eq(languages.id, id))
    return true
  } catch (err) {
    console.warn("toggleLanguageStatus DB fallback:", (err as Error).message)
  }
  return true
}

export async function toggleLanguageRtl(id: number, rtl: boolean): Promise<boolean> {
  const currentLangs = loadLanguagesCache().map((l) => (l.id === id ? { ...l, rtl } : l))
  saveLanguagesCache(currentLangs)

  try {
    await db.update(languages).set({ rtl }).where(eq(languages.id, id))
    return true
  } catch (err) {
    console.warn("toggleLanguageRtl DB fallback:", (err as Error).message)
  }
  return true
}

export async function setDefaultLanguage(id: number): Promise<boolean> {
  let defaultCode = "en"
  const currentLangs = loadLanguagesCache().map((l) => {
    if (l.id === id) {
      defaultCode = l.code
      return { ...l, isDefault: true }
    }
    return { ...l, isDefault: false }
  })
  saveLanguagesCache(currentLangs)

  try {
    await db.update(languages).set({ isDefault: false })
    await db.update(languages).set({ isDefault: true }).where(eq(languages.id, id))
  } catch (err) {
    console.warn("setDefaultLanguage DB fallback:", (err as Error).message)
  }

  // Sync to general_settings and business_settings site language
  try {
    const { updateGeneralSettings } = await import("./settings-service")
    await updateGeneralSettings({ systemLanguage: defaultCode })
  } catch {}

  return true
}

export async function deleteLanguage(id: number): Promise<boolean> {
  const lang = await getLanguageById(id)
  if (!lang || lang.isDefault || lang.code === "en") {
    return false // Cannot delete default or base English language
  }

  const currentLangs = loadLanguagesCache().filter((l) => l.id !== id)
  saveLanguagesCache(currentLangs)

  const currentTrans = loadTranslationsCache()
  delete currentTrans[lang.code]
  saveTranslationsCache(currentTrans)

  try {
    await db.delete(translations).where(eq(translations.lang, lang.code))
    await db.delete(languages).where(eq(languages.id, id))
  } catch (err) {
    console.warn("deleteLanguage DB fallback:", (err as Error).message)
  }
  return true
}

export async function getTranslationsForLanguage(
  langCode: string,
  search?: string
): Promise<{ key: string; value: string }[]> {
  const baseKeys = Object.keys(SEED_TRANSLATIONS.en || {})
  const cachedTrans = loadTranslationsCache()[langCode] || SEED_TRANSLATIONS[langCode] || {}
  const rowMap: Record<string, string> = { ...cachedTrans }

  try {
    const rows = await db
      .select()
      .from(translations)
      .where(eq(translations.lang, langCode))
    if (rows && rows.length > 0) {
      for (const r of rows) {
        rowMap[r.langKey] = r.langValue
      }
    }
  } catch (err) {
    console.warn("getTranslationsForLanguage DB fallback:", (err as Error).message)
  }

  let results = baseKeys.map((key) => ({
    key,
    value: rowMap[key] ?? "",
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
  const currentTrans = loadTranslationsCache()
  if (!currentTrans[langCode]) {
    currentTrans[langCode] = {}
  }
  Object.assign(currentTrans[langCode], values)
  saveTranslationsCache(currentTrans)

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
    return true
  }
}

export async function getAllTranslationsMap(): Promise<Record<string, Record<string, string>>> {
  const result: Record<string, Record<string, string>> = {}
  // Seed fallback first
  for (const [lang, map] of Object.entries(SEED_TRANSLATIONS)) {
    result[lang] = { ...map }
  }
  // File cache updates
  const fileCache = loadTranslationsCache()
  for (const [lang, map] of Object.entries(fileCache)) {
    if (!result[lang]) result[lang] = {}
    Object.assign(result[lang], map)
  }
  // DB rows updates
  try {
    const rows = await db.select().from(translations)
    if (rows && rows.length > 0) {
      for (const row of rows) {
        if (!result[row.lang]) {
          result[row.lang] = {}
        }
        if (row.langKey && row.langValue) {
          result[row.lang][row.langKey] = row.langValue
        }
      }
    }
  } catch (err) {
    console.warn("getAllTranslationsMap DB fallback:", (err as Error).message)
  }
  return result
}
