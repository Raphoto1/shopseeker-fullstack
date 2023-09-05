"use client";
//imports de app
import { useState } from "react";
import useSWR from "swr";

export function LikeButton({ desId, likedSend }) {
  //fetch para agregar
  let basePath = `/api/design`;

  const [liked, setLiked] = useState(false);
  const [availableBtn, setAvailableBtn] = useState(false);
  const handleLiked = async () => {
    setLiked(!liked);
    likedSend(liked);
    //seguridad para no hacer tantas llamadas
    setAvailableBtn(true);
    setTimeout(() => {
      setAvailableBtn(false);
    }, "500");

    if (liked == false) {
      basePath = `/api/design/${desId}?value=1`;
      console.log(basePath);
      let response = await fetch(basePath, {
        method: "PUT",
      })
        .then((res) => res.json())
        .then((data) => {        });
    } else {
      console.log("resto1");
      basePath = `/api/design/${desId}?value=-1`;
      console.log(basePath);
      let response = await fetch(basePath, {
        method: "PUT",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
      console.log(data);
    }
  };

  return (
    <button disabled={availableBtn} onClick={handleLiked}>
      {liked ? `♥` : `♡`}
    </button>
  );
}
