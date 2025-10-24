"use client";

import { use } from "react";
import CardHero from "@/components/card/CardHero";

//imports de app

export default function detailDesign({ params }) {
  const { id } = use(params);
   
  return (
    <div>
      <CardHero id={id} />
    </div>
  );
}
