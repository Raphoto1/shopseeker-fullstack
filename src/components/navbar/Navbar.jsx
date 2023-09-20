"use client";
//import propios
import SearchBar from "./SearchBar";
//imports app
import Image from "next/image";
import Link from "next/link";
import ThemeSelect from "../buttons/ThemeSelect";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from "next-share";

export default function Navbar() {
  return (
    <div>
      <div className='navbar bg-base-100'>
        <div className='flex-1'>
          <Link href={"/shops"}>
            <Image src={"/img/icons/IconoR.png"} width={50} height={50} alt='Icono Rafa' />
          </Link>
        </div>
        <div className='flex justify-between content-center'>
          <FacebookShareButton url={`https://shops.creativerafa.com/shops`} quote={"Find My shops!!!"} hashtag={`#creativerafa`}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={`https://shops.creativerafa.com/shops`} title={"Find My shops!!!"}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
        <ThemeSelect />
      </div>
    </div>
  );
}
