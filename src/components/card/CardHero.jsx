"use client";
//imports de app
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { FaFacebookF, FaPinterestP, FaXTwitter } from "react-icons/fa6";

//imports propios
import { pageBasePath } from "@/enums/SuperVariables";
import { LikeButton } from "@/components/buttons/LikeButton";
import { event as trackEvent } from "@/gtag";

const trackShopClick = ({ shopName, shopUrl, designId, designTitle }) => {
  const shopKey = String(shopName || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  const actionName = `shop_link_click_${shopKey || "unknown"}`;

  trackEvent({
    action: actionName,
    category: "design_shop",
    label: `${shopName}|${designTitle}|${designId}`,
    value: 1,
    params: {
      action_base: "shop_link_click",
      shop_name: shopName,
      shop_key: shopKey,
      shop_url: shopUrl,
      design_id: String(designId),
      design_title: designTitle,
      source_component: "CardHero",
    },
  });
};

// Componente memoizado para las tiendas
const ShopLink = memo(({ shop, designId, designTitle }) => {
  if (shop.shopUrl === "null") return null;
  
  return (
    <div className='flex justify-center'>
      <Link
        href={shop.shopUrl}
        passHref={true}
        target='_blank'
        rel='noopener noreferrer'
        onClick={() => trackShopClick({ shopName: shop.shopName, shopUrl: shop.shopUrl, designId, designTitle })}
        className='group inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'
      >
        <Image
          width={50}
          height={50}
          src={`/img/icons/${shop.shopName}.png`}
          alt={shop.shopName}
          loading='lazy'
          className='h-10 w-10 rounded-full bg-slate-100 object-contain p-1'
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
    <div className='mt-6 rounded-2xl border border-base-300 bg-base-200/70 p-4'>
      <p className='text-sm font-semibold tracking-wide text-base-content/70'>Share this design</p>
      <div className='mt-3 flex flex-wrap items-center gap-2'>
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5'
          aria-label='Share on Facebook'
        >
          <FaFacebookF size={14} />
        </a>
        <a 
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`New design available: ${title}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5'
          aria-label='Share on X'
        >
          <FaXTwitter size={14} />
        </a>
        <a 
          href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(photo)}&description=${encodeURIComponent(description)}`}
          target="_blank"
          rel="noopener noreferrer"
          className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5'
          aria-label='Share on Pinterest'
        >
          <FaPinterestP size={14} />
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
  const designId = props?.id ? String(props.id) : "";
  const isValidDesignId = designId && designId !== "undefined" && designId !== "false";
  const basePath = isValidDesignId ? `/api/design/${designId}` : null;
  
  // Fetcher memoizado para evitar re-creaciones
  const fetcher = useMemo(() => 
    async (...args) => {
      const response = await fetch(...args);
      if (!response.ok) {
        let errorMessage = "Failed to fetch design";
        try {
          const errorData = await response.json();
          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Keep fallback error message when API payload is unavailable
        }
        throw new Error(errorMessage);
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
      <div className='min-h-screen bg-base-100 px-4 py-10'>
        <div className='mx-auto max-w-4xl rounded-3xl border border-error/40 bg-base-200/70 p-8 text-center shadow-xl'>
          <div>
            <h1 className='text-2xl font-bold text-error'>Design not found</h1>
            <p className='py-4 text-base-content/70'>{error.message || 'The design you are looking for could not be loaded.'}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className='min-h-screen bg-base-100 px-4 py-10'>
        <div className='mx-auto flex max-w-4xl items-center justify-center rounded-3xl border border-base-300 bg-base-200/70 p-10 shadow-xl'>
          <div className='loading loading-infinity loading-lg text-primary'></div>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className='min-h-screen bg-base-100 px-4 py-10'>
        <div className='mx-auto max-w-4xl rounded-3xl border border-base-300 bg-base-200/70 p-8 text-center shadow-xl'>
          <div>
            <h1 className='text-2xl font-bold text-base-content'>No design data available</h1>
            {!isValidDesignId && (
              <p className='py-4 text-base-content/70'>Invalid design id received in the URL.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className='min-h-screen bg-base-100 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl rounded-3xl border border-base-300 bg-base-200/50 p-4 shadow-xl backdrop-blur md:p-8'>
        <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
          <div className='overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl'>
            <Carousel
              autoPlay
              dynamicHeight={false}
              showThumbs={false}
              className='rounded-2xl'
              swipeable
              emulateTouch
              showStatus={false}
            >
              <div key='main-image' className='bg-base-200 p-4'>
                <Image
                  src={design.photo}
                  width={700}
                  height={700}
                  alt={design.title}
                  className='mx-auto h-auto w-full max-w-2xl rounded-xl object-contain shadow-lg'
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>

              {design.secondaryImages?.map((img, index) => (
                <div key={`secondary-${index}`} className='bg-base-200 p-4'>
                  <Image
                    src={img.SIUrl}
                    width={700}
                    height={700}
                    alt={`${design.title} - Image ${index + 2}`}
                    className='mx-auto h-auto w-full max-w-2xl rounded-xl object-contain shadow-lg'
                    loading='lazy'
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              ))}
            </Carousel>
          </div>

          <div className='rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg sm:p-8'>
            <div className='mb-5 flex justify-start'>
              <LikeButton desId={props.id} likesRecieve={design.likes} key={props.id} />
            </div>

            <h1 className='text-3xl font-extrabold capitalize leading-tight text-base-content sm:text-4xl'>
              {design.title}
            </h1>

            <p className='mt-4 text-base leading-relaxed text-base-content/80 sm:text-lg'>
              {design.description}
            </p>

            {validShops.length > 0 && (
              <div className='mt-7'>
                <p className='mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-base-content/60'>
                  Available at
                </p>
                <div className='flex flex-wrap gap-3'>
                  {validShops.map((shop) => (
                    <ShopLink key={shop.shopName} shop={shop} designId={props.id} designTitle={design.title} />
                  ))}
                </div>
              </div>
            )}

            {design.blogLink && (
              <div className='mt-7'>
                <Link
                  href={design.blogLink}
                  target="_blank"
                  className='inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-all duration-200 hover:opacity-90'
                >
                  Blog About {design.title}
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
    </section>
  );
}

export default memo(CardHero);
