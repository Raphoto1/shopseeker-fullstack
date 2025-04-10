"use client";
import Image from "next/image";
import Link from "next/link";
export default function ShopsPackProfile() {
  return (
    <>
      <h1 className="text-5xl font-bold text-center py-3">All My Shops</h1>
      <div className='stats shadow flex  align-middle overflow-x-scroll'>
        <div className="stat flex justify-center ">
          <Link href={'https://www.redbubble.com/es/people/Raphoto1/shop?asc=u&ref=account-nav-dropdown'} passHref={true} target="blank">
            <div className='stat-title'> RedBubble </div>
            <div className='stat-figure flex justify-center'>
              <Image width={"50"} height={"50"} src={`/img/icons/RedBubble.png`} alt='redbubble' />
            </div>
          </Link>
        </div>
        {/* <div className="stat flex justify-center">
          <Link href={'https://society6.com/rafaelmartinez'} passHref={true} target="blank">
            <div className='stat-title'> Society6 </div>
            <div className='stat-figure flex justify-center'>
              <Image width={"50"} height={"50"} src={`/img/icons/Society6.png`} alt='redbubble' />
            </div>
          </Link>
        </div> */}
        <div className="stat flex justify-center">
          <Link href={'https://displate.com/Raphoto1?art=5c9d663484046'} passHref={true} target="blank">
            <div className='stat-title justify-center'> Displate </div>
            <div className='stat-figure flex justify-center'>
              <Image width={"50"} height={"50"} src={`/img/icons/Displate.png`} alt='redbubble' />
            </div>
          </Link>
        </div>
        <div className="stat flex justify-center">
          <Link href={'https://www.teepublic.com/user/creativerafa'} passHref={true} target="blank">
            <div className='stat-title text-center'> Teepublic </div>
            <div className='stat-figure flex justify-center'>
              <Image width={"50"} height={"50"} src={`/img/icons/TeePublic.png`} alt='redbubble' />
            </div>
          </Link>
        </div>
        <div className="stat flex justify-center">
          <Link href={'https://creative-rafa.myspreadshop.es/'} passHref={true} target="blank">
            <div className='stat-title'> SpreadShirt </div>
            <div className='stat-figure flex justify-center'>
              <Image width={"50"} height={"50"} src={`/img/icons/Spreadshirt.png`} alt='spreadshirt' />
            </div>
          </Link>
        </div>
        <div className="stat flex justify-center">
          <Link href={'https://raphoto1.threadless.com/'} passHref={true} target="blank">
            <div className='stat-title'> Threadless </div>
            <div className='stat-figure flex justify-center'>
              <Image width={"50"} height={"50"} src={`/img/icons/Threadless.png`} alt='redbubble' className="bg-slate-50 rounded-full"/>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
