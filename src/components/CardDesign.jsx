"use client";
import Image from "next/image";
import { LikeButton } from "./buttons/LikeButton";
import Link from "next/link";

export default function CardDesign(props) {
  return (
    <>
      <div className='relative max-w-sm bg-blue-200 border border-gray-500 rounded-lg hover:shadow-xl dark:bg-blue-950' id={props.key}>
        <div className='absolute z-10 right-3'>
          <LikeButton />
        </div>
        <Image
          width={"500"}
          height={"500"}
          className='transition ease-in-out delay-100 rounded-t-lg w-full grayscale hover:grayscale-0'
          src={`/img/designs/${props.photo}`}
          alt='design'
        />
        <div className='p-2 infoGroup text-center dark:text-white'>
          <h5 className='text-center text-xl font-bold'>{props.title}</h5>
          <p className='text-center text-sm'>{props.desciption}</p>
          <p className='text-center text-xs italic pb-3'>{props.category}</p>
          {/* <button
            type='button'
            className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2r'>
            Add to list
          </button> */}
          {/* <button
            type='button'
            className='text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'>
            Donate
          </button> */}
        </div>
        <div className=' p-2 grid grid-flow-col auto-cols-auto gap-3 content-center'>
          {props.shops.map((shop) => {
            return shop.shopUrl === "null" ? null : (
              <div className='flex justify-center mx-auto'>
                <Link href={`${shop.shopUrl}`} passHref={true} target="blank" className='flex-auto'>
                  <Image width={"50"} height={"50"} src={`/img/icons/${shop.shopName}.png`} alt={shop.shopName} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
