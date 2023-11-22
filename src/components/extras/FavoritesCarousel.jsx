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
      <div className='sm:min-h-fit md:min-h-auto'>
        <Carousel className='' autoPlay infiniteLoop showStatus={false}>
          {dataToShow.map((des, index) => (
            <div className='hero min-h-full' style={{ backgroundImage: `url(${des.photo})` }} key={index}>
              <div className='hero-overlay bg-opacity-20'></div>
              <div className='hero-content text-center text-neutral-content drop-shadow-xl'>
                <div className='max-w-md'>
                  <h1 className='mb-5 text-5xl font-bold drop-shadow-md capitalize '>{des.title}</h1>

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
          <h1 className="btn btn-info h-auto justify-center text-center text-3xl">Check All My Designs</h1>
        </Link>
      </div>
      <div>
        <div className='md:5xl:flex-col sm:flex w-full sm:h-20'>
          <Link href={'/allshops'} className='grid flex-grow card bg-base-300 rounded-box place-items-center px-5'>
            <div >Find your Favorite design</div>
          </Link>
          <div className='divider sm:divider-vertical md:divider-horizontal'><FaCircleArrowRight size={70} className="rotate-90 md:rotate-0"/></div>
          <div className='grid flex-grow card bg-base-300 rounded-box place-items-center align-middle'>Follow your preffered shop</div>
          <div className='divider sm:divider-vertical md:divider-horizontal'><FaCircleArrowRight size={70} className="rotate-90 md:rotate-0"/></div>
          <div className='grid flex-grow card bg-base-300 rounded-box place-items-center'>Enjoy!!!</div>
        </div>
      </div>
    </>
  );
}
