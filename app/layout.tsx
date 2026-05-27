import type { Metadata } from "next";
import {
  Inter,
  Bebas_Neue,
  Barlow_Condensed,
  Space_Grotesk,
  DM_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CurrencyProvider } from "@/components/CurrencyProvider";

// ── Portal body font ──────────────────────────────────────────────────────────
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

// ── Marketing display fonts ───────────────────────────────────────────────────
// Loaded via next/font so they're preloaded as <link> tags (non-blocking),
// replacing the render-blocking @import url(googleapis) in page CSS files.
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--ds-font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--ds-font",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rapid Tal Portal",
  description: "Multi-tenant SaaS portal for managing client knowledge bases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    inter.variable,
    bebasNeue.variable,
    barlowCondensed.variable,
    spaceGrotesk.variable,
    dmSans.variable,
    jetbrainsMono.variable,
  ].join(" ");

  return (
    <html lang="en" className={fontVars}>
      <body className="font-sans">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
