"use client";
//imports de app
import Link from "next/link";
import useSWR from "swr";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaCircleArrowRight } from "react-icons/fa6";
//imports propios
import { fetcher, favoritesUrl } from "@/config/fetcher.config";


export default function FavoritesCarousel() {
  const { data, error, isLoading } = useSWR(favoritesUrl, fetcher);
  if (error) return <h1>opps, my bad, try reloading :D</h1>;
  if (isLoading)
    return (
      <div className='flex h-full w-full justify-center content-center'>
        <span className='loading loading-infinity loading-lg' />
      </div>
    );

  const dataToShow = data.payload.docs;

  return (
    <>
      <div className='min-h-fit'>
        <h1 className='font-bolt text-3xl text-center'>Top 3 Favorites UNDER CONSTRUCTION</h1>
        <Carousel className='' autoPlay infiniteLoop showStatus={false}>
          {dataToShow.map((des, index) => (
            <div className='hero min-h-full' style={{ backgroundImage: `url(${des.photo})` }} key={index}>
              <div className='hero-overlay bg-opacity-20'></div>
              <div className='hero-content text-left text-accent-content drop-shadow-xl'>
                <div className='max-w-md'>
                  <h1 className='mb-5 text-5xl font-bold drop-shadow-sm'>{des.title}</h1>

                  <Link href={`/shops/${des._id}`}>
                    <button className='btn btn-primary'>Show Details</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <div className="flex justify-center pb-5">
        <Link href={'/allshops'}>
          <h1 className="btn btn-info justify-center text-center text-3xl">Check All My Designs</h1>
        </Link>
      </div>
      <div>
        <div className='flex w-full'>
          <Link href={'/allshops'}>
            <div className='grid h-20 flex-grow card bg-base-300 rounded-box place-items-center px-5'>Find your Favorite design</div>
          </Link>
          <div className='divider divider-horizontal'><FaCircleArrowRight size={70}/></div>
          <div className='grid h-20 flex-grow card bg-base-300 rounded-box place-items-center'>Follow your preffered shop</div>
          <div className='divider divider-horizontal'><FaCircleArrowRight size={70}/></div>
          <div className='grid h-20 flex-grow card bg-base-300 rounded-box place-items-center'>Enjoy!!!</div>
        </div>
      </div>
    </>
  );
}
