"use client";

import CardHero from "@/components/CardHero";

//imports de app


export default function detailDesign({ params }) {
  const { id } = params;
   
  return (
    <div>
      <CardHero id={id} />
    </div>
  );
}
