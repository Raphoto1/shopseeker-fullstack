"use client";
import Image from "next/image";
import { LikeButton } from "./buttons/LikeButton";
import Link from "next/link";

export default function CardDesign(props) {
  return (
    <>
      <div className='card bg-base-100 shadow-xl stretch h-full glass'>
        <figure>
          <Image src={`/img/designs/${props.photo}`} width={1000} height={1000} alt={props.title}></Image>
        </figure>
        <div className='card-body flex items-center'>
          <h1 className='card-title'>{props.title}</h1>
          <h3>{ props.category}</h3>
          <p className="text-center">{props.description}</p>
          <div className="p-2 grid grid-flow-col auto-cols-auto gap-3 content-center">
          {props.shops.map((shop) => {
            return shop.shopUrl === "null" ? null : (
              <div className='flex justify-center mx-auto content-center'>
                <Link href={`${shop.shopUrl}`} passHref={true} target="blank" className='flex-auto content-center'>
                  <Image width={"50"} height={"50"} src={`/img/icons/${shop.shopName}.png`} alt={shop.shopName} />
                </Link>
              </div>
            );
          })}
          </div>
          <div className='card-actions justify-center'>
            <button className='btn btn-primary'>Show More</button>
          </div>
        </div>
      </div>
    </>
  );
}
