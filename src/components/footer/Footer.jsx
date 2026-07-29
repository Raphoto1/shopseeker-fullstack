import React from "react";
import Link from "next/link";
import ContactForm from "../contact/ContactForm";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='mt-10 border-t border-base-300 bg-base-100 text-base-content'>
      <div className='mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:py-16'>
        <aside>
          <p className='inline-flex rounded-full border border-primary/30 bg-base-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
            Creative Rafa
          </p>

          <h3 className='mt-5 max-w-md text-2xl font-semibold leading-tight text-base-content sm:text-3xl'>
            Design, development and digital craft in one place.
          </h3>

          <p className='mt-4 max-w-lg text-sm leading-relaxed text-base-content/70 sm:text-base'>
            ShopSeeker helps you explore creative work and connect with the project ecosystem behind every design.
          </p>

          <div className='mt-6'>
            <ContactForm />
          </div>
        </aside>

        <nav aria-label='Footer navigation'>
          <h4 className='text-sm font-semibold uppercase tracking-[0.18em] text-base-content/70'>Explore</h4>
          <ul className='mt-4 space-y-3 text-sm'>
            <li>
              <Link href='/allshops' className='text-base-content transition-colors hover:text-primary'>
                All Shops
              </Link>
            </li>
            <li>
              <Link href='/about' className='text-base-content transition-colors hover:text-primary'>
                About
              </Link>
            </li>
            <li>
              <Link href='/blog' className='text-base-content transition-colors hover:text-primary'>
                Blog
              </Link>
            </li>
            <li>
              <Link href='/dev' className='text-base-content transition-colors hover:text-primary'>
                Dev Space
              </Link>
            </li>
          </ul>
        </nav>

        <section>
          <h4 className='text-sm font-semibold uppercase tracking-[0.18em] text-base-content/70'>Contact</h4>
          <div className='mt-4 space-y-3 text-sm text-base-content/80'>
            <p>
              Open to collaborations, commissions and technical creative partnerships.
            </p>
            <a
              href='mailto:info@creativerafa.com'
              className='inline-flex items-center rounded-lg border border-base-300 bg-base-200/70 px-3 py-2 transition-colors hover:border-primary hover:text-primary'
            >
              info@creativerafa.com
            </a>
            <div className='flex items-center gap-4 pt-2'>
              <a href='#' className='hover:text-primary transition-colors'><FaInstagram size={20} /></a>
              <a href='#' className='hover:text-primary transition-colors'><FaTwitter size={20} /></a>
              <a href='#' className='hover:text-primary transition-colors'><FaLinkedin size={20} /></a>
            </div>
          </div>
        </section>
      </div>

      <div className='border-t border-base-300 px-6 py-5 text-xs text-base-content/60 sm:px-8'>
        <div className='mx-auto flex w-full max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <p>Rafael Martinez {year} - All rights reserved.</p>
          <p>Built with Next.js and Tailwind.</p>
        </div>
      </div>
    </footer>
  );
}
