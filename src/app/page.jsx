"use client";
//imports de app

//imports propios
import ShopsPackProfile from "@/components/extras/ShopsPackProfile";
import FavoritesCarousel from "@/components/extras/FavoritesCarousel";
import FavoritesBasic from "@/components/extras/FavoritesBasic";
import FlowShops from "@/components/extras/FlowShops";

export default function Home() {
  return (
    <>
      <FavoritesBasic />
      {/* <FavoritesCarousel /> */}
      <FlowShops />
      <ShopsPackProfile/>
    </>
  );
}
