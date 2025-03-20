"use client";
import { useEffect, useState } from "react";

export function LikesCounter({ likeProp }) {
  const [likeCounter, setLikeCounter] = useState(likeProp);
  useEffect(() => {
    setLikeCounter(likeProp);
  }, [likeProp]);
  return (
    <div>
      <p>Liked {likeCounter} times</p>
    </div>
  );
}
