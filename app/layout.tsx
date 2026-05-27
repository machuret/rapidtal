import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CurrencyProvider } from "@/components/CurrencyProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Rapid Tile Portal",
  description: "Multi-tenant SaaS portal for managing client knowledge bases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
