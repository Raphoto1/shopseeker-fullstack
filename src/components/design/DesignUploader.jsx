"use client";
// Imports de app
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UseSWR from "swr";
// Imports propios
import { categories, shops } from "@/enums/SuperVariables";
import HiddenInput from "../extras/HiddenInput";
import DnDSpaceSingle from "../extras/DnDSpaceSingle";
import DnDSpaceMultiple from "../extras/DnDSpaceMultiple";

export default function DesignUploader(props) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user._id;
  const [selectedBlogSlug, setSelectedBlogSlug] = useState("");

  // Estados
  const [oldSecondaryImages, setOldSecondaryImages] = useState(props.secondaryImages || []);
  const [SIToWork, setSIToWork] = useState([...oldSecondaryImages]);
  const [files, setFiles] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [shopsFromUpdate, setShopsFromUpdate] = useState(props.shops || []);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el loader

  // Referencia para el formulario
  const formRef = useRef(null);

  const blogPath = userId ? `/api/blog?owner=${userId}&limit=200&sortField=createdAt&sortQ=-1` : null;
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data: blogData, isLoading: isLoadingBlogs } = UseSWR(blogPath, fetcher);
  const availablePosts = blogData?.payload?.docs || [];

  useEffect(() => {
    const currentBlogLink = String(props.blogLink || "").trim();
    if (!currentBlogLink) {
      setSelectedBlogSlug("");
      return;
    }

    const match = currentBlogLink.match(/\/blog\/([^/?#]+)/i);
    setSelectedBlogSlug(match?.[1] || "");
  }, [props.blogLink]);

  // Manejo de imágenes secundarias
  const handleOldImages = useCallback((e) => {
    e.preventDefault();
    const capturedSIUrl = e.currentTarget.id;
    setSIToWork((prev) => prev.filter((img) => img.SIUrl !== capturedSIUrl));
  }, []);

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Mostrar loader
    const formData = new FormData(formRef.current);

    if (selectedBlogSlug) {
      formData.set("blogLink", `/blog/${selectedBlogSlug}`);
    } else {
      formData.set("blogLink", "");
    }

    if (SIToWork.length === 1) {
      formData.append("secondaryUpdate", JSON.stringify(oldSecondaryImages));
    }
    if (props.desId) {
      formData.append("id", props.desId);
    }
    formData.append("owner", userId);
    files.forEach((file) => formData.append("photo", file));
    multipleFiles.forEach((file) => formData.append("secondaryImages", file));

    try {
      const response = await fetch(props.path, {
        method: `${props.method}`,
        credentials: "include",
        body: formData,
      });
      
      // Verificar si la respuesta HTTP fue exitosa
      if (!response.ok) {
        const errorData = await response.json();
        console.error("HTTP Error:", errorData);
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      // Verificar si hay error en la respuesta
      if (data.error || data.status === "error") {
        toast.error(`Error uploading design: ${data.error}`);
      } 
      // Verificar respuesta exitosa
      else if (data.status === "success") {
        toast.success(data.message || "Design uploaded successfully!");
        router.push("/allshops");
      } 
      // Respuesta inesperada
      else {
        console.warn("Unexpected response format:", data);
        toast.warning("Upload completed, but response format was unexpected.");
        router.push("/allshops");
      }
    } catch (error) {
      console.error("Error uploading design:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsSubmitting(false); // Ocultar loader
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className='space-y-6 px-4'>
      
      {/* BASIC INFO */}
      <div className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Personal Code */}
          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-semibold'>Personal Code</span>
            </label>
            <input
              defaultValue={props.pCode || ""}
              type='text'
              id='pCode'
              name='pCode'
              placeholder='Enter personal code'
              className='input input-bordered input-sm focus:input-primary'
            />
          </div>

          {/* Title */}
          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-semibold'>Title *</span>
            </label>
            <input
              defaultValue={props.title || ""}
              type='text'
              id='title'
              name='title'
              placeholder='Design title'
              className='input input-bordered input-sm focus:input-primary'
              required
            />
          </div>

          {/* Category */}
          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-semibold'>Technique</span>
            </label>
            <select 
              name='category' 
              id='category' 
              className='select select-bordered select-sm focus:select-primary' 
              defaultValue={props.category || ""}
            >
              <option value="">Select a technique</option>
              {categories.map((cat, index) => (
                <option value={cat} key={index}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Blog Post Link */}
          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-semibold'>Linked Blog Post</span>
            </label>
            <select
              id='blogLinkSelector'
              value={selectedBlogSlug}
              onChange={(event) => setSelectedBlogSlug(event.target.value)}
              className='select select-bordered select-sm focus:select-primary'
            >
              <option value=''>No linked post</option>
              {availablePosts.map((post) => (
                <option key={post._id} value={post.slug}>
                  {post.title}
                </option>
              ))}
            </select>
            <p className='mt-1 text-xs opacity-70'>Select a post by title to link this design with its article.</p>
            {isLoadingBlogs && <p className='mt-1 text-xs opacity-60'>Loading posts...</p>}
          </div>
        </div>

        {/* Description */}
        <div className='form-control'>
          <label className='label'>
            <span className='label-text font-semibold'>Description</span>
          </label>
          <textarea
            defaultValue={props.description || ""}
            id='description'
            name='description'
            placeholder='Tell us about your design... (Max. 300 characters)'
            className='textarea textarea-bordered focus:textarea-primary h-24'
          />
        </div>

        {/* Shop URLs */}
        <div className='form-control'>
          <label className='label'>
            <span className='label-text font-semibold'>📱 Shop URLs</span>
          </label>
          <div className='bg-base-200 rounded-lg p-4 space-y-3'>
            {shops.map((shop, index) => (
              <HiddenInput shopName={shop} key={index} shopsFromUpdate={shopsFromUpdate} />
            ))}
          </div>
        </div>
      </div>

      {/* IMAGES SECTION */}
      <div className='divider'>Images</div>
      
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        
        {/* MAIN IMAGE */}
        <div>
          <h3 className='font-semibold mb-3 flex items-center gap-2'>🖼️ Main Image *</h3>
          <div className='bg-base-200 rounded-lg p-6 min-h-48 flex items-center justify-center border-2 border-dashed border-base-300'>
            <DnDSpaceSingle files={files} setFiles={setFiles} />
          </div>
        </div>

        {/* SECONDARY IMAGES */}
        <div>
          <h3 className='font-semibold mb-3 flex items-center gap-2'>🎨 Secondary Images</h3>
          <div className='bg-base-200 rounded-lg p-6 min-h-48 flex items-center justify-center border-2 border-dashed border-base-300 mb-4'>
            <DnDSpaceMultiple files={multipleFiles} setFiles={setMultipleFiles} />
          </div>

          {/* Existing Secondary Images */}
          {oldSecondaryImages.length > 0 && (
            <div className='mt-4'>
              <h4 className='text-sm font-semibold mb-3'>📸 Current Images ({oldSecondaryImages.length})</h4>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                {oldSecondaryImages.map((image, index) => (
                  <div key={index} className='relative group'>
                    <Image 
                      src={image.SIUrl} 
                      width={100} 
                      height={100} 
                      alt={`Secondary ${index + 1}`} 
                      className='rounded-lg w-full h-auto object-cover' 
                      loading='lazy' 
                      style={{ width: 'auto', height: 'auto' }} 
                    />
                    <button 
                      className='absolute top-1 right-1 btn btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity' 
                      id={image.SIUrl} 
                      onClick={handleOldImages}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className='flex justify-end gap-3 pt-4'>
        <button 
          type='button' 
          onClick={() => router.back()}
          className='btn btn-ghost'
        >
          ← Cancel
        </button>
        <button 
          type='submit' 
          disabled={isSubmitting}
          className='btn btn-primary btn-lg gap-2'
        >
          {isSubmitting ? (
            <>
              <span className='loading loading-spinner loading-sm'></span>
              Uploading...
            </>
          ) : (
            <>
              ⬆️ Upload Design
            </>
          )}
        </button>
      </div>
    </form>
  );
}
