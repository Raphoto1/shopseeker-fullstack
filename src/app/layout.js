// Imports de app
import "./globals.css";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Imports propios
import Navbar from "@/components/navbar/Navbar";
import { SpeedInsights } from '@vercel/speed-insights/next';
import GoogleAnalytics from "./GoogleAnalytics";
import { Providers } from "./Providers";
import { CartProvider } from "@/context/cartContext";

// Cargar componentes de manera diferida
const Footer = dynamic(() => import("@/components/footer/Footer"), {
  ssr: true,
  loading: () => <p>Loading...</p>,
});

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://creativerafa.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Creative Rafa",
    template: "%s | Creative Rafa",
  },
  description: "Master on visual arts, multipotential developer and more",
  alternates: {
    canonical: "/",
  },
  keywords: ["creative", "design", "visual arts", "developer", "shop seeker"],
  openGraph: {
    title: "Creative Rafa",
    description: "Master on visual arts, multipotential developer and more",
    url: siteUrl,
    siteName: "Creative Rafa",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/img/icons/Icon whiteBG.png",
        width: 1200,
        height: 630,
        alt: "Creative Rafa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Rafa",
    description: "Master on visual arts, multipotential developer and more",
    images: ["/img/icons/Icon whiteBG.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' data-theme='light'>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9669110661270895"
     crossOrigin="anonymous"></script>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <Providers>
          <CartProvider>
            <Navbar />
            {children}
            <SpeedInsights />
          </CartProvider>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
