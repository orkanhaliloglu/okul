import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

import { GoogleAnalytics } from '@next/third-parties/google';
import { StudentBackground } from "@/components/student-background";

export const metadata: Metadata = {
  title: {
    default: "Okul Bul - En Doğru Okulu Keşfet",
    template: "%s | Okul Bul"
  },
  description: "LGS ve YKS puanına göre lise ve üniversite arama motoru. Puan hesaplama, okul karşılaştırma ve detaylı filtreleme özellikleri.",
  keywords: ["lise bul", "üniversite bul", "lgs puan hesaplama", "yks tercih", "okul arama"],
  authors: [{ name: "Orkan Haliloglu" }],
  creator: "Orkan Haliloglu",
  metadataBase: new URL("https://okul-bul.vercel.app"), // Placeholder domain, change when live
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://okul-bul.vercel.app",
    title: "Okul Bul - Geleceğini Şansa Bırakma",
    description: "Sana en uygun lise veya üniversiteyi saniyeler içinde bul.",
    siteName: "Okul Bul",
  },
  twitter: {
    card: "summary_large_image",
    title: "Okul Bul",
    description: "En doğru okulu keşfet.",
    creator: "@urkanhaliloglu",
  },
  robots: {
    index: true,
    follow: true,
  }
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
        <Header />
        {children}
        <GoogleAnalytics gaId="G-9NVZP6QKWH" />
      </body>
    </html>
  );
}
