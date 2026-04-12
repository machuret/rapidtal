import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from 'next/script';
import "./globals.css";

export const metadata: Metadata = {
  title: "Rapid Tal — Elite Filipino Marketing & Sales Talent",
  description: "Hire elite Filipino marketing and sales talent directly. No agency markup. No middlemen. 18-day average placement with a 6-month guarantee.",
  metadataBase: new URL("https://rapidtal.com"),
  alternates: { canonical: "/" },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: "Rapid Tal — Elite Filipino Marketing & Sales Talent",
    description: "The top Filipino marketing and sales talent is sharper, hungrier, and half the cost. We find them. You hire them directly.",
    type: "website",
    url: "https://rapidtal.com",
    siteName: "Rapid Tal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rapid Tal — Elite Filipino Marketing & Sales Talent",
    description: "Elite Filipino marketing & sales talent. Direct hire. 18-day placement. 6-month guarantee.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Rapid Tal',
  url: 'https://rapidtal.com',
  logo: 'https://rapidtal.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+61488845951',
    contactType: 'sales',
    areaServed: 'AU',
    availableLanguage: 'English',
  },
  sameAs: [],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap"
            rel="stylesheet"
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
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
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{display: 'none'}} 
            src="https://www.facebook.com/tr?id=302035997487167&ev=PageView&noscript=1" 
          />
        </noscript>
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
