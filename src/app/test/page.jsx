"use client";
import DesignUploader from "@/components/design/DesignUploader";
import { updateDesignPath } from "@/enums/SuperVariables";
import { useEffect, useState } from "react";
import CardDesign from "@/components/card/CardDesign";
import UseSWR from "swr";

export default function test({ params }) {
  const { id } = params;

  //get designs
  let basePath = `/api/design/6537e87b41fb8d6d8fad1dea`;
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = UseSWR(basePath, fetcher);
  if (error) return <h1>Not designs found</h1>;
  if (isLoading) return <h1>Loading...</h1>;

  const des = data.payload;

  return (
    <>
      <div className='flex'>
        <div className='preview w-40'>
          <h3 className="block text-center">Current Design</h3>
          <CardDesign
            key={des._id}
            id={des._id}
            title={des.title}
            description={des.description}
            category={des.category}
            photo={des.photo}
            secondaryPhotos={des.secondaryImages}
            shops={des.shops}
            likes={des.likes}
          />
        </div>
        <div>
          <h2 className="block text-center">Let's Update</h2>
          <DesignUploader
            path={'/api'}
            desId={id}
            method={"PUT"}
            pCode={des.pCode}
            title={des.title}
            description={des.description}
            category={des.category}
            photo={des.photo}
            secondaryImages={des.secondaryImages}
            shops={des.shops}
            likes={des.likes}
          />
        </div>
      </div>
    </>
  );
}

