"use client";
//imports de app
import useSWR from "swr";

//imports propios
import CartPrev from "@/components/CartPrev";

export default function FanOptions(props) {

  return (
    <>
      <div>
        <h2 className='flex justify-center text-4xl font-bold pb-2'>Designs you love</h2>
        <CartPrev cartId={props.cart} />
      </div>
    </>
  );
}
