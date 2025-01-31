//imports de app
import React from "react";
import useSWR from "swr";
import Image from "next/image";
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
  //mansory gallery
  //https://www.june.so/blog/tailwind-css-masonry-layout
  //https://medium.com/@legithiphop/efficient-masonry-layouts-in-react-with-lazy-loading-and-dynamic-grid-columns-f7a76af32238

  const firstColumn = dataToShow.filter((_, index) => index % 4 === 0);
  const secondColumn = dataToShow.filter((_, index) => index % 4 === 1);
  const thirdColumn = dataToShow.filter((_, index) => index % 4 === 2);
  const fourthColumn = dataToShow.filter((_, index) => index % 4 === 3);
  return (
    <div className="px-4">
      <h1 className="text-5xl pb-2 justify-center text-center">Rocking Designs</h1>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
        <div className="grid grid-gap-4 gap-2">
          {firstColumn.map((des, index) => (
            <div key={index} className="flex justify-start align-top">
              <h6 className="absolute">{des.title}</h6>
              <Image
                width={500}
                height={500}
                src={des.photo}
                alt={des.title}
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-gap-4 gap-2">
          {secondColumn.map((des, index) => (
            <div key={index} className="flex justify-start align-top">
              <Image
                width={500}
                height={500}
                src={des.photo}
                alt={des.title}
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-gap-4 gap-2">
          {thirdColumn.map((des, index) => (
            <div key={index} className="flex justify-start align-top">
              <Image
                width={500}
                height={500}
                src={des.photo}
                alt={des.title}
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-gap-4 gap-2">
          {fourthColumn.map((des, index) => (
            <div key={index} className="flex justify-start align-top">
              <Image
                width={500}
                height={500}
                src={des.photo}
                alt={des.title}
                loading="lazy"
                fill={false}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FavoritesBasic;
