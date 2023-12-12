"use client";
//import propios
import SearchBar from "./SearchBar";
import { pageBasePath } from "@/enums/SuperVariables";
//imports app
import Image from "next/image";
import Link from "next/link";
import ThemeSelect from "../buttons/ThemeSelect";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from "next-share";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status, update } = useSession()

  return (
    <>
      <header>
        <div className='navbar bg-base-200'>
          <div className='sm:flex-1'>
            <Link href={"/"}>
              <Image src={"/img/icons/Icon whiteBG.png"} width={50} height={50 } alt='Icono Rafa' />
            </Link>
          </div>
          <div className="">
            <ul tabIndex={0} className="btn btn-primary btn-xs invisible md:visible">
              <li>
                <Link href={"/allshops"}>
                  See All Designs
                </Link>
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
            <p>{session?.user.name }</p>
          </div>
        </div>
      </header>
    </>
  );
}
