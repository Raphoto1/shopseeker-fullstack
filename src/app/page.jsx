"use client";
//imports de app

//imports propios
import ShopsPackProfile from "@/components/extras/ShopsPackProfile";
import FavoritesCarousel from "@/components/extras/FavoritesCarousel";

export default function Home() {
  return (
    <>
      <FavoritesCarousel />
      <ShopsPackProfile/>
    </>
  );
}
