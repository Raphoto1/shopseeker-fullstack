
//imports de app
import './globals.css'
import 'react-toastify/dist/ReactToastify.css';
import { Inter } from 'next/font/google'
//imports propios
import Navbar from '@/components/navbar/Navbar'
import { ToastContainer } from 'react-toastify'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Shop Seeker',
  description: 'Shop seeker for print on demand creators',
}


export default function RootLayout({ children }) {

  return (

    <html lang="en">

        <Navbar/>


      <body className={inter.className}>
        {children}
      </body>
        <ToastContainer/>
      
        </html>

  )
}
