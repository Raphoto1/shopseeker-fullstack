"use client";
import Image from "next/image";
import { LikeButton } from "../buttons/LikeButton";
import Link from "next/link";

export default function CardDesign(props) {

  return (
    <>
      <div className='card bg-base-100 shadow-xl stretch h-full glass w-auto' key={props.id}>
        <div className='flex justify-around '>
          <LikeButton desId={props.id} likesRecieve={props.likes} key={props.id}/>
        </div>
        <figure>
          <Image src={props.photo} width={500} height={500} alt={props.title} loading="lazy"></Image>
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
                    <Image width={"50"} height={"50"} src={`/img/icons/${shop.shopName}.png`} alt={shop.shopName} loading="lazy"/>
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
