import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import {
  getCurrencySettings,
  getGeneralSettings,
  getChatWidgetsSettings,
  getThirdPartySettings,
  getCustomScriptsSettings,
} from "@/services/settings-service"
import { getAllLanguages, getAllTranslationsMap } from "@/services/language-service"
import { getAppearanceSettings } from "@/services/appearance-service"
import { CartProvider } from "@/lib/context/cart-context"
import { AuthProvider } from "@/lib/context/auth-context"
import { LanguageProvider } from "@/lib/context/language-context"
import { CurrencyProvider } from "@/lib/context/currency-context"
import { StorefrontChrome } from "@/components/layout/storefront-chrome"
import { ThirdPartyScripts } from "@/components/layout/third-party-scripts"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export async function generateMetadata(): Promise<Metadata> {
  const general = await getGeneralSettings().catch(() => null)
  const systemName = general?.systemName || "Active eCommerce"
  const motto = general?.systemMotto || "Complete Shopping Solution"
  const icon = general?.systemIcon || "/assets/img/logo.png"

  return {
    title: {
      default: `${systemName} | ${motto}`,
      template: `%s | ${systemName}`,
    },
    description: motto,
    icons: {
      icon,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [
    currencySettings,
    allLanguages,
    translationsMap,
    appearanceSettings,
    generalSettings,
    chatWidgetsSettings,
    thirdPartySettings,
    customScriptsSettings,
  ] = await Promise.all([
    getCurrencySettings().catch(() => null),
    getAllLanguages().catch(() => []),
    getAllTranslationsMap().catch(() => ({})),
    getAppearanceSettings().catch(() => null),
    getGeneralSettings().catch(() => null),
    getChatWidgetsSettings().catch(() => null),
    getThirdPartySettings().catch(() => null),
    getCustomScriptsSettings().catch(() => null),
  ])

  // Filter only active currencies & active languages configured by admin
  const activeCurrencies = (currencySettings?.currencies || []).filter((c) => c.status !== false)
  const activeLanguages = (allLanguages || []).filter((l) => l.status !== false)
  const defaultLanguage = allLanguages?.find((l) => l.isDefault)?.code || "en"

  return (
    <html
      lang="en"
      className={cn("antialiased", inter.variable, fontMono.variable, "font-sans")}
    >
      <body className="flex min-h-screen flex-col bg-white text-[#292933]">
        <AuthProvider>
          <LanguageProvider
            initialLanguages={activeLanguages.length > 0 ? activeLanguages : undefined}
            initialDefaultCode={defaultLanguage}
            customTranslations={translationsMap}
          >
            <CurrencyProvider
              initialCurrencies={activeCurrencies.length > 0 ? activeCurrencies : undefined}
              defaultCurrencyCode={currencySettings?.defaultCurrencyCode}
              symbolFormat={currencySettings?.symbolFormat}
              decimalSeparator={currencySettings?.decimalSeparator}
              numberOfDecimals={currencySettings?.numberOfDecimals}
            >
              <CartProvider>
                <StorefrontChrome
                  showLanguageSwitcher={appearanceSettings?.showLanguageSwitcher ?? true}
                  showCurrencySwitcher={appearanceSettings?.showCurrencySwitcher ?? true}
                  generalSettings={generalSettings}
                  chatWidgetsSettings={chatWidgetsSettings}
                >
                  {children}
                </StorefrontChrome>
              </CartProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </AuthProvider>
        <ThirdPartyScripts
          thirdParty={thirdPartySettings}
          customScripts={customScriptsSettings}
        />
      </body>
    </html>
  )
}
