import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SocialFloating } from "@/components/social-floating";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nassifmhm302-beep.github.io/soft-paws-veterinary-platform";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "عيادة المخالب الناعمة — رعاية متكاملة لحيوانك الأليف",
    template: "%s — عيادة المخالب الناعمة",
  },
  description:
    "رعاية بيطرية متخصصة، حجز إلكتروني، ومنتجات موثوقة في مكان واحد. أطباء متخصصون وتجهيزات حديثة لصحة حيوانك الأليف.",
  openGraph: {
    title: "عيادة المخالب الناعمة",
    description: "رعاية بيطرية متخصصة، حجز إلكتروني، ومنتجات موثوقة في مكان واحد.",
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexArabic.variable}>
      <body className="bg-cream text-dark antialiased">
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <SocialFloating />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
