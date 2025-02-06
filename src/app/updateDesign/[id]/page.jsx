"use client";
import DesignUploader from "@/components/design/DesignUploader";
import { updateDesignPath } from "@/enums/SuperVariables";
import { useEffect, useState } from "react";
import CardDesign from "@/components/card/CardDesign";
import UseSWR from "swr";

export default function detailUpdate({ params }) {
  const { id } = params;

  //get designs
  let basePath = `/api/design/${id}`;
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = UseSWR(basePath, fetcher);
  if (error) return <h1>Not designs found</h1>;
  if (isLoading) return <h1>Loading...</h1>;

  const des = data.payload;

  return (
    <>
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex w-100  h-50'>
          <div className="h-fit">
            <h3 className="text-center">Current Design</h3>
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
