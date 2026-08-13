'use client';
import React from "react";
import { pageBasePath } from "@/enums/SuperVariables";
import { useCart } from "@/context/cartContext";
import ContactForm from "../contact/ContactForm";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GiLoveLetter } from "react-icons/gi";
import { FaUser, FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

function NavbarLoader() {
  return (
    <div className='flex h-full w-full justify-center content-center'>
      <span className='loading loading-infinity loading-lg' />
    </div>
  );
}

const ThemeSelect = dynamic(() => import("../buttons/ThemeSelect"), {
  ssr: false,
  loading: () => <NavbarLoader />,
});
const FacebookShareButton = dynamic(() => import("next-share").then((mod) => mod.FacebookShareButton), {
  ssr: false,
  loading: () => <NavbarLoader />,
});
const FacebookIcon = dynamic(() => import("next-share").then((mod) => mod.FacebookIcon), {
  ssr: false,
  loading: () => <NavbarLoader />,
});
const TwitterShareButton = dynamic(() => import("next-share").then((mod) => mod.TwitterShareButton), {
  ssr: false,
  loading: () => <NavbarLoader />,
});
const TwitterIcon = dynamic(() => import("next-share").then((mod) => mod.TwitterIcon), {
  ssr: false,
  loading: () => <NavbarLoader />,
});

export default function Navbar() {
  const { data: session } = useSession();
  const { getCartInfo, cartCount } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (session?.cart) {
      getCartInfo(session.cart);
    }
  }, [getCartInfo, session?.cart]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className='navbar bg-base-100 shadow-lg sticky top-0 z-50'>
      <div className='navbar-start gap-2'>
        <div className='relative lg:hidden'>
          <button
            type='button'
            className='btn btn-ghost btn-circle'
            aria-label='Open navigation menu'
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>
          {isMobileMenuOpen ? (
            <ul className='menu menu-sm absolute left-0 top-full mt-3 w-56 rounded-box bg-base-100 p-2 shadow z-[60]'>
              <li><a href='/allshops' onClick={() => setIsMobileMenuOpen(false)}>Shop</a></li>
              <li><a href='/blog' onClick={() => setIsMobileMenuOpen(false)}>Blog</a></li>
              <li><a href='/dev' onClick={() => setIsMobileMenuOpen(false)}>Dev</a></li>
              <li><a href='/about' onClick={() => setIsMobileMenuOpen(false)}>About</a></li>
              <li className='px-2 py-1'><ContactForm /></li>
              <li className='px-2 py-1'><div className='flex items-center gap-3'><span className='font-bold'>Socials:</span><a href='#' className='hover:text-primary'><FaInstagram /></a><a href='#' className='hover:text-primary'><FaTwitter /></a><a href='#' className='hover:text-primary'><FaLinkedin /></a></div></li>
            </ul>
          ) : null}
        </div>
        <Link href={"/"} className='flex items-center gap-3'>
          <Image
            src={"/img/icons/Icon whiteBG.png"}
            width={50}
            height={50}
            alt='Icono Creative Rafa'
            className='h-auto w-auto'
            style={{ width: 'auto', height: 'auto' }}
            loading='eager'
            priority
          />
        </Link>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1 items-center gap-1'>
          <li><Link href='/allshops' className='btn btn-ghost btn-sm normal-case'>Shop</Link></li>
          <li><Link href='/blog' className='btn btn-ghost btn-sm normal-case'>Blog</Link></li>
          <li><Link href='/dev' className='btn btn-ghost btn-sm normal-case'>Dev</Link></li>
          <li><Link href='/about' className='btn btn-ghost btn-sm normal-case'>About</Link></li>
          <ContactForm />
        </ul>
      </div>
      <div className='navbar-end'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 self-start lg:self-auto'>
            <FacebookShareButton url={`${pageBasePath}/shops`} quote={"Find My shops!!!"} hashtag={`#creativerafa`}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={`${pageBasePath}/shops`} title={"Find My shops!!!"}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </div>
          <div className='flex items-center gap-2 self-start lg:self-auto'>
            <ThemeSelect />
            <NavbarAccount session={session} cartCount={cartCount} />
          </div>
        </div>
        <div className='flex items-center gap-2 self-start lg:self-auto'>
          <a href='https://www.instagram.com/creativerafaco/' className='hover:text-primary'><FaInstagram size={24} /></a>
          <a href='https://x.com/CreativeRafaCo' className='hover:text-primary'><FaTwitter size={24} /></a>
          <a href='https://www.facebook.com/CreativeRafaCo' className='hover:text-primary'><FaFacebook size={24} /></a>
          <a href='https://www.linkedin.com/in/rafael-mart%C3%ADnez-0a579b63/' className='hover:text-primary'><FaLinkedin size={24} /></a>
        </div>
      </div>
    </header>
  );
}

function NavbarAccount({ session, cartCount }) {
  if (session) {
    return (
      <Link href={"/user"} className='btn btn-ghost btn-sm normal-case'>
        <span className='relative mr-1 inline-flex'>
          <GiLoveLetter className='text-lg' />
          <span className='badge badge-info badge-xs absolute -right-2 -top-2'>{cartCount}</span>
        </span>
        {session.user?.name?.split(" ")[0] ?? "Profile"}
      </Link>
    );
  }

  return (
    <Link href={"/auth"} className='w-auto rounded-xl'>
      <div className='avatar'>
        <FaUser size={24} />
      </div>
    </Link>
  );
}
