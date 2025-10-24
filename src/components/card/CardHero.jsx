"use client";
//imports de app
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

//imports propios
import { pageBasePath } from "@/enums/SuperVariables";
import { LikeButton } from "@/components/buttons/LikeButton";

// Componente memoizado para las tiendas
const ShopLink = memo(({ shop }) => {
  if (shop.shopUrl === "null") return null;
  
  return (
    <div className='flex justify-center mx-auto content-center' key={shop.shopName}>
      <Link href={shop.shopUrl} passHref={true} target='_blank' className='flex-auto content-center'>
        <Image
          width={50}
          height={50}
          src={`/img/icons/${shop.shopName}.png`}
          alt={shop.shopName}
          loading='lazy'
          className='bg-slate-50 rounded-full'
          sizes="50px"
        />
      </Link>
    </div>
  );
});

ShopLink.displayName = 'ShopLink';

// Componente memoizado para los botones de compartir
const ShareButtons = memo(({ id, description, title, photo }) => {
  const shareUrl = `${pageBasePath}/shops/${id}`;
  
  return (
    <div className='p-2 grid grid-flow-col auto-cols-auto gap-3 justify-end'>
      <span>Share Your Favorite</span>
      <div className='flex justify-between content-center gap-2'>
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-circle btn-sm bg-blue-600 text-white"
        >
          F
        </a>
        <a 
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`New design available: ${title}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-circle btn-sm bg-sky-500 text-white"
        >
          T
        </a>
        <a 
          href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(photo)}&description=${encodeURIComponent(description)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-circle btn-sm bg-red-600 text-white"
        >
          P
        </a>
      </div>
    </div>
  );
});

ShareButtons.displayName = 'ShareButtons';

// Componente principal memoizado
function CardHero(props) {
  //api requests
  //get designs
  const basePath = `/api/design/${props.id}`;
  
  // Fetcher memoizado para evitar re-creaciones
  const fetcher = useMemo(() => 
    async (...args) => {
      const response = await fetch(...args);
      if (!response.ok) {
        throw new Error('Failed to fetch design');
      }
      return response.json();
    }, 
    []
  );
  
  const { data, error, isLoading } = useSWR(basePath, fetcher);
  
  // Memoizar el diseño para evitar re-renders innecesarios
  const design = useMemo(() => data?.payload, [data]);
  
  // Memoizar las tiendas válidas
  const validShops = useMemo(() => 
    design?.shops?.filter(shop => shop.shopUrl !== "null") || [], 
    [design?.shops]
  );

  if (error) {
    console.error('Error loading design:', error);
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-2xl font-bold text-error">Design not found</h1>
            <p className="py-6">The design you're looking for could not be loaded.</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-2xl font-bold">No design data available</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content flex-col lg:flex-row-reverse'>
          <div className='rounded-lg shadow-2xl max-h-screen'>
            <Carousel 
              autoPlay 
              dynamicHeight={false} 
              showThumbs={false} 
              className='rounded-lg shadow-2xl max-h-screen'
              swipeable
              emulateTouch
            >
              <div key="main-image">
                <Image 
                  src={design.photo} 
                  width={500} 
                  height={500} 
                  alt={design.title} 
                  className='max-w-sm rounded-lg shadow-2xl' 
                  priority // Prioridad para la imagen principal
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {design.secondaryImages?.map((img, index) => (
                <div key={`secondary-${index}`}>
                  <Image 
                    src={img.SIUrl} 
                    width={500} 
                    height={500} 
                    alt={`${design.title} - Image ${index + 2}`} 
                    className='max-w-sm rounded-lg shadow-2xl' 
                    loading='lazy'
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </Carousel>
          </div>

          <div>
            <div className='flex justify-around'>
              <LikeButton desId={props.id} likesRecieve={design.likes} key={props.id} />
            </div>
            <h1 className='text-5xl font-bold capitalize'>{design.title}</h1>
            <p className='py-6 text-2xl'>{design.description}</p>
            
            {validShops.length > 0 && (
              <div className='p-2 grid grid-flow-col auto-cols-auto gap-3 content-center'>
                {validShops.map((shop) => (
                  <ShopLink key={shop.shopName} shop={shop} />
                ))}
              </div>
            )}
            
            {design.blogLink && (
              <div className='card-actions justify-center'>
                <Link href={design.blogLink} target="_blank">
                  <button className='btn btn-primary'>Blog About {design.title}</button>
                </Link>
              </div>
            )}
            
            <ShareButtons 
              id={props.id} 
              description={design.description} 
              title={design.title} 
              photo={design.photo} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CardHero);
