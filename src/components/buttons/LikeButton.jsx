"use client";
//imports de app
import { useState } from "react";
import useSWR from "swr";
import {  toast } from "react-toastify";

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
    }, "800");

    if (liked == false) {
      basePath = `/api/design/${desId}?value=1`;
      console.log(basePath);
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
      console.log("resto1");
      basePath = `/api/design/${desId}?value=-1`;
      console.log(basePath);
      let response = await fetch(basePath, {
        method: "PUT",
      })
        .then((res) => res.json())
        .then((data) => {
          toast("disliked")
        });
    }
  };

  return (
    <>
      <button disabled={availableBtn} onClick={handleLiked}>
        {liked ? `♥` : `♡`}
      </button>

    </>
  );
}
