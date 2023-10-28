"use client";
//imports de app
import { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
//imports propios
import { categories, shops } from "@/enums/SuperVariables";

export default function UpdateDesign() {
  //control opciones de fields
  const [isShopsOn, setShopsOn] = useState(false);
  const [isPhotoOn, setPhotoOn] = useState(false);
  const [isCategoryOn, setCategoryOn] = useState(false);
  const [idChecked, setIdChecked] = useState(false);
  const [isSecondaryOn, setSecondaryOn] = useState(false);
  const [chkEnabled, setChkEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectValue, setselectValue] = useState("title");

  //hanlders
  const handleIdCheck = (e) => {
    const desId = e.target.id
    setIdChecked(desId);
    setChkEnabled(!chkEnabled)
setShowModal(!showModal)
  };


  const handlePhoto = () => {
    setPhotoOn(!isPhotoOn);
  };

  const handleShops = () => {
    setShopsOn(!isShopsOn);
  };

  const handleCategory = () => {
    setCategoryOn(!isCategoryOn);
  };

  const handleSecondary = () => {
    setSecondaryOn(!isSecondaryOn);
  };

  const handleModal = () => {
    console.log('modal');
    setShowModal(!showModal)
  }

  //api requests
  //get designs
  let basePath = `/api/design`;
  const fetcher = async (...args) => await fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(basePath, fetcher);
  if (error) return <h1>Not designs found</h1>;
  if (isLoading) return <h1>Loading...</h1>;
  const allDesigns = data.payload.docs;
  
  //update request
  const handleSubmitUpdate = async (e) => {
    let form = document.querySelector("form");
    e.preventDefault();
    let formData = new FormData(form);
    console.log(formData);
    let idCaptured = idChecked;
    formData.append("idCaptured", idCaptured);
    let response = await fetch("/api", {
      method: "PUT",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.status);
        if (data.status === 200) {
          alert(`success`);
        }
      });
  };

  return (
    <div>
      <h1>update design</h1>
      <h2>list of designs</h2>
      <div className='overflow-x-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th>
                
              </th>
              <th>Id</th>
              <th>Main Image</th>
              <th>Title</th>
            </tr>
            {allDesigns.map((des) => (
              <tr key={des._id}>
                <th>
                  <input type='checkbox' disabled={chkEnabled} className='checkbox' id={des._id} name={des._id} value={des.id} onChange={handleIdCheck} />
                </th>
                <th>{des._id}</th>
                <th>
                  <Image src={des.photo} width={100} height={100} alt={des.title}/>
                </th>
                <th>{des.title}</th>
              </tr>
            ))}
          </thead>
        </table>
      </div>
      <Link href={`/updateDesign/${idChecked}`}>
        <button className="btn"> abrir</button>
      </Link>
      {/* {showModal&&(<div className="" id="myModal">
        <div className='flex items-center justify-center pt-5 modal-box'>
          <div className='flex items-center justify-center border-4 rounded-lg w-fit h-fit px-5 py-5'>
            <form onSubmit={handleSubmitUpdate} className='flex flex-col space-y-1'>
              <label for='id'>design Id</label>
              <input type='text' name='id' className='dark:text-gray-900' />
              <br />
              <label for='field'>field to update</label>
              <select
                name='field'
                id='valueSelect'
                onChange={(e) => {
                  if (e.target.value === "shops") {
                    handleShops();
                    setPhotoOn(false);
                    setCategoryOn(false);
                    setSecondaryOn(false);
                  } else if (e.target.value === "photo") {
                    handlePhoto();
                    setShopsOn(false);
                    setCategoryOn(false);
                    setSecondaryOn(false);
                  } else if (e.target.value === "category") {
                    handleCategory();
                    setPhotoOn(false);
                    setShopsOn(false);
                    setSecondaryOn(false);
                  } else if (e.target.value === "secondaryImages") {
                    handleSecondary();
                    setCategoryOn(false);
                    setPhotoOn(false);
                    setShopsOn(false);
                  } else {
                    setShopsOn(false);
                    setPhotoOn(false);
                    setCategoryOn(false);
                    setSecondaryOn(false);
                  }
                }}
                className='dark:text-gray-900'>
                <option value='title' selected>
                  title
                </option>
                <option value='description'>description</option>
                <option value='category'>category</option>
                <option value='price'>price</option>
                <option value='stock'>stock</option>
                <option value='photo'>photo</option>
                <option value='secondaryImages'>Secondary Images</option>
                <option value='shops'>shops</option>
              </select>
              {isShopsOn && (
                <div>
                  <h1>choose the shop url to Update</h1>
                  <select name='data' id='shop' className='dark:text-gray-900'>
                    {shops.map((shop, index) => (
                      <option value={shop} key={index}>
                        {shop}
                      </option>
                    ))}
                  </select>
                  <div>
                    <label htmlFor='url'>New Url</label>
                    <br />
                    <input type='text' name='url' id='url' className='dark:text-gray-900' />
                  </div>
                </div>
              )}
              {isPhotoOn && (
                <div>
                  <input type='file' name='photo' id='photo' />
                </div>
              )}
              {isSecondaryOn && (
                <div>
                  <input type='file' name='secondaryImages' id='secondaryImages' multiple />
                </div>
              )}
              {isCategoryOn && (
                <div>
                  <select name='data' id='category'>
                    {categories.map((cat, index) => (
                      <option value={cat} key={index}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <br />
              {!isPhotoOn && !isShopsOn && !isCategoryOn && !isSecondaryOn &&(
                <div>
                  <label for='data'> new value</label>
                  <div id='dataContainer'>
                    <input type='text' name='data' id='data' className='dark:text-gray-900' />
                  </div>
                </div>
              )}
              <br />
              <button type="submit">
                Update Design
              </button>
            </form>
          </div>
        </div>
      </div>)} */}
    </div>
  );
}
