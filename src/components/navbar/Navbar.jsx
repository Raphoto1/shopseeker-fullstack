"use client"
//import propios
import SearchBar from "./SearchBar";
//imports app
import Image from "next/image";
import Link from "next/link";
import ThemeSelect from "../buttons/ThemeSelect";



export default function Navbar() {

  return (
    <div>
      <div className='navbar bg-base-100'>
        <div className='flex-1'>
          <Link href={"/"}>
            <Image src={"/img/icons/IconoR.png"} width={50} height={50} alt="Icono Rafa"/>
          </Link>
        </div>
        <ThemeSelect />
      </div>
    </div>
  );
}
