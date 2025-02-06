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
  
  const firstColumn = dataToShow.filter((_, index) => index % 4 === 0);
  const secondColumn = dataToShow.filter((_, index) => index % 4 === 1);
  const thirdColumn = dataToShow.filter((_, index) => index % 4 === 2);
  const fourthColumn = dataToShow.filter((_, index) => index % 4 === 3);
  return (
    <div className="px-4">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
        <div className="grid grid-gap-4 gap-2 h-fit">
          {firstColumn.map((des, index) => (
            <Link href={`/shops/${des._id}`} className="flex justify-center items-end" key={index}>
              <div className="absolute">
                <div className="flex w-100 h-100">
                  <h6 className="w-40 drop-shadow-md text-center opacity-0 hover:opacity-100 transition-all text-sm">
                    {des.title}
                  </h6>
                </div>
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
        <div className="grid grid-gap-4 gap-2 h-fit">
          {secondColumn.map((des, index) => (
            <Link href={`/shops/${des._id}`} className="flex justify-center items-end" key={index}>
            <div className="absolute">
              <div className="flex w-100 h-100">
                <h6 className="w-40 drop-shadow-md text-center opacity-0 hover:opacity-100 transition-all text-sm">
                  {des.title}
                </h6>
              </div>
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
        <div className="grid grid-gap-4 gap-2 h-fit">
          {thirdColumn.map((des, index) => (
            <Link href={`/shops/${des._id}`} className="flex justify-center items-end" key={index}>
            <div className="absolute">
              <div className="flex w-100 h-100">
                <h6 className="w-40 drop-shadow-md text-center opacity-0 hover:opacity-100 transition-all text-sm">
                  {des.title}
                </h6>
              </div>
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
        <div className="grid grid-gap-4 gap-2 h-fit">
          {fourthColumn.map((des, index) => (
            <Link href={`/shops/${des._id}`} className="flex justify-center items-end" key={index}>
            <div className="absolute">
              <div className="flex w-100 h-100">
                <h6 className="w-40 drop-shadow-md text-center opacity-0 hover:opacity-100 transition-all text-sm">
                  {des.title}
                </h6>
              </div>
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
      </section>
    </div>
  );
}

export default FavoritesBasic;
