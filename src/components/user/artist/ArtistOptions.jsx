"use client";
//imports de app
import useSWR from "swr";
import Link from "next/link";

//imports propios
import CartPrev from "@/components/CartPrev";

export default function ArtistOptions(props) {

  return (
    <>
      {/* ARTIST OPTIONS GRID */}
      <div id='options' className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8 auto-rows-max'>
        
        {/* Coming Soon - Links To Your Shops */}
        <div className='tooltip tooltip-top w-full' data-tip='Coming Soon'>
          <button disabled className='btn btn-ghost btn-sm sm:btn-md w-full border-2 border-base-300 opacity-50 cursor-not-allowed h-auto py-2 px-1'>
            <span className='text-lg sm:text-xl'>🏪</span>
            <span className='hidden md:inline text-xs sm:text-sm'>Shops</span>
          </button>
        </div>

        {/* Coming Soon - Social Media */}
        <div className='tooltip tooltip-top w-full' data-tip='Coming Soon'>
          <button disabled className='btn btn-ghost btn-sm sm:btn-md w-full border-2 border-base-300 opacity-50 cursor-not-allowed h-auto py-2 px-1'>
            <span className='text-lg sm:text-xl'>📱</span>
            <span className='hidden md:inline text-xs sm:text-sm'>Social</span>
          </button>
        </div>

        {/* Your Shop Link */}
        <Link href={`/shops/user/${props.userId}`} className='w-full'>
          <button className='btn btn-outline btn-info btn-sm sm:btn-md w-full hover:btn-info h-auto py-2 px-1'>
            <span className='text-lg sm:text-xl'>🛍️</span>
            <span className='hidden md:inline text-xs sm:text-sm'>Shop</span>
          </button>
        </Link>

        {/* Designs Manager */}
        <Link href={`/updateDesign/user/${props.userId}`} className='w-full'>
          <button className='btn btn-warning btn-sm sm:btn-md w-full hover:btn-warning h-auto py-2 px-1'>
            <span className='text-lg sm:text-xl'>✏️</span>
            <span className='hidden md:inline text-xs sm:text-sm'>Edit</span>
          </button>
        </Link>

        {/* Upload Design */}
        <Link href={"/addDesign"} className='w-full'>
          <button className='btn btn-success btn-sm sm:btn-md w-full hover:btn-success h-auto py-2 px-1'>
            <span className='text-lg sm:text-xl'>⬆️</span>
            <span className='hidden md:inline text-xs sm:text-sm'>Upload</span>
          </button>
        </Link>
      </div>

      {/* FAVORITES SECTION */}
      <div id='favorites' className='mt-8'>
        <h2 className='text-2xl font-bold mb-4 flex items-center gap-2'>
          <span>💜</span>
          Designs you love
        </h2>
        <CartPrev cartId={props.cart} />
      </div>
    </>
  );
}
