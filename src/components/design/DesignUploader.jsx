"use client";
//imports de app
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
//imports propios
import { categories, shops } from "@/enums/SuperVariables";
import HiddenInput from "../extras/HiddenInput";
import DnDSpaceSingle from "../extras/DnDSpaceSingle";
import DnDSpaceMultiple from "../extras/DnDSpaceMultiple";
import DnDTest from "../extras/DnDTest";

export default function DesignUploader(props) {
  const router = useRouter();
  //user
  const { data: session, status, update } = useSession();

  const userId = session?.user._id;
  //capturar imagenes secundarias
  const [oldSecondaryImages, setOldSecondaryImages] = useState([]);
  const [SIToWork, setSIToWork] = useState([...oldSecondaryImages]);
  const [photoFile, setPhotoFile] = useState([]);
  const [files, setFiles] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState([]);
  //revisar si existeel diseño y llenar con la data
  const [shopsFromUpdate, setShopsFromUpdate] = useState([]);

  useEffect(() => {
    if (props.shops) {
      setShopsFromUpdate(props.shops);
    }
    if (props.secondaryImages) {
      setOldSecondaryImages(props.secondaryImages);
    }
  }, [props]);
  //handlers de old Images
  const handleOldImages = (e) => {
    e.preventDefault(e);
    const capturedSIUrl = e.currentTarget.id;
    oldSecondaryImages.forEach((img, index) => {
      if (img.SIUrl === capturedSIUrl) {
        setSIToWork(oldSecondaryImages.splice(index, 1));
      }
    });
  };

  //se agrega desId en los props para update
  const handleSubmit = async (e) => {
    let form = document.querySelector("form");
    e.preventDefault();
    let formData = new FormData(form);
    if (SIToWork.length === 1) {
      formData.append("secondaryUpdate", JSON.stringify(oldSecondaryImages));
    }
    if (props.desId) {
      formData.append("id", props.desId);
    }
    formData.append("owner", userId);
    files.forEach((file) => formData.append("photo", file));
    multipleFiles.forEach((file) => formData.append("secondaryImages", file));
    console.log(formData);

    let response = await fetch(props.path, {
      method: props.method,
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast(`Error Loading design, try again${data.error}`);
        } else {
          toast("uploaded successfully, reload for new upload");
          router.push("/allshops");
        }
      })
      .then(() => {});
  };

  return (
    <>
      <h2 className="text-center text-2xl">Uploader</h2>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-flow-row xl:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 gap-2 pt-2 px-1 pb-2'>
          <div className="flex justify-center">
            <div className='textData flex-grid px-1'>
              <div className='justify-center'>
                <label htmlFor='pCode' className='px-1'>
                  Personal Code
                </label>
                <input
                  placeholder={props.pCode ? props.pCode : "Your personal Code/not required"}
                  type='text'
                  id='pCode'
                  name='pCode'
                  className='input input-sm input-bordered max-w-xs w-full rounded-lg px-1 py-2'
                />
              </div>
              <div>
                <label htmlFor='title' className='px-1'>
                  Title
                </label>
                <input
                  placeholder={props.title ? props.title : "Name your work"}
                  type='text'
                  id='title'
                  name='title'
                  className='input input-sm input-bordered max-w-xs w-full rounded-lg px-1 py-2'
                />
              </div>
              <div className='py-2'>
                <textarea
                  type='text-area'
                  id='description'
                  name='description'
                  className='textarea textarea-bordered h-24 w-full max-w-xs py-2'
                  placeholder={props.description ? props.description : "description, Max.300 Characters"}
                />
              </div>
              <div>
                <label htmlFor='category' className='px-2'>
                  {" "}
                  Technique
                </label>
                <select name='category' id='category' className='select select-sm select-bordered w-full max-w-xs'>
                  {categories.map((cat, index) => (
                    <option value={cat} key={index} selected={props.category == cat ? true : false}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className='shopsPack '>
                <div className='flex flex-col justify-center items-center'>
                  <label htmlFor='shops' className='bold'>
                    URL to Shops
                  </label>
                </div>
                <div className='max-w-xs'>
                  {shops.map((shop, index) => (
                    <HiddenInput shopName={shop} key={index} shopsFromUpdate={shopsFromUpdate} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-center align-middle items-center'>
            <div className='mainImageDrop justify-center'>
              <h2 className='text-center'>Main Image</h2>
              <div className='flex justify-center'>
                <DnDSpaceSingle files={files} setFiles={setFiles} />
              </div>
            </div>
          </div>
          <div className="flex justify-center align-middle items-center">
            <div className='secondaryImageDrop justify-center'>
              <h2 className='text-center'>Secondary Images</h2>
              <DnDSpaceMultiple files={multipleFiles} setFiles={setMultipleFiles} />
              {props.secondaryImages && (
                <div className='oldSecondary block pt-5'>
                  <h2>Actual Secondary Images</h2>
                  <div className='grid grid-flow-row xl:grid-cols-2 md:grid-cols-2 sm:grid-cols-2  xs:grid-cols-2 gap-2 pt-2 px-1'>
                    {oldSecondaryImages.map((image, index) => (
                      <div key={image}>
                        <button className='EliminateImage absolute btn btn-xs btn-error' id={image.SIUrl} onClick={handleOldImages}>
                          X
                        </button>
                        <Image src={image.SIUrl} width={100} height={100} alt={props.title} className='rounded' />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='flex justify-center'>
            <input type='submit' className='btn' placeholder='Send' />
          </div>
        </div>
      </form>
    </>
  );
}
