//imports propios
import CardDesignWithCarousel from "./card/CardDesignWithCarousel";
//imports de app
import { v4 } from "uuid";
import useSWR from "swr";
import { useRouter } from "next/navigation";

export default function CartPrev({ cartId }) {
  const router = useRouter()
  const path = `/api/user/cart/${cartId}`;

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

  const handleClearCart = (e) => {
    e.preventDefault();
    const url= `/api/user/cart/${cartId}`
    const result = fetch(url, {
      method: 'PATCH',
      credentials:'include'
    }).then((res) => res.json())
      .then((data) => {
      if (data.status===200) {
        alert('Cart Successfully Cleared')
        router.refresh()
      } else {
        alert('Try Again Later')
      }
    })
  };
  return (
    <>
      <div>
        {designsToShow.length >= 1 && (
          <div className='flex justify-center'>
            <button className='btn btn-sm btn-secondary' onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>
        )}
        {designsToShow.length >= 1 ? (
          designsToShow.map((des) => (
            <div key={v4()} className='p-2'>
              <CardDesignWithCarousel
                key={des.design._id}
                id={des.design._id}
                title={des.design.title}
                description={des.design.description}
                category={des.design.category}
                photo={des.design.photo}
                secondaryPhotos={des.design.secondaryImages}
                shops={des.design.shops}
                likes={des.design.likes}
              />
            </div>
          ))
        ) : (
          <p className='flex justify-center text-warning font-bold p-2'>No Designs Saved</p>
        )}
      </div>
    </>
  );
}
