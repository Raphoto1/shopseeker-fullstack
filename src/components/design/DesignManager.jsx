"use client";
//imports de app
import { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
//imports propios
import { categories, shops } from "@/enums/SuperVariables";
import PaginationControl from "@/components/buttons/PaginationControl";

export default function DesignManager(props) {
  const router = useRouter();
  const [userId] = useState(props.uId);
  const [pageIndex, setPageIndex] = useState(1);
  const [deleting, setDeleting] = useState(null); // Tracking which design is being deleted

  let userPath = "";
  if (userId === undefined) {
    userPath = "";
  } else {
    userPath = `&userId=${userId}`;
  }

  // API requests - get designs
  let basePath = `/api/design?page=${pageIndex}${userPath}`;
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR(basePath, fetcher);

  if (error) return <h1>❌ No designs found</h1>;
  if (isLoading)
    return (
      <div className='flex h-full w-full justify-center content-center'>
        <span className='loading loading-infinity loading-lg' />
      </div>
    );
  
  if (!data?.payload) {
    return <h1>No designs available</h1>;
  }
  
  const allDesigns = data.payload.docs || [];
  const paginationTotal = data.payload.totalPages || 0;

  // Manejar delete directamente en la card
  const handleDelete = async (designId, designTitle) => {
    if (!confirm(`🗑️ Design "${designTitle}" will be DELETED. This action cannot be undone.`)) {
      return;
    }

    setDeleting(designId);
    try {
      const result = await fetch(`/api/design/${designId}`, {
        method: "delete",
        credentials: "include",
      }).then((res) => res.json());

      if (result.error) {
        alert("❌ Error occurred deleting design");
      } else {
        alert("✅ Design Deleted successfully");
        mutate(); // Recargar la lista
      }
    } catch (err) {
      alert("❌ Error occurred deleting design");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-12 px-4'>
      <div className='max-w-6xl mx-auto'>
        
        {/* HEADER */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>📋 Designs Manager</h1>
          <p className='text-base-content/70'>Click Update or Delete directly to manage your designs</p>
        </div>

        {/* DESIGNS GRID */}
        {allDesigns.length === 0 ? (
          <div className='card bg-base-100 shadow-lg'>
            <div className='card-body items-center text-center'>
              <p className='text-lg'>📭 You don't have any designs yet</p>
              <Link href="/addDesign">
                <button className='btn btn-success mt-4'>⬆️ Upload Your First Design</button>
              </Link>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            {allDesigns.map((des) => (
              <div key={des._id} className='card bg-base-100 shadow-lg hover:shadow-xl transition-shadow overflow-hidden'>
                <figure className='relative h-48 w-full bg-base-200 overflow-hidden group'>
                  <Image 
                    src={des.photo} 
                    width={300} 
                    height={200} 
                    alt={des.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </figure>
                
                <div className='card-body p-4'>
                  <h2 className='card-title text-lg mb-4 line-clamp-2'>{des.title}</h2>
                  
                  {/* QUICK ACTIONS */}
                  <div className='card-actions flex-col gap-2'>
                    {/* VIEW BUTTON */}
                    <Link href={`/shops/${des._id}`} className='w-full' target="_blank" rel="noopener noreferrer">
                      <button className='btn btn-info btn-sm w-full hover:btn-info'>
                        👁️ View
                      </button>
                    </Link>
                    
                    {/* UPDATE & DELETE BUTTONS */}
                    <div className='w-full flex gap-2'>
                      <Link href={`/updateDesign/${des._id}`} className='flex-1'>
                        <button className='btn btn-primary btn-sm w-full hover:btn-primary'>
                          ✏️ Update
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(des._id, des.title)}
                        disabled={deleting === des._id}
                        className='btn btn-error btn-sm flex-1 hover:btn-error'
                      >
                        {deleting === des._id ? (
                          <span className='loading loading-spinner loading-sm'></span>
                        ) : (
                          '🗑️ Delete'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {paginationTotal > 1 && (
          <div className='flex justify-center'>
            <PaginationControl 
              totalPages={paginationTotal} 
              pageIndex={pageIndex} 
              currentPage={pageIndex} 
              setCurrentPage={setPageIndex} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
