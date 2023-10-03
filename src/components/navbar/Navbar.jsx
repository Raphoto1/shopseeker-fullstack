"use client";
//import propios
import SearchBar from "./SearchBar";
import { pageBasePath } from "@/enums/SuperVariables";
//imports app
import Image from "next/image";
import Link from "next/link";
import ThemeSelect from "../buttons/ThemeSelect";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from "next-share";

export default function Navbar() {
  return (
    <>
      <header>
        <div className='navbar bg-base-100'>
          <div className='flex-1'>
            <Link href={"/"}>
              <Image src={"/img/icons/Icon whiteBG.png"} width={50} height={50} alt='Icono Rafa' />
            </Link>
          </div>
          <div className="">
            <ul tabIndex={0} className="btn btn-primary sm:btn-xs">
              <li>
                <Link href={"/allshops"}>
                  See All Designs
                </Link>
              </li>
            </ul>
          </div>
          <div className='flex justify-between content-center'>
            <p>Let's Share</p>
            <FacebookShareButton url={`${pageBasePath}/shops`} quote={"Find My shops!!!"} hashtag={`#creativerafa`}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={`${pageBasePath}/shops`} title={"Find My shops!!!"}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </div>
          <ThemeSelect />
        </div>
      </header>
    </>
  );
}
