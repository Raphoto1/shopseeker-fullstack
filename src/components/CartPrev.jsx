import CardDesignWithCarousel from "./card/CardDesignWithCarousel";

export default function CartPrev({ cart }) {
  return (
    <>
      <div>
        <h2>Your Favorites</h2>
        {cart.map((des) => (
          <div key={des.design._id}>
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
        ))}
      </div>
    </>
  );
}
