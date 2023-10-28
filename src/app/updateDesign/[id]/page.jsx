"use client";
import DesignUploader from "@/components/design/DesignUploader";
import { updateDesignPath } from "@/enums/SuperVariables";
import { useEffect, useState } from "react";
import CardDesign from "@/components/card/CardDesign";
import useSWR from "swr";

export default function detailUpdate({ params }) {
  const { id } = params;

  //get designs
  let basePath = `/api/design/${id}`;
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(basePath, fetcher);
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
            path={updateDesignPath}
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
