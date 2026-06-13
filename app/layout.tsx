import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Rapid Tal — Elite Filipino Marketing & Sales Talent",
  description: "Hire elite Filipino marketing and sales talent directly. No agency markup. No middlemen. 18-day average placement with a 6-month guarantee.",
  metadataBase: new URL("https://rapidtal.com"),
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
