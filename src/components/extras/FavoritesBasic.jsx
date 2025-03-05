//imports de app
import React from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
//imports propios
import { fetcher, favoritesUrl } from "@/config/fetcher.config";
function FavoritesBasic() {
  //data get from the server
  const { data, error, isLoading } = useSWR(favoritesUrl, fetcher);
  if (error) return <h1>opps, my bad, try reloading :D</h1>;
  if (isLoading)
    return (
      <div className="flex h-full w-full justify-center content-center">
        <span className="loading loading-infinity loading-lg" />
      </div>
    );

  const dataToShow = data.payload.docs;
  
  const columns = [[], [], [], []];
  dataToShow.forEach((des, index) => {
    columns[index % 4].push(des);
  });

  return (
    <div className="px-4">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="grid gap-2 h-fit">
            {column.map((des, index) => (
              <Link href={`/shops/${des._id}`} className="flex justify-center items-end relative" key={index}>
                <div className="absolute flex w-full h-full justify-center items-center">
                  <h6 className="w-40 drop-shadow-md text-center opacity-0 hover:opacity-100 transition-all text-sm">
                    {des.title}
                  </h6>
                </div>
                <Image
                  width={500}
                  height={500}
                  src={des.photo}
                  alt={des.title}
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}

export default FavoritesBasic;
