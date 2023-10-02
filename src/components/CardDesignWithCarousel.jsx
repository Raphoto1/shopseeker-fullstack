"use client";
//imports de app
import Image from "next/image";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
//imports propios
import { LikeButton } from "./buttons/LikeButton";

export default function CardDesignWithCarousel(props) {
  return (
    <>
      <div className='card bg-base-100 shadow-xl stretch h-full glass w-auto'>
        <div className='flex justify-around '>
          <LikeButton desId={props.id} likesRecieve={props.likes} key={props.id} />
        </div>
        <figure>
          <Carousel>
            <div>
              <Image src={props.photo} width={1000} height={1000} alt={props.title} />
            </div>

            {props.secondaryPhotos.map((img, index) => (
              <div>
                <Image src={img.SIUrl} width={1000} height={1000} alt={props.title} />
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
                    <Image width={"50"} height={"50"} src={`/img/icons/${shop.shopName}.png`} alt={shop.shopName} />
                  </Link>
                </div>
              );
            })}
          </div>
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
