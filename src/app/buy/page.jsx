import React from 'react'
import ContactForm from "@/components/contact/ContactForm";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function BuyPage() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-8">Purchase Information</h1>
      <div className="max-w-2xl bg-base-200 p-8 rounded-2xl shadow-xl">
        <p className="text-lg mb-6">
          If you have any questions regarding your purchase or want to get in touch, 
          you can reach out to me through the following channels:
        </p>
        
        <div className="space-y-4 text-left inline-block">
          <div className="flex items-center gap-3">
            <span className="font-bold">Email:</span>
            <a href="mailto:info@creativerafa.com" className="text-primary hover:underline">info@creativerafa.com</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold">Contact Form:</span>
            <div className="flex items-center gap-2">
              <ContactForm />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold">Social Media:</span>
            <div className="flex items-center gap-4">
              <a href='#' className='hover:text-primary transition-colors'><FaInstagram size={20} /></a>
              <a href='#' className='hover:text-primary transition-colors'><FaTwitter size={20} /></a>
              <a href='#' className='hover:text-primary transition-colors'><FaLinkedin size={20} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
