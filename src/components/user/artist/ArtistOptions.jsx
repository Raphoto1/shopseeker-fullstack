"use client";
//imports de app
import useSWR from "swr";
import Link from "next/link";

//imports propios
import CartPrev from "@/components/CartPrev";

export default function ArtistOptions(props) {
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
      <div id='options' className='flex justify-evenly px-2'>
        <div>
          <button className="btn">Links To Your Shops</button>
        </div>
        <div>
          <button className="btn">Social Media links</button>
        </div>
        <Link href={`/shops/user/${props.userId}`}>
          <button className="btn">Your CreativeRafa shop link</button>
        </Link>
        <Link href={`/updateDesign/user/${props.userId}`}>
          <button className='btn btn-primary'>Designs Manager</button>
        </Link>
        <Link href={"/addDesign"}>
          <button className='btn btn-success'>Upload Design</button>
        </Link>
      </div>
      <div id='favorites'>
        <h2 className='flex justify-center text-4xl font-bold pb-2'>Designs you love</h2>
        <CartPrev cart={designsToShow} />
      </div>
    </>
  );
}
