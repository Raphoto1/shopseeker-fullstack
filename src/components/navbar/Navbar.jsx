//import propios
import SearchBar from "./SearchBar";
//imports app
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div>
      <div className='navbar bg-base-100'>
        <div className='flex-1'>
          <Link href={"/"}>
            <Image src={"/img/icons/IconoR.png"} width={50} height={50}/>
          </Link>
        </div>
      </div>
    </div>
  );
}
