"use client";
//imports de app
import dynamic from "next/dynamic";

//imports propios
import ShopsPackProfile from "@/components/extras/ShopsPackProfile";
import FavoritesBasic from "@/components/extras/FavoritesBasic";
import FlowShops from "@/components/extras/FlowShops";
import InstagramFeed from "@/components/socialMedia/InstagramFeed";


export default function Home() {
  const InstagramFeed = dynamic(() => import("@/components/socialMedia/InstagramFeed"), {
    ssr: false,
    loading: () => {
      <div className='flex h-full w-full justify-center content-center'>
        <span className='loading loading-infinity loading-lg' />
      </div>;
    },
  });
  const ShopsPackProfile = dynamic(() => import("@/components/extras/ShopsPackProfile"), {
    ssr: false,
    loading: () => {
      <div className='flex h-full w-full justify-center content-center'>
        <span className='loading loading-infinity loading-lg' />
      </div>;
    },
  });
  return (
    <>
      <FavoritesBasic />
      <FlowShops />
      <InstagramFeed />
      <ShopsPackProfile />
    </>
  );
}
