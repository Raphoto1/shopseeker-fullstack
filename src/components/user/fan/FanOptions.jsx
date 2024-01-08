"use client";
//imports de app
import useSWR from "swr";

//imports propios
import CartPrev from "@/components/CartPrev";

export default function FanOptions(props) {
  const path = `/api/user/cart/${props.cart}`;

  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(path, fetcher);
  if (error) return <h1>opps, my bad, try reloading :D</h1>;
  if (isLoading)
    return (
      <div className='flex h-full w-full justify-center content-center'>
        <span className='loading loading-infinity loading-lg' />
      </div>
    );
  const designsToShow = data.payload[0].designs;

  return (
    <>
      <div>
        <h2 className='flex justify-center text-4xl font-bold pb-2'>Designs you love</h2>
        <CartPrev cart={designsToShow} />
      </div>
    </>
  );
}
