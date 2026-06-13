import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import {
  Bebas_Neue,
  Barlow_Condensed,
  DM_Sans,
} from "next/font/google";
import { CurrencyProvider } from "@/components/CurrencyProvider";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    siteName: "Rapid Tal",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rapid Tal",
  url: "https://rapidtal.com",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+61488845951",
    contactType: "sales",
    areaServed: "AU",
    availableLanguage: "English",
  },
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <div
        className={`${bebasNeue.variable} ${barlowCondensed.variable} ${dmSans.variable}`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <CurrencyProvider>{children}</CurrencyProvider>
      </div>
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '302035997487167');
        fbq('track', 'PageView');
      `}</Script>
    </>
  );
}
