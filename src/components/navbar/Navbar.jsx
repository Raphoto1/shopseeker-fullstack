"use client";
//import propios
import { pageBasePath } from "@/enums/SuperVariables";
import { useCart } from "@/context/cartContext";
import ContactForm from "../contact/ContactForm";
//imports app
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { GiLoveLetter } from "react-icons/gi";
import { FaUser } from "react-icons/fa";

function NavbarLoader() {
  return (
    <div className='flex h-full w-full justify-center content-center'>
      <span className='loading loading-infinity loading-lg' />
    </div>
  );
}

// Cargar componentes de manera diferida
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

  useEffect(() => {
    if (session?.cart) {
      getCartInfo(session.cart);
    }
  }, [getCartInfo, session?.cart]);

  return (
    <header className='navbar bg-base-100 shadow-lg sticky top-0 z-50'>
      <div className='navbar-start'>
        <Link href={"/"} className='flex items-center gap-3'>
          <Image src={"/img/icons/Icon whiteBG.png"} width={50} height={50} alt='Icono Creative Rafa' className='h-auto w-auto' />
        </Link>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul>
          <a href='/allshops' className='btn btn-ghost btn-sm normal-case'>Shop</a>
          <a href='/blog' className='btn btn-ghost btn-sm normal-case'>Blog</a>
          <a href='/dev' className='btn btn-ghost btn-sm normal-case'>Dev</a>
          <a href='/about' className='btn btn-ghost btn-sm normal-case'>About</a>
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
