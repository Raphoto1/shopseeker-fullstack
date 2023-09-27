"use client";
import useSWR from "swr";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { fetcher, favoritesUrl } from "@/config/fetcher.config";

import CardHero from "../CardHero";

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
      <h1 className='font-bolt text-3xl fixed z-10'>Top 3 Favorites UNDER CONSTRUCTION</h1>
      <Carousel className='h-screen'>
        {dataToShow.map((des, index) => (
          <div key={index} className='h-screen'>
            <CardHero id={ des._id} />
          </div>
        ))}
      </Carousel>
    </>
  );
}
