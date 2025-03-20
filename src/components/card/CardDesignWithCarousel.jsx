"use client";
//imports de app
import Image from "next/image";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { v4 } from "uuid";
//imports propios
import { LikeButton } from "@/components/buttons/LikeButton";

export default function CardDesignWithCarousel(props) {
  return (
    <>
      <div className='card bg-base-100 shadow-xl stretch h-full glass w-auto' key={v4()}>
        <div className='flex justify-around '>
          <LikeButton desId={props.id} likesRecieve={props.likes} key={props.id} />
        </div>
        <figure>
          <Carousel showStatus={false} showThumbs={false}>
            <div key={1} className=' flex max-w-auto aspect-square overflow-hidden align-middle content-center items-center'>
              <Image src={props.photo} width={500} height={500} alt={props.title} loading='lazy' objectFit='scale-down' />
            </div>

            {props.secondaryPhotos.map((img, index) => (
              <div key={index + 1} className='flex max-w-auto aspect-square overflow-hidden align-middle content-center items-center'>
                <Image src={img.SIUrl} width={500} height={500} alt={props.title} loading='lazy' objectFit='scale-down' />
              </div>
            ))}
          </Carousel>
        </figure>

        <div className='card-body flex items-center'>
          <h1 className='card-title capitalize'>{props.title}</h1>
          <h3>{props.category}</h3>
          <p className='text-center line-clamp-3'>{props.description}</p>
          <div className='p-2 grid grid-flow-col auto-cols-auto gap-3 content-center'>
            {props.shops.map((shop) => {
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
          {props.blogLink?<div className='card-actions justify-center'>
            <Link href={props.blogLink} target="blank">
              <button className='btn btn-primary'>Blog About {props.title}</button>
            </Link>
          </div>:null}
          <div className='card-actions justify-center'>
            <Link href={`/shops/${props.id}`}>
              <button className='btn btn-primary'>Show More</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
