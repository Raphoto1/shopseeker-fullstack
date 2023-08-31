"use client";

import { useState } from "react";

export function LikeButton(desId) {
  
  const [liked, setLiked] = useState(false);
  const handleLiked = () => {
    setLiked(!liked)
    if (liked==false) {
      console.log('sumo1');
    } else {
      console.log('resto1');
    }
  }

  return <button onClick={handleLiked}>{liked ? `♥` : `♡`}</button>;
}
