"use client";
//imports de app
import useSWR from "swr";
import Link from "next/link";

//imports propios
import CartPrev from "@/components/CartPrev";

export default function ArtistOptions(props) {

  return (
    <>
      <div id='options' className='flex justify-evenly px-2 flex-wrap'>
        <div className='p-2 tooltip' data-tip='coming soon'>
          <button className='btn'>Links To Your Shops</button>
        </div>
        <div className='p-2 tooltip' data-tip='coming soon'>
          <button className='btn'>Social Media links</button>
        </div>
        <Link href={`/shops/user/${props.userId}`} className='p-2'>
          <button className='btn'>Your CreativeRafa shop link</button>
        </Link>
        <Link href={`/updateDesign/user/${props.userId}`} className='p-2'>
          <button className='btn btn-primary'>Designs Manager</button>
        </Link>
        <Link href={"/addDesign"} className='p-2'>
          <button className='btn btn-success'>Upload Design</button>
        </Link>
      </div>
      <div id='favorites'>
        <h2 className='flex justify-center text-4xl font-bold pb-2'>Designs you love</h2>
        <CartPrev cartId={props.cart} />
      </div>
    </>
  );
}
