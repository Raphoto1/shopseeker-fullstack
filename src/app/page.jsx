"use client";
//imports de app
import dynamic from "next/dynamic";
import { Suspense } from "react";

//imports propios - componentes críticos importados directamente
import FavoritesBasic from "@/components/extras/FavoritesBasic";
import FlowShops from "@/components/extras/FlowShops";
import PageSkeleton from "@/components/ui/PageSkeleton";

// Componentes no críticos con lazy loading optimizado
const InstagramFeed = dynamic(() => import("@/components/socialMedia/InstagramFeed"), {
  ssr: false,
  loading: () => (
    <div className='flex h-48 w-full justify-center items-center'>
      <span className='loading loading-infinity loading-lg' />
    </div>
  ),
});

const ShopsPackProfile = dynamic(() => import("@/components/extras/ShopsPackProfile"), {
  ssr: false,
  loading: () => (
    <div className='flex h-32 w-full justify-center items-center'>
      <span className='loading loading-infinity loading-lg' />
    </div>
  ),
});

export default function Home() {
  return (
    <main>
      {/* Contenido crítico above-the-fold - carga inmediata */}
      <Suspense fallback={<PageSkeleton />}>
        <FlowShops />
        <FavoritesBasic />
      </Suspense>
      
      {/* Contenido below-the-fold - lazy loading */}
      <Suspense fallback={
        <div className='flex h-48 w-full justify-center items-center'>
          <span className='loading loading-infinity loading-lg' />
        </div>
      }>
        <InstagramFeed />
      </Suspense>
      
      <Suspense fallback={
        <div className='flex h-32 w-full justify-center items-center'>
          <span className='loading loading-infinity loading-lg' />
        </div>
      }>
        <ShopsPackProfile />
      </Suspense>
    </main>
  );
}
