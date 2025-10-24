//imports de app
import React, { memo, useMemo } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
//imports propios
import { fetcher, favoritesUrl } from "@/config/fetcher.config";

function FavoritesBasic() {
  //data get from the server
  const { data, error, isLoading } = useSWR(favoritesUrl, fetcher);
  
  // Memoizar las columnas para evitar recalculos en cada render
  const columns = useMemo(() => {
    if (!data?.payload?.docs) return [[], [], [], []];
    
    const dataToShow = data.payload.docs;
    const cols = [[], [], [], []];
    dataToShow.forEach((des, index) => {
      cols[index % 4].push(des);
    });
    return cols;
  }, [data?.payload?.docs]);

  if (error) {
    return (
      <div className="px-4 py-8 text-center">
        <h1 className="text-xl text-error">Oops, something went wrong. Please try reloading 😅</h1>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex h-96 w-full justify-center items-center">
        <span className="loading loading-infinity loading-lg" />
      </div>
    );
  }

  return (
    <div className="px-4">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="grid gap-2 h-fit">
            {column.map((des, index) => (
              <Link 
                href={`/shops/${des._id}`} 
                className="flex justify-center items-end relative group" 
                key={des._id || index}
                prefetch={false} // Evitar prefetch innecesario
              >
                <div className="absolute flex w-full h-full justify-center items-center z-10">
                  <h6 className="w-40 drop-shadow-md text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm bg-black/50 text-white p-2 rounded">
                    {des.title}
                  </h6>
                </div>
                <Image
                  width={500}
                  height={500}
                  src={des.photo}
                  alt={des.title}
                  loading={index < 4 ? "eager" : "lazy"} // Prioridad para las primeras 4 imágenes
                  priority={index < 2} // Priority solo para las primeras 2 imágenes above-the-fold
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="w-full h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                  quality={85} // Mejor balance calidad/tamaño
                />
              </Link>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}

export default memo(FavoritesBasic);
