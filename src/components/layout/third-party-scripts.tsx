import React from "react"
import Script from "next/script"
import type { ThirdPartySettings, CustomScriptsSettings } from "@/services/settings-service"

interface ThirdPartyScriptsProps {
  thirdParty?: ThirdPartySettings | null
  customScripts?: CustomScriptsSettings | null
}

function isRealValue(val?: string | null): boolean {
  if (!val) return false
  const trimmed = val.trim()
  if (trimmed === "") return false
  if (/^G-X+$/i.test(trimmed)) return false
  if (/^GTM-X+$/i.test(trimmed)) return false
  if (trimmed.includes("XXXX") || trimmed.includes("xxxx")) return false
  if (trimmed === "123456789012345" || trimmed === "9876543210") return false
  if (trimmed.startsWith("AIzaSyA...")) return false
  return true
}

export function ThirdPartyScripts({ thirdParty, customScripts }: ThirdPartyScriptsProps) {
  const gaId = thirdParty?.googleAnalyticsId?.trim() || customScripts?.googleAnalyticsId?.trim()
  const gtmId = thirdParty?.gtmCode?.trim() || customScripts?.googleTagManagerId?.trim()
  const fbPixelActive = thirdParty?.fbPixelActive ?? false
  const fbPixelId = thirdParty?.fbPixelId?.trim() || customScripts?.metaPixelId?.trim()
  const googleMapKey = thirdParty?.googleMapsApiKey?.trim()

  return (
    <>
      {/* 1. Google Analytics 4 (GA4) */}
      {isRealValue(gaId) && gaId!.startsWith("G-") && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId!)}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init-script" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* 2. Google Tag Manager (GTM) */}
      {isRealValue(gtmId) && gtmId!.startsWith("GTM-") && (
        <Script id="gtm-init-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      )}

      {/* 3. Facebook / Meta Pixel */}
      {fbPixelActive && isRealValue(fbPixelId) && (
        <Script id="fb-pixel-init-script" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* 4. Google Maps JavaScript SDK */}
      {isRealValue(googleMapKey) && googleMapKey!.length > 10 && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(googleMapKey!)}&libraries=places`}
          strategy="lazyOnload"
        />
      )}

      {/* 5. Custom Header Scripts (Admin configured) */}
      {customScripts?.headerScript && customScripts.headerScript.trim() !== "" && (
        <div
          id="custom-header-scripts-container"
          dangerouslySetInnerHTML={{ __html: customScripts.headerScript }}
        />
      )}

      {/* 6. Custom Footer Scripts (Admin configured) */}
      {customScripts?.footerScript && customScripts.footerScript.trim() !== "" && (
        <div
          id="custom-footer-scripts-container"
          dangerouslySetInnerHTML={{ __html: customScripts.footerScript }}
        />
      )}
    </>
  )
}
