'use client'
//imports de app
import './globals.css'
import { Inter } from 'next/font/google'
//imports propios
import Navbar from '@/components/navbar/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Shop Seeker',
  description: 'Shop seeker for print on demand creators',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <Navbar/>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
