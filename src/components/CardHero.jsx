"use client";
//imports de app
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

//imports propios
import { LikeButton } from "@/components/buttons/LikeButton";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, PinterestShareButton, PinterestIcon } from "next-share";

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
          <Image src={`/img/designs/${design.photo}`} width={1000} height={1000} alt={design.title} className='max-w-sm rounded-lg shadow-2xl' />
          <div>
            <div className='flex justify-around'>
              <LikeButton desId={props.id} likesRecieve={design.likes} key={props.id} />
            </div>
            <h1 className='text-5xl font-bold'>{design.title}</h1>
            <p className='py-6 text-2xl'>{design.description}</p>
            <div className='p-2 grid grid-flow-col auto-cols-auto gap-3 content-center'>
              {design.shops.map((shop) => {
                return shop.shopUrl === "null" ? null : (
                  <div className='flex justify-center mx-auto content-center'>
                    <Link href={`${shop.shopUrl}`} passHref={true} target='blank' className='flex-auto content-center'>
                      <Image width={"50"} height={"50"} src={`/img/icons/${shop.shopName}.png`} alt={shop.shopName} />
                    </Link>
                  </div>
                );
              })}
            </div>
            <div className="p-2 grid grid-flow-col auto-cols-auto gap-3 justify-end">
              <span>Share Your Favorite</span>
              <div className="flex justify-between content-center">
                <FacebookShareButton url={`https://shopseeker-fullstack.vercel.app/shops/${props.id}`} quote={design.description} hashtag={`#${design.title}`}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={`https://shopseeker-fullstack.vercel.app/shops/${props.id}`} title={`New design avaliable on my shops ${design.title}` }>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <PinterestShareButton url={`https://shopseeker-fullstack.vercel.app/shops/${props.id}`} media={`https://shopseeker-fullstack.vercel.app/img/designs/${design.photo}`}>
                  <PinterestIcon size={32} round/>
                </PinterestShareButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
