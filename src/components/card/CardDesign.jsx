"use client";
import Image from "next/image";
import { LikeButton } from "../buttons/LikeButton";
import Link from "next/link";
import { event as trackEvent } from "@/gtag";
import { FaPalette } from "react-icons/fa6";

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
      source_component: "CardDesign",
    },
  });
};

export default function CardDesign(props) {

  return (
    <>
      <div className='card bg-base-100 shadow-xl stretch h-full glass w-auto' key={props.id}>
        <div className='flex justify-around '>
          <LikeButton desId={props.id} likesRecieve={props.likes} key={props.id}/>
        </div>
        <figure>
          <Image src={props.photo} width={500} height={500} alt={props.title} loading="lazy" style={{ width: 'auto', height: 'auto' }}></Image>
        </figure>
        <div className='card-body flex items-center'>
          <h1 className='card-title capitalize'>{props.title}</h1>
          <h3>{props.category}</h3>
          <p className='text-center line-clamp-3'>{props.description}</p>
          <div className='p-2 grid grid-flow-col auto-cols-auto gap-3 content-center'>
            {props.shops.map((shop, index) => {
              const isArtisticCopy = shop.shopName === "Artistic Copy";

              if (isArtisticCopy) {
                return (
                  <div key={`${shop.shopName}-${index}`} className='flex justify-center mx-auto content-center'>
                    <div className='inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-base-300 bg-base-100 text-primary shadow-sm'>
                      <FaPalette size={20} aria-hidden='true' />
                    </div>
                  </div>
                );
              }

              return shop.shopUrl === "null" ? null : (
                <div key={`${shop.shopName}-${index}`} className='flex justify-center mx-auto content-center'>
                  <Link
                    href={`${shop.shopUrl}`}
                    passHref={true}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={() => trackShopClick({ shopName: shop.shopName, shopUrl: shop.shopUrl, designId: props.id, designTitle: props.title })}
                    className='flex-auto content-center'
                  >
                    <Image
                      width={"50"}
                      height={"50"}
                      src={getShopIconSrc(shop.shopName)}
                      alt={shop.shopName}
                      loading="lazy"
                      className="bg-slate-50 rounded-full"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
          {props.blogLink?<div className='card-actions justify-center'>
                      <Link href={props.blogLink}>
                        <button className='btn btn-primary'>Blog About {props.title}</button>
                      </Link>
                    </div>:null}
          <div className='card-actions justify-center'>
            <Link href={`/shops/${props.id}`}>
              <button className='btn btn-primary'>Show More</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
