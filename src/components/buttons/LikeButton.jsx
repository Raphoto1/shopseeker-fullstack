"use client";
//imports de app
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LikesCounter } from "../extras/LikesCounter";

export function LikeButton({ desId, likesRecieve }) {
  //fetch para agregar
  let basePath = `/api/design`;

  const [liked, setLiked] = useState(false);
  const [availableBtn, setAvailableBtn] = useState(false);
  const [likesCount, setLikesCount] = useState(likesRecieve);

  const handleLiked = async () => {
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
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            toast("liked");
          }
        });
    } else {
      setLikesCount(likesCount - 1);
      basePath = `/api/design/${desId}?value=-1`;
      let response = await fetch(basePath, {
        method: "PUT",
      })
        .then((res) => res.json())
        .then((data) => {
          toast("disliked");
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
