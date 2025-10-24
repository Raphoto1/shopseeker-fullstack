"use client";
import { useEffect, useState } from "react";

export function LikesCounter({ likeProp }) {
  const [likeCounter, setLikeCounter] = useState(likeProp || 0);
  
  useEffect(() => {
    setLikeCounter(likeProp || 0);
  }, [likeProp]);
  
  // No renderizar si no hay likes
  if (!likeCounter || likeCounter <= 0) {
    return null;
  }
  
  return (
    <div>
      <p>Liked {likeCounter} times</p>
    </div>
  );
}
