"use client";
import DesignUploader from "@/components/design/DesignUploader";
import { updateDesignPath } from "@/enums/SuperVariables";
import { useEffect, useState } from "react";
import CardDesign from "@/components/card/CardDesign";
import UseSWR from "swr";
import { useParams } from "next/navigation";

export default function detailUpdate() {
  const params = useParams();
  const id = params.id;

  //get designs
  let basePath = id ? `/api/design/${id}` : null;
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = UseSWR(basePath, fetcher);
  
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center'>
        <span className='loading loading-infinity loading-lg' />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-12 px-4'>
        <div className='max-w-md mx-auto card bg-base-100 shadow-lg'>
          <div className='card-body items-center text-center'>
            <h2 className='card-title text-error'>❌ Error Loading Design</h2>
            <p>{error.message || "Could not fetch design data"}</p>
            <div className='card-actions'>
              <a href="/updateDesign" className='btn btn-primary'>← Back to Designs</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔧 Validar que data existe
  if (!data?.payload) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-12 px-4'>
        <div className='max-w-md mx-auto card bg-base-100 shadow-lg'>
          <div className='card-body items-center text-center'>
            <h2 className='card-title text-error'>❌ Design Not Found</h2>
            <p>The design with ID "{id}" does not exist or has been deleted.</p>
            <div className='card-actions'>
              <a href="/updateDesign" className='btn btn-primary'>← Back to Designs</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const des = data.payload;

  return (
    <div className='min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-12 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* HEADER */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>✏️ Update Design</h1>
          <p className='text-base-content/70'>Preview your current design and make changes</p>
        </div>

        {/* MAIN GRID */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          
          {/* LEFT: CURRENT DESIGN */}
          <div className='card bg-base-100 shadow-lg'>
            <div className='card-body'>
              <h2 className='card-title mb-4'>👁️ Current Design</h2>
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

          {/* RIGHT: UPDATE FORM */}
          <div className='card bg-base-100 shadow-lg h-fit sticky top-4'>
            <div className='card-body'>
              <h2 className='card-title mb-4'>📝 Edit Details</h2>
              <DesignUploader
                path={updateDesignPath}
                desId={id}
                method={"PUT"}
                pCode={des.pCode}
                title={des.title}
                description={des.description}
                category={des.category}
                blogLink={des.blogLink}
                photo={des.photo}
                secondaryImages={des.secondaryImages}
                shops={des.shops}
                likes={des.likes}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
