"use client";
//import propios
import SearchBar from "./SearchBar";
import { pageBasePath } from "@/enums/SuperVariables";
import { useCart } from "@/context/cartContext";
//imports app
import Image from "next/image";
import Link from "next/link";
import ThemeSelect from "../buttons/ThemeSelect";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from "next-share";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { GiLoveLetter } from "react-icons/gi";

export default function Navbar() {
  const { data: session, status, update } = useSession();
  const { getCartInfo, cartContent, cart } = useCart();
  let cartCount = 0;
  if (session) {
    getCartInfo(session?.cart);
    if (cart === undefined) {
      cartCount = 0
    } else {
      cartCount = cart.length;
    }
  }

  useEffect(() => {
    getCartInfo(session?.cart);
    cartCount = cartContent.length;
  }, [cartContent]);

  return (
    <>
      <header>
        <div className='navbar bg-base-200'>
          <div className='sm:flex-1'>
            <Link href={"/"}>
              <Image src={"/img/icons/Icon whiteBG.png"} width={50} height={50} alt='Icono Rafa' />
            </Link>
          </div>
          <div className=''>
            <ul tabIndex={0} className='btn btn-primary btn-xs invisible md:visible'>
              <li>
                <Link href={"/allshops"}>See All Designs</Link>
              </li>
            </ul>
          </div>
          <div className='flex justify-between content-center py-2'>
            <FacebookShareButton url={`${pageBasePath}/shops`} quote={"Find My shops!!!"} hashtag={`#creativerafa`}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={`${pageBasePath}/shops`} title={"Find My shops!!!"}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </div>
          <ThemeSelect />
          <div>
            {session ? (
              <div className='flex' id='user'>
                <Link href={"/user"} className="flex pr-2">
                <div className="pr-1">
                  <p className='absolute pt-1 text-info drop-shadow-sm'>{cartCount}</p>
                  <GiLoveLetter />
                </div>
                {session?.user.name.split(" ")[0]} </Link>
              </div>
            ) : (
              <Link href={"/auth"}>
                <p>Register/Login</p>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
