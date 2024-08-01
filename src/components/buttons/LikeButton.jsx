"use client";
//imports de app
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import UseSWR from "swr";
//imports propios
import { LikesCounter } from "../extras/LikesCounter";
import { useCart } from "@/context/cartContext";

export function LikeButton({ desId, likesRecieve }) {
  //info de session
  const { data: session, status, update } = useSession();
  const { getCartInfo, cartContent, cart, cartUpdate, setCartUpdate } = useCart();
  const userId = session?.user._id;
  const userCart = session?.cart;

  //fetch para agregar
  let basePath = `/api/design`;
  //revisar actualizacion de dislike!!!!!!!!!!
  const [liked, setLiked] = useState(false);
  const [availableBtn, setAvailableBtn] = useState(false);
  const [likesCount, setLikesCount] = useState(likesRecieve);

  let formData = new FormData();

  const handleUserLikes = async (cartId) => {
    getCartInfo(cartId);
  };

  const chkPrevLikes = (cart, desIn) => {
    if (cart !== undefined) {
      const chk = cart?.findIndex((des) => des.design._id.toString() === desIn);
      if (chk !== -1) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    }
  };

  if (status === "authenticated") {
    handleUserLikes(userCart);
  }

  const chkSession = async () => {
    if (status === "authenticated") {
      formData.append("userId", userId);
    } else {
      formData.append("userId", null);
    }
  };

  useEffect(() => {
    chkPrevLikes(cart, desId);
  }, [cartContent, liked, cartUpdate]);

  const handleLiked = async () => {
    //agregar info de user
    chkSession();
    setLiked(!liked);
    //seguridad para no hacer tantas llamadas
    setAvailableBtn(true);
    setTimeout(() => {
      setAvailableBtn(false);
    }, "800");

    if (liked == false) {
      setLikesCount(likesCount + 1);
      basePath = `/api/design/${desId}?value=1`;
      let response = await fetch(basePath, {
        method: "PUT",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            toast("liked");
            setCartUpdate(!cartUpdate);
          }
        });
    } else {
      setLikesCount(likesCount - 1);
      basePath = `/api/design/${desId}?value=-1`;
      let response = await fetch(basePath, {
        method: "PUT",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            toast("disliked");
            //setTimeout(()=>setCartUpdate(!cartUpdate),"800")
            setCartUpdate(!cartUpdate);
          }
        });
    }
  };

  return (
    <>
      <button disabled={availableBtn} onClick={handleLiked}>
        {liked ? `♥` : `♡`}
      </button>
      {likesCount > 0 && <LikesCounter likeProp={likesCount} liked={liked} />}
    </>
  );
}
