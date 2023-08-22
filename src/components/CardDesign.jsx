"use client";
import Image from "next/image";
import { LikeButton } from "./buttons/LikeButton";
import Link from "next/link";

export default function CardDesign(props) {
  return (
    <>
      <div className='card h-90 bg-base-100 shadow-xl h-full'>
        <figure>
          <Image src={`/img/designs/${props.photo}`} width={1000} height={1000} alt={props.title}></Image>
        </figure>
        <div className='card-body'>
          <h2 className='card-title'>{props.title}</h2>
          <p>{props.description}</p>
          <div className='card-actions justify-end'>
            <button className='btn btn-primary'>Show More</button>
          </div>
        </div>
      </div>
    </>
  );
}
