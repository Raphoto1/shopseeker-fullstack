"use client";
//imports de app
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, PinterestShareButton, PinterestIcon } from "next-share";

//imports propios
import { pageBasePath } from "@/enums/SuperVariables";
import { LikeButton } from "@/components/buttons/LikeButton";

export default function CardHero(props) {
  //api requests
  //get designs
  let basePath = `/api/design/${props.id}`;
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(basePath, fetcher);
  if (error) return <h1>Not designs found</h1>;
  if (isLoading) return <h1>Loading...</h1>;
  const design = data.payload;

  return (
    <div>
      <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content flex-col lg:flex-row-reverse'>
          <div className=' rounded-lg shadow-2xl max-h-screen'>
            <Carousel autoPlay dynamicHeight={false} className=' rounded-lg shadow-2xl max-h-screen'>
              <div key={1}>
                <Image src={design.photo} width={500} height={500} alt={design.title} className='max-w-sm rounded-lg shadow-2xl' loading='lazy' />
              </div>

              {design.secondaryImages.map((img, index) => (
                <div key={index + 1}>
                  <Image src={img.SIUrl} width={500} height={500} alt={design.title} className='max-w-sm rounded-lg shadow-2xl' loading='lazy' />
                </div>
              ))}
            </Carousel>
          </div>

          <div>
            <div className='flex justify-around'>
              <LikeButton desId={props.id} likesRecieve={design.likes} key={props.id} />
            </div>
            <h1 className='text-5xl font-bold capitalize'>{design.title}</h1>
            <p className='py-6 text-2xl'>{design.description}</p>
            <div className='p-2 grid grid-flow-col auto-cols-auto gap-3 content-center'>
              {design.shops.map((shop) => {
                return shop.shopUrl === "null" ? null : (
                  <div className='flex justify-center mx-auto content-center'>
                    <Link href={`${shop.shopUrl}`} passHref={true} target='blank' className='flex-auto content-center'>
                      <Image
                        width={"50"}
                        height={"50"}
                        src={`/img/icons/${shop.shopName}.png`}
                        alt={shop.shopName}
                        loading='lazy'
                        className='bg-slate-50 rounded-full'
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
            {design.blogLink ? (
              <div className='card-actions justify-center'>
                <Link href={design.blogLink} target="blank">
                  <button className='btn btn-primary'>Blog About {design.title}</button>
                </Link>
              </div>
            ) : null}
            <div className='p-2 grid grid-flow-col auto-cols-auto gap-3 justify-end'>
              <span>Share Your Favorite</span>
              <div className='flex justify-between content-center'>
                <FacebookShareButton url={`${pageBasePath}/shops/${props.id}`} quote={design.description} hashtag={`#${design.title}`} title={design.title}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={`${pageBasePath}/shops/${props.id}`} title={`New design available on my shops ${design.title}`}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <PinterestShareButton url={`${pageBasePath}/shops/${props.id}`} media={`${design.photo}`}>
                  <PinterestIcon size={32} round />
                </PinterestShareButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
