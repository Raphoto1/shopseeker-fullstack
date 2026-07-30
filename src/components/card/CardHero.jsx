"use client";
//imports de app
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { FaFacebookF, FaPalette, FaPinterestP, FaXTwitter } from "react-icons/fa6";

//imports propios
import { LikeButton } from "@/components/buttons/LikeButton";
import { event as trackEvent } from "@/gtag";
import ArtisticCopyViewModal from "../modals/ArtisticCopyViewModal";

const SHOP_ICON_MAP = {
  RedBubble: "/img/icons/RedBubble.png",
  Society6: "/img/icons/Society6.png",
  Displate: "/img/icons/Displate.png",
  TeePublic: "/img/icons/TeePublic.png",
  Spreadshirt: "/img/icons/Spreadshirt.png",
  Threadless: "/img/icons/Threadless.png",
};

const getShopIconSrc = (shopName) => SHOP_ICON_MAP[shopName] || "/img/icons/shoppingCart.png";

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

const ShopLink = memo(({ shop, design, designId }) => {
  const isArtisticCopy = shop.shopName === "Artistic Copy";
  const hasShopUrl = shop.shopUrl && shop.shopUrl !== "null";

  if (isArtisticCopy) {
    return (
      <div className='flex justify-center'>
        <ArtisticCopyViewModal
          id={shop._id || `${designId}-artistic-copy`}
          triggerClassName='transition-transform hover:scale-105'
          designData={{
            id: designId,
            title: design.title,
            category: design.category,
            description: design.description,
            price: design.price,
          }}
          artisticData={shop}
        >
          <div className='flex items-center gap-3 rounded-full border border-base-300 bg-base-200 px-3 py-2 text-left text-xs font-medium text-base-content/70'>
            <div className='flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-sm'>
              <FaPalette size={18} aria-hidden='true' />
            </div>
          </div>
        </ArtisticCopyViewModal>
      </div>
    );
  }

  if (!hasShopUrl) return null;

  return (
    <div className='flex justify-center'>
      <Link
        href={shop.shopUrl}
        passHref={true}
        target='_blank'
        rel='noopener noreferrer'
        onClick={() => trackShopClick({ shopName: shop.shopName, shopUrl: shop.shopUrl, designId, designTitle: design.title })}
        className='group inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'
      >
        <Image
          width={50}
          height={50}
          src={getShopIconSrc(shop.shopName)}
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

const ShareButtons = ({ design }) => {
  const shareTitle = design?.title || "Design";
  const shareText = design?.description || shareTitle;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://creativerafa.com";
  const shareUrl = `${siteUrl.replace(/\/$/, "")}/shops/${design?.id}`;

  const openShareWindow = (url) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    openShareWindow(facebookUrl);
  };

  const handlePinterestShare = () => {
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(design?.photo || "")}&description=${encodeURIComponent(shareText)}`;
    openShareWindow(pinterestUrl);
  };

  const handleXShare = () => {
    const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    openShareWindow(xUrl);
  };

  return (
    <div className='flex flex-wrap justify-center gap-2'>
      <button
        type='button'
        className='btn btn-outline btn-sm'
        onClick={handleFacebookShare}
        aria-label='Share on Facebook'
        title='Share on Facebook'
      >
        <FaFacebookF />
      </button>
      <button
        type='button'
        className='btn btn-outline btn-sm'
        onClick={handlePinterestShare}
        aria-label='Share on Pinterest'
        title='Share on Pinterest'
      >
        <FaPinterestP />
      </button>
      <button
        type='button'
        className='btn btn-outline btn-sm'
        onClick={handleXShare}
        aria-label='Share on X'
        title='Share on X'
      >
        <FaXTwitter />
      </button>
    </div>
  );
};

export default memo(function CardHero(props) {
   //api requests
  //get designs
  const { id } = props;
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

  const validShops = useMemo(() => {
    if (!design?.shops) return [];
    return design.shops.filter(shop => shop.shopUrl && shop.shopUrl !== "null");
  }, [design]);

  if (isLoading) {
    return <div className='min-h-screen flex items-center justify-center'>Loading...</div>;
  }

  if (error) {
    return (
      <div className='min-h-screen bg-base-100 px-4 py-10'>
        <div className='mx-auto max-w-4xl rounded-3xl border border-base-300 bg-base-200/70 p-8 text-center shadow-xl'>
          <div>
            <h1 className='text-2xl font-bold text-base-content'>Error loading design</h1>
            <p className='py-4 text-base-content/70'>{error.message}</p>
          </div>
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
              <LikeButton desId={id} likesRecieve={design.likes} key={id} />
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
                    <ShopLink key={shop.shopName} shop={shop} design={design} designId={id} />
                  ))}
                </div>
              </div>
            )}

            {design.blogLink && (
              <div className='mt-7'>
                <Link
                  href={design.blogLink}
                  target='_blank'
                  className='inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-all duration-200 hover:opacity-90'
                >
                  Blog About {design.title}
                </Link>
              </div>
            )}

            <div className='mt-7'>
              <ShareButtons design={design} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
