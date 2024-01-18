import CardDesignWithCarousel from "./card/CardDesignWithCarousel";

export default function CartPrev({ cart }) {
  return (
    <>
      <div>
        {cart.length >= 1 ? (
          cart.map((des) => (
            <div key={des.design._id} className='p-2'>
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
          <p className='flex justify-center text-warning font-bold p-2'>No designs Saved</p>
        )}
      </div>
    </>
  );
}
