//imports de app
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Inter } from "next/font/google";
//imports propios
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { ToastContainer } from "react-toastify";
import GoogleAnalytics from "./GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shop Seeker",
  description: "Shop seeker for print on demand creators",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <GoogleAnalytics/>
        <Navbar />
        {children}
        <ToastContainer />
        <Footer/>
      </body>
    </html>
  );
}
