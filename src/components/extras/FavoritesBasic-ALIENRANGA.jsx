//imports de app
import React from 'react'
import useSWR from 'swr';
import Image from 'next/image';
//imports propios
import { fetcher, favoritesUrl } from "@/config/fetcher.config";
function FavoritesBasic() {
    //data get from the server
    const { data, error, isLoading } = useSWR(favoritesUrl, fetcher);
    if (error) return <h1>opps, my bad, try reloading :D</h1>;
    if (isLoading)
      return (
        <div className='flex h-full w-full justify-center content-center'>
          <span className='loading loading-infinity loading-lg' />
        </div>
      );
  
    const dataToShow = data.payload.docs;
    //mansory gallery
    //https://www.june.so/blog/tailwind-css-masonry-layout
    //https://medium.com/@legithiphop/efficient-masonry-layouts-in-react-with-lazy-loading-and-dynamic-grid-columns-f7a76af32238
  return (
      <div>
          <h1 className='text-5xl pb-2'>Top Designs</h1>
          <section className='grid grid-cols-4 gap-4'>

                {dataToShow.map((des, index) => (
                  <div key={index}>
                    <Image className='w-full h-auto rounded-lg' width={500} height={500} src={des.photo} alt={des.title} loading='lazy'/>
                  </div>
                ))}

          </section>
    </div>
  )
}

export default FavoritesBasic