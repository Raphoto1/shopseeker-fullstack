// Imports de app
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

// Imports propios
import Navbar from "@/components/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import { SpeedInsights } from '@vercel/speed-insights/next';
import GoogleAnalytics from "./GoogleAnalytics";
import { Providers } from "./Providers";
import { CartProvider } from "@/context/cartContext";

// Cargar componentes de manera diferida
const Footer = dynamic(() => import("@/components/footer/Footer"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shop Seeker",
  description: "Shop seeker for print on demand creators",
  openGraph: {
    title: "Creative Rafa Shop Seeker",
    description: "Shop seeker for print on demand creators",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <GoogleAnalytics />
        <Providers>
          <CartProvider>
            <Navbar />
            {children}
            <SpeedInsights />
          </CartProvider>
        </Providers>
        <ToastContainer />
        <Footer />
      </body>
    </html>
  );
}
