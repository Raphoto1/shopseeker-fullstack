"use client";
// Imports de app
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// Imports propios
import { categories, shops } from "@/enums/SuperVariables";
import HiddenInput from "../extras/HiddenInput";
import DnDSpaceSingle from "../extras/DnDSpaceSingle";
import DnDSpaceMultiple from "../extras/DnDSpaceMultiple";

export default function DesignUploader(props) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user._id;

  // Estados
  const [oldSecondaryImages, setOldSecondaryImages] = useState(props.secondaryImages || []);
  const [SIToWork, setSIToWork] = useState([...oldSecondaryImages]);
  const [files, setFiles] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [shopsFromUpdate, setShopsFromUpdate] = useState(props.shops || []);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el loader

  // Referencia para el formulario
  const formRef = useRef(null);

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
      const data = await response.json();

      if (data.error) {
        toast.error(`Error loading design: ${data.error}`);
      } else {
        toast.success("Uploaded successfully! Reload for new upload.");
        router.push("/allshops");
      }
    } catch (error) {
      console.error("Error uploading design:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }finally {
      setIsSubmitting(false); // Ocultar loader
    }
  };

  return (
    <>
      <h2 className="text-center text-2xl">Uploader</h2>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="grid grid-flow-row xl:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 gap-2 pt-2 px-1 pb-2">
          {/* Información del diseño */}
          <div className="flex justify-center">
            <div className="textData flex-grid px-1">
              <div className="justify-center">
                <label htmlFor="pCode" className="px-1">Personal Code</label>
                <input
                  defaultValue={props.pCode || ""}
                  type="text"
                  id="pCode"
                  name="pCode"
                  className="input input-sm input-bordered max-w-xs w-full rounded-lg px-1 py-2"
                />
              </div>
              <div className="justify-center">
                <label htmlFor="title" className="px-1">Title</label>
                <input
                  defaultValue={props.title || ""}
                  type="text"
                  id="title"
                  name="title"
                  className="input input-sm input-bordered max-w-xs w-full rounded-lg px-1 py-2"
                />
              </div>
              <div className="py-2">
                <textarea
                  defaultValue={props.description || ""}
                  id="description"
                  name="description"
                  className="textarea textarea-bordered h-24 w-full max-w-xs py-2"
                  placeholder="Description (Max. 300 characters)"
                />
              </div>
              <div>
                <label htmlFor="blogLink" className="px-1">Blog/post/process Link</label>
                <input
                  defaultValue={props.blogLink || ""}
                  type="text"
                  id="blogLink"
                  name="blogLink"
                  className="input input-sm input-bordered max-w-xs w-full rounded-lg px-1 py-2"
                />
              </div>
              <div>
                <label htmlFor="category" className="px-2">Technique</label>
                <select
                  name="category"
                  id="category"
                  className="select select-sm select-bordered w-full max-w-xs"
                  defaultValue={props.category || ""}
                >
                  {categories.map((cat, index) => (
                    <option value={cat} key={index}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="shopsPack">
                <label htmlFor="shops" className="bold">URL to Shops</label>
                <div className="max-w-xs">
                  {shops.map((shop, index) => (
                    <HiddenInput shopName={shop} key={index} shopsFromUpdate={shopsFromUpdate} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Imagen principal */}
          <div className="flex justify-center align-middle items-center">
            <div className="mainImageDrop justify-center">
              <h2 className="text-center">Main Image</h2>
              <DnDSpaceSingle files={files} setFiles={setFiles} />
            </div>
          </div>

          {/* Imágenes secundarias */}
          <div className="flex justify-center align-middle items-center">
            <div className="secondaryImageDrop justify-center">
              <h2 className="text-center">Secondary Images</h2>
              <DnDSpaceMultiple files={multipleFiles} setFiles={setMultipleFiles} />
              {oldSecondaryImages.length > 0 && (
                <div className="oldSecondary block pt-5">
                  <h2>Actual Secondary Images</h2>
                  <div className="grid grid-flow-row xl:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-2 pt-2 px-1">
                    {oldSecondaryImages.map((image, index) => (
                      <div key={index} className="relative">
                        <button
                          className="EliminateImage absolute btn btn-xs btn-error"
                          id={image.SIUrl}
                          onClick={handleOldImages}
                        >
                          X
                        </button>
                        <Image
                          src={image.SIUrl}
                          width={100}
                          height={100}
                          alt={props.title || "Secondary Image"}
                          className="rounded"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-center">
            {isSubmitting ? (
              <button className="btn btn-disabled loading">Submitting...</button>
            ) : (
              <input type="submit" className="btn" value="Send" />
            )}
          </div>
        </div>
      </form>
    </>
  );
}
