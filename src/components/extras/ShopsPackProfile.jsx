"use client";
import Image from "next/image";
import Link from "next/link";
export default function ShopsPackProfile() {
  return (
    <>
      <h1 className="text-5xl font-bold text-center py-3">All My Shops</h1>
      <div className='stats shadow flex justify-center align-middle'>
        <div className="stat flex justify-center ">
          <Link href={'https://www.redbubble.com/es/people/Raphoto1/shop?asc=u&ref=account-nav-dropdown'} passHref={true} target="blank">
            <div className='stat-title'> RedBubble </div>
            <div className='stat-figure'>
              <Image width={"50"} height={"50"} src={`/img/icons/redbubble.png`} alt='redbubble' />
            </div>
          </Link>
        </div>
        <div className="stat flex justify-center">
          <Link href={'https://society6.com/rafaelmartinez'} passHref={true} target="blank">
            <div className='stat-title'> Society6 </div>
            <div className='stat-figure'>
              <Image width={"50"} height={"50"} src={`/img/icons/society6.png`} alt='redbubble' />
            </div>
          </Link>
        </div>
        <div className="stat flex justify-center">
          <Link href={'https://displate.com/Raphoto1?art=5c9d663484046'} passHref={true} target="blank">
            <div className='stat-title justify-center'> Displate </div>
            <div className='stat-figure'>
              <Image width={"50"} height={"50"} src={`/img/icons/displate.png`} alt='redbubble' />
            </div>
          </Link>
        </div>
        <div className="stat flex justify-center">
          <Link href={'https://www.teepublic.com/user/creativerafa'} passHref={true} target="blank">
            <div className='stat-title text-center'> Teepublic </div>
            <div className='stat-figure'>
              <Image width={"50"} height={"50"} src={`/img/icons/teepublic.png`} alt='redbubble' />
            </div>
          </Link>
        </div>
        <div className="stat flex justify-center">
          <Link href={'https://www.spreadshirt.es/shop/user/raphoto1/?srEdit=pa#?affiliateId=1257693'} passHref={true} target="blank">
            <div className='stat-title'> SpreadShirt </div>
            <div className='stat-figure'>
              <Image width={"50"} height={"50"} src={`/img/icons/spreadshirt.png`} alt='redbubble' />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
