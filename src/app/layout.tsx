import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

import { GoogleAnalytics } from '@next/third-parties/google';
import { ReviewsSection } from "@/components/reviews-section";

export const metadata: Metadata = {
  title: {
    default: "Okul Bul - LGS & YKS Tercih Robotu 2025 | Lise ve Üniversite Taban Puanları",
    template: "%s | Okul Bul - Tercih Robotu"
  },
  description: "2025 LGS ve YKS (TYT-AYT) puanına göre en doğru lise ve üniversiteyi bulun. MEB ve YÖK Atlas verileriyle güncel taban puanlar, yüzdelik dilimler ve başarı sıralamaları Okul Bul'da.",
  keywords: [
    "okul bul", "okul tercihi", "tercih robotu", "lise taban puanları 2025", "üniversite taban puanları 2025",
    "lgs tercih robotu", "yks tercih robotu", "yök atlas tercih", "meb lise puanları",
    "lise yüzdelik dilimleri", "üniversite sıralamaları", "tyt ayt puan hesaplama"
  ],
  authors: [{ name: "Orkan Haliloglu" }],
  creator: "Orkan Haliloglu",
  metadataBase: new URL("https://okultercihi.site"),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://okultercihi.site",
    title: "Okul Bul - LGS & YKS Tercih Robotu",
    description: "Sana en uygun lise veya üniversiteyi saniyeler içinde keşfet. 2025 güncel verilerle tercih yap.",
    siteName: "Okul Bul",
  },
  twitter: {
    card: "summary_large_image",
    title: "Okul Bul - Tercih Robotu",
    description: "En doğru okulu keşfet. LGS ve YKS tercih rehberi.",
    creator: "@urkanhaliloglu",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "73hqcYJ7V6f05F1tKZlPoujgZJZNPvtPTftFxzLcTAU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Header />
        {children}
        <ReviewsSection />
        <GoogleAnalytics gaId="G-9NVZP6QKWH" />
      </body>
    </html>
  );
}
