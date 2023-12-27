'use client'
//imports de app
import useSWR from "swr";

//imports propios
import CartPrev from "@/components/CartPrev";

export default function FanOptions(props) {
    
const path = '/api/user/cart/657a313f7fb45ec6d1a93d80'

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
console.log(designsToShow);

  return (
    <>
      <div>
        <h3>{props.cart}</h3>
        <h2>Designs you liked</h2>

        <CartPrev cart={designsToShow} />
      </div>
    </>
  );
}
