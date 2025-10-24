// Imports de app
import "./globals.css";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

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

export const metadata = {
  title: "Shop Seeker",
  description: "Shop seeker for print on demand creators",
  openGraph: {
    title: "Creative Rafa Shop Seeker",
    description: "Shop seeker for print on demand creators",
    url:"shops.creativerafa.com",
    type: "website",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9669110661270895"
     crossorigin="anonymous"></script>
      <body className={inter.className}>
        <GoogleAnalytics />
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
