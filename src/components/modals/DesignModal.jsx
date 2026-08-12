//import app
import React from "react";
//import
import CardHero from "@/components/card/CardHero";
import CardDesign from "@/components/card/CardDesign";
import CardDesignWithCarousel from "../card/CardDesignWithCarousel";
export default function DesignModal({ desPack }) {
  return (
    <>
      <button className='flex absolute w-full h-full z-40' onClick={() => document.getElementById(`my_modal_${desPack?._id}`).showModal()}></button>
      <dialog id={`my_modal_${desPack?._id}`} className='modal modal-middle'>
        <div className='w-96 max-h-screen overflow-y-auto modal-box p-0 m-0'>
          <CardDesignWithCarousel
            key={desPack?._id}
            id={desPack?._id}
            title={desPack?.title}
            description={desPack?.description}
            category={desPack?.category}
            price={desPack?.price}
            photo={desPack?.photo}
            secondaryPhotos={desPack?.secondaryImages}
            shops={desPack?.shops || []}
            likes={desPack?.likes}
            blogLink={desPack?.blogLink}
          />

        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
